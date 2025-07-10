const API_BASE_URL = 'http://localhost:8080';

document.addEventListener('DOMContentLoaded', async () => {
    const formEmpresa = document.getElementById('formEmpresa');
    const tituloPagina = document.querySelector('h1.mt-4');
    const breadcrumbAtivo = document.querySelector('ol.breadcrumb .breadcrumb-item.active');
    const btnSalvar = formEmpresa ? formEmpresa.querySelector('button[type="submit"]') : null;
    
    const razaoSocialInput = document.getElementById('razaoSocial');
    const nomeFantasiaInput = document.getElementById('nomeFantasia');
    const cnpjInput = document.getElementById('cnpj');
    const setoresCheckboxesTableBody = document.getElementById('setoresCheckboxesTableBody');
    const noSetoresAvailableMessage = document.getElementById('noSetoresAvailableMessage');

    const urlParams = new URLSearchParams(window.location.search);
    const empresaId = urlParams.get('id');
    let isEditMode = false;
    let setoresVinculadosAtuais = new Set(); 
    let setoresSelecionadosIds = [];

    async function carregarTodosSetoresDisponiveis() {
        try {
            const response = await fetch(`${API_BASE_URL}/setores/listar`);
            if (!response.ok) {
                if (response.status === 204) return [];
                throw new Error(`Erro HTTP ao carregar todos os setores: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error("Erro de rede ao carregar setores disponíveis:", error);
            alert(`Erro ao carregar todos os setores disponíveis: ${error.message}`);
            return [];
        }
    }

    async function carregarSetoresJaVinculados(empresaId) {
        try {
            const response = await fetch(`${API_BASE_URL}/empresas_setores/buscaSetoresPorEmpresa/${empresaId}`);
            
            if (response.status === 204 || response.status === 404) {
                console.warn(`carregarSetoresJaVinculados: Nenhum setor vinculado ou empresa/endpoint não encontrado para ID ${empresaId}. Status: ${response.status}`);
                return [];
            }

            if (!response.ok) {
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    const errorData = await response.json();
                    console.error(`Erro do backend ao carregar setores vinculados (Status: ${response.status}):`, errorData);
                    alert(`Erro do servidor ao carregar setores vinculados: ${errorData.message || response.statusText}`);
                } else {
                    console.error(`Erro HTTP não JSON ao carregar setores vinculados! Status: ${response.status}`);
                    alert(`Erro desconhecido ao carregar setores vinculados. Status: ${response.status}`);
                }
                return [];
            }
            
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                const setores = await response.json();
                const ids = setores.map(setor => Number(setor.id));
                return ids;
            } else {
                console.error("carregarSetoresJaVinculados: Resposta OK, mas não é JSON. Retornando vazio.");
                alert("Erro: Resposta inesperada ao carregar setores vinculados.");
                return [];
            }

        } catch (error) {
            console.error(`Erro de conexão/parsing em carregarSetoresJaVinculados para empresa ${empresaId}:`, error);
            alert(`Erro de conexão ao carregar setores vinculados: ${error.message}`);
            return [];
        }
    }

    async function popularSetoresCheckboxes(empresaIdParaEdicao = null) {
        setoresCheckboxesTableBody.innerHTML = '';
        const todosSetores = await carregarTodosSetoresDisponiveis();
        let idsSetoresJaVinculados = [];

        if (empresaIdParaEdicao) {
            idsSetoresJaVinculados = await carregarSetoresJaVinculados(empresaIdParaEdicao);
            setoresVinculadosAtuais = new Set(idsSetoresJaVinculados);
        }

        if (todosSetores.length === 0) {
            noSetoresAvailableMessage.style.display = 'block';
            return;
        } else {
            noSetoresAvailableMessage.style.display = 'none';
        }

        todosSetores.forEach(setor => {
            const row = setoresCheckboxesTableBody.insertRow();
            const checkboxCell = row.insertCell();
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'form-check-input';
            checkbox.id = `setor-${setor.id}`;
            checkbox.value = setor.id;

            if (idsSetoresJaVinculados.includes(Number(setor.id))) {
                checkbox.checked = true;
            }
            checkboxCell.appendChild(checkbox);

            const idCell = row.insertCell();
            idCell.textContent = setor.id;

            const descricaoCell = row.insertCell();
            descricaoCell.textContent = setor.descricao;
        });
    }

    function formatarCnpj(valor) {
        valor = valor.replace(/\D/g, ''); 
        valor = valor.replace(/^(\d{2})(\d)/, '$1.$2');
        valor = valor.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
        valor = valor.replace(/\.(\d{3})(\d)/, '.$1/$2');
        valor = valor.replace(/(\d{4})(\d)/, '$1-$2');
        return valor.substring(0, 18);
    }

    function validarCnpj(cnpj) {
        cnpj = cnpj.replace(/[^\d]+/g, ''); 
        if (cnpj == '') return false;
        if (cnpj.length != 14) return false;
        if (cnpj == "00000000000000" || cnpj == "11111111111111" || cnpj == "22222222222222" || 
            cnpj == "33333333333333" || cnpj == "44444444444444" || cnpj == "55555555555555" || 
            cnpj == "66666666666666" || cnpj == "77777777777777" || cnpj == "88888888888888" || 
            cnpj == "99999999999999") return false;
            
        let tamanho = cnpj.length - 2;
        let numeros = cnpj.substring(0,tamanho);
        let digitos = cnpj.substring(tamanho);
        let soma = 0;
        let pos = tamanho - 7;
        for (let i = tamanho; i >= 1; i--) { soma += numeros.charAt(tamanho - i) * pos--; if (pos < 2) pos = 9; }
        let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        if (resultado != digitos.charAt(0)) return false;
            
        tamanho = tamanho + 1;
        numeros = cnpj.substring(0,tamanho);
        soma = 0;
        pos = tamanho - 7;
        for (let i = tamanho; i >= 1; i--) { soma += numeros.charAt(tamanho - i) * pos--; if (pos < 2) pos = 9; }
        resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        if (resultado != digitos.charAt(1)) return false;
        return true;
    }

    if (cnpjInput) { 
        cnpjInput.addEventListener('input', (e) => {
            e.target.value = formatarCnpj(e.target.value);
        });

        cnpjInput.addEventListener('blur', (e) => {
            const cnpjLimpo = e.target.value.replace(/\D/g, ''); 
            const cnpjFeedbackDiv = document.getElementById('cnpjFeedback'); 

            if (cnpjLimpo.length === 14 && validarCnpj(cnpjLimpo)) {
                cnpjInput.classList.remove('is-invalid');
                cnpjInput.classList.add('is-valid');
                if (cnpjFeedbackDiv) { cnpjFeedbackDiv.textContent = ''; }
            } else if (cnpjLimpo.length > 0) {
                cnpjInput.classList.remove('is-valid');
                cnpjInput.classList.add('is-invalid');
                if (cnpjFeedbackDiv) { cnpjFeedbackDiv.textContent = 'CNPJ inválido ou incompleto.'; }
            } else {
                cnpjInput.classList.remove('is-valid');
                cnpjInput.classList.remove('is-invalid');
                if (cnpjFeedbackDiv) { cnpjFeedbackDiv.textContent = 'Por favor, preencha o CNPJ.'; }
            }
        });
    }

    if (tituloPagina && breadcrumbAtivo && btnSalvar) {
        if (empresaId) {
            isEditMode = true;
            tituloPagina.textContent = 'Editar Empresa';
            breadcrumbAtivo.textContent = 'Edição';
            btnSalvar.textContent = 'Atualizar Empresa';
            btnSalvar.classList.remove('btn-primary');
            btnSalvar.classList.add('btn-warning');

            try {
                const response = await fetch(`${API_BASE_URL}/empresas/buscarId/${empresaId}`);
                if (!response.ok) {
                    alert('Empresa não encontrada para edição ou erro ao buscar.');
                    window.location.href = 'empresas.html';
                    return;
                }
                const empresa = await response.json();
                razaoSocialInput.value = empresa.razaoSocial;
                nomeFantasiaInput.value = empresa.nomeFantasia;
                cnpjInput.value = empresa.cnpj;

                await popularSetoresCheckboxes(empresaId);
            } catch (error) {
                console.error("Erro ao carregar dados da empresa para edição:", error);
                alert(`Erro ao carregar dados da empresa: ${error.message}`);
                window.location.href = 'empresas.html';
                return;
            }
        } else {
            await popularSetoresCheckboxes();
        }
    } else {
        console.error("Erro: Um ou mais elementos do cabeçalho/botão Salvar não foram encontrados no HTML.");
        return; 
    }
    
    if (formEmpresa) { 
        formEmpresa.addEventListener('submit', async (event) => {
            event.preventDefault();

            const cnpjLimpoParaEnvio = cnpjInput.value.replace(/\D/g, '');
            const cnpjFeedbackDiv = document.getElementById('cnpjFeedback');

            if (cnpjLimpoParaEnvio.length !== 14 || !validarCnpj(cnpjLimpoParaEnvio)) {
                cnpjInput.classList.remove('is-valid');
                cnpjInput.classList.add('is-invalid');
                if (cnpjFeedbackDiv) { cnpjFeedbackDiv.textContent = 'CNPJ inválido ou incompleto.'; }
                event.stopPropagation();
                formEmpresa.classList.add('was-validated');
                return;
            } else {
                cnpjInput.classList.remove('is-invalid');
                cnpjInput.classList.add('is-valid'); 
                if (cnpjFeedbackDiv) { cnpjFeedbackDiv.textContent = ''; }
            }

            if (!formEmpresa.checkValidity()) {
                event.stopPropagation();
                formEmpresa.classList.add('was-validated');
                return;
            }
            formEmpresa.classList.remove('was-validated');

            const razaoSocial = razaoSocialInput.value.trim();
            const nomeFantasia = nomeFantasiaInput.value.trim();
            const cnpj = cnpjInput.value;

            setoresSelecionadosIds = Array.from(document.querySelectorAll('#setoresCheckboxesTableBody input[type="checkbox"]:checked'))
                                                .map(checkbox => Number(checkbox.value));

            const empresaData = {
                razaoSocial: razaoSocial,
                nomeFantasia: nomeFantasia,
                cnpj: cnpj
            };

            let url = `${API_BASE_URL}/empresas/novo`;
            let method = 'POST';
            let successMessage = 'Empresa cadastrada com sucesso!';
            let errorMessage = 'Erro ao cadastrar empresa:';

            if (isEditMode) {
                url = `${API_BASE_URL}/empresas/editar/${empresaId}`;
                method = 'PUT';
                empresaData.id = empresaId;
                successMessage = 'Empresa atualizada com sucesso!';
                errorMessage = 'Erro ao atualizar empresa:';
            }

            try {
                const response = await fetch(url, {
                    method,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(empresaData)
                });

                if (response.ok) {
                    let empresaSalva = await response.json();
                    console.log("IDs de setores selecionados para sincronização:", setoresSelecionadosIds); 
                    await sincronizarSetores(empresaSalva.id, setoresSelecionadosIds);
                    alert(successMessage);
                    window.location.href = 'empresas.html';
                } else {
                    let errorData = {};
                    try {
                        errorData = await response.json();
                    } catch (parseError) {
                        console.warn('Resposta do servidor não contém JSON válido:', parseError);
                    }

                    let finalErrorMessage = `${errorMessage} Status: ${response.status}`;

                    if (errorData.message) {
                        finalErrorMessage += `\nMensagem: ${errorData.message}`;
                    } else if (response.status === 400) {
                        finalErrorMessage += `\nVerifique se os dados foram preenchidos corretamente.`;
                    } else if (response.status === 409) {
                        finalErrorMessage += `\nJá existe uma empresa cadastrada com esse CNPJ.`;
                    } else if (response.status === 404) {
                        finalErrorMessage += `\nJá existe uma empresa cadastrada com esse CNPJ.`;
                    } else {
                        finalErrorMessage += `\nResposta do servidor não está em formato esperado.`;
                    }

                    alert(finalErrorMessage);
                    console.error("Detalhes do erro do backend:", errorData);
                }


            } catch (error) {
                console.error("Erro na requisição ou parsing de JSON:", error);
                alert(`Erro de conexão ou dados: ${error.message}`);
            }
        });
    } else {
        console.error("Erro: Formulário com ID 'formEmpresa' não encontrado no HTML. O submit listener não será adicionado.");
    }

    async function sincronizarSetores(empresaId, novosSetoresIds) {
        const idsSetoresVinculadosAtuaisNoBackend = await carregarSetoresJaVinculados(empresaId);
        let setoresParaDesvincular = new Set(idsSetoresVinculadosAtuaisNoBackend);
        let setoresParaVincular = new Set(); 

        novosSetoresIds.forEach(id => {
            if (setoresParaDesvincular.has(id)) {
                setoresParaDesvincular.delete(id);
            } else {
                setoresParaVincular.add(id);
            }
        });

        for (const setorId of setoresParaDesvincular) {
            try {
                console.log(`Desvinculando Empresa ${empresaId} de Setor ${setorId}...`);
                const response = await fetch(`${API_BASE_URL}/empresas_setores/desvincular/${empresaId}/${setorId}`, {
                    method: 'DELETE'
                });
                if (response.ok || response.status === 204) {
                    console.log(`Vínculo Empresa ${empresaId} - Setor ${setorId} desvinculado com sucesso.`);
                } else {
                    console.error(`Falha ao desvincular ${empresaId} - ${setorId}: Status ${response.status}`);
                }
            } catch (error) {
                console.error(`Erro na requisição de desvinculação Empresa ${empresaId} - Setor ${setorId}:`, error);
            }
        }

        for (const setorId of setoresParaVincular) {
            try {
                console.log(`Vinculando Empresa ${empresaId} a Setor ${setorId}...`);
                const response = await fetch(`${API_BASE_URL}/empresas_setores/vincular/${empresaId}/${setorId}`, {
                    method: 'POST'
                });
                if (response.ok || response.status === 201) {
                    console.log(`Vínculo Empresa ${empresaId} - Setor ${setorId} vinculado com sucesso.`);
                } else {
                    console.error(`Falha ao vincular Empresa ${empresaId} - Setor ${setorId}: Status ${response.status}`);
                }
            } catch (error) {
                console.error(`Erro na requisição de vinculação Empresa ${empresaId} - Setor ${setorId}:`, error);
            }
        }
    }
});