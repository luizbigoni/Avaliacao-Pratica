const API_BASE_URL = 'http://localhost:8080';

document.addEventListener('DOMContentLoaded', async () => {
    const formEmpresa = document.getElementById('formEmpresa');
    const tituloPagina = document.querySelector('h1.mt-4');
    const breadcrumbAtivo = document.querySelector('ol.breadcrumb .breadcrumb-item.active');
    const btnSalvar = formEmpresa.querySelector('button[type="submit"]');

    const razaoSocialInput = document.getElementById('razaoSocial');
    const nomeFantasiaInput = document.getElementById('nomeFantasia');
    const cnpjInput = document.getElementById('cnpj');
    const setoresCheckboxesTableBody = document.getElementById('setoresCheckboxesTableBody');
    const noSetoresAvailableMessage = document.getElementById('noSetoresAvailableMessage');

    const urlParams = new URLSearchParams(window.location.search);
    const empresaId = urlParams.get('id');
    let isEditMode = false;

    let setoresVinculadosAtuais = new Set();

    async function carregarTodosSetoresDisponiveis() {
        try {
            const response = await fetch(`${API_BASE_URL}/setores/listar`);
            if (!response.ok) {
                console.error("Erro ao carregar setores disponíveis:", response.status);
                return [];
            }
            const setores = await response.json();
            return setores;
        } catch (error) {
            console.error("Erro de rede ao carregar setores disponíveis:", error);
            return [];
        }
    }

    async function carregarSetoresJaVinculados(empresaId) {
        try {
            const response = await fetch(`${API_BASE_URL}/empresas_setores/buscaSetoresPorEmpresa/${empresaId}`);
            if (!response.ok) {
                console.warn(`Nenhum setor vinculado encontrado ou erro ao buscar: ${response.status}`);
                return [];
            }
            const setores = await response.json();
            const ids = setores.map(setor => Number(setor.id));
            return ids;
        } catch (error) {
            console.error(`Erro ao buscar setores vinculados à empresa ${empresaId}:`, error);
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

    if (empresaId) {
        isEditMode = true;
        tituloPagina.textContent = 'Editar Empresa';
        if (breadcrumbAtivo) breadcrumbAtivo.textContent = 'Edição';
        if (btnSalvar) {
            btnSalvar.textContent = 'Atualizar Empresa';
            btnSalvar.classList.remove('btn-primary');
            btnSalvar.classList.add('btn-warning');
        }

        try {
            const response = await fetch(`${API_BASE_URL}/empresas/buscarId/${empresaId}`);
            if (!response.ok) {
                alert('Empresa não encontrada para edição.');
                window.location.href = 'empresas.html';
                return;
            }
            const empresa = await response.json();
            razaoSocialInput.value = empresa.razaoSocial;
            nomeFantasiaInput.value = empresa.nomeFantasia;
            cnpjInput.value = empresa.cnpj;

            await popularSetoresCheckboxes(empresaId);
        } catch (error) {
            console.error("Erro ao carregar dados da empresa:", error);
            alert(`Erro ao carregar dados da empresa: ${error.message}`);
            window.location.href = 'empresas.html';
        }
    } else {
        await popularSetoresCheckboxes();
    }

    if (formEmpresa) {
        formEmpresa.addEventListener('submit', async (event) => {
            event.preventDefault();

            if (!formEmpresa.checkValidity()) {
                event.stopPropagation();
                formEmpresa.classList.add('was-validated');
                return;
            }
            formEmpresa.classList.remove('was-validated');

            const razaoSocial = razaoSocialInput.value.trim();
            const nomeFantasia = nomeFantasiaInput.value.trim();
            const cnpj = cnpjInput.value.trim();

            const checkboxesSelecionados = document.querySelectorAll('#setoresCheckboxesTableBody input[type="checkbox"]:checked');
            const setoresSelecionadosIds = Array.from(checkboxesSelecionados)
                .map(checkbox => Number(checkbox.value));

            const empresaData = {
                razaoSocial,
                nomeFantasia,
                cnpj
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

                let empresaSalva;
                if (response.ok) {
                    empresaSalva = await response.json();
                } else {
                    const errorData = await response.json();
                    alert(`${errorMessage} ${response.status} - ${errorData.message || response.statusText}`);
                    return;
                }

                await sincronizarSetores(empresaSalva.id, setoresSelecionadosIds);
                alert(successMessage);
                window.location.href = 'empresas.html';

            } catch (error) {
                console.error("Erro ao salvar empresa:", error);
                alert(`Erro de conexão: ${error.message}`);
            }
        });
    }

    async function sincronizarSetores(empresaId, novosSetoresIds) {
        let setoresParaDesvincular = new Set(setoresVinculadosAtuais);
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
                await fetch(`${API_BASE_URL}/empresas_setores/desvincular/${empresaId}/${setorId}`, {
                    method: 'DELETE'
                });
            } catch (error) {
                console.error(`Erro ao desvincular setor ${setorId}:`, error);
            }
        }

        for (const setorId of setoresParaVincular) {
            try {
                await fetch(`${API_BASE_URL}/empresas_setores/vincular/${empresaId}/${setorId}`, {
                    method: 'POST'
                });
            } catch (error) {
                console.error(`Erro ao vincular setor ${setorId}:`, error);
            }
        }
    }
});
