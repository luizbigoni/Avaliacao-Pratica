const API_BASE_URL = 'http://localhost:8080'; 

document.addEventListener('DOMContentLoaded', async () => {
    const formSetor = document.getElementById('formSetor');

    const tituloPagina = document.querySelector('h1.mt-4');
    if (!tituloPagina) console.error("Erro: h1.mt-4 não encontrado no HTML!"); 
    
    const breadcrumbAtivo = document.querySelector('ol.breadcrumb .breadcrumb-item.active');
    if (!breadcrumbAtivo) console.error("Erro: breadcrumb .active não encontrado no HTML!"); 


    const btnSalvar = formSetor ? formSetor.querySelector('button[type="submit"]') : null;
    if (!btnSalvar && formSetor) console.error("Erro: Botão de submit não encontrado dentro do formulário!");

    const descricaoInput = document.getElementById('descricao');
    if (!descricaoInput) console.error("Erro: Input #descricao não encontrado no HTML!"); 
    const urlParams = new URLSearchParams(window.location.search);
    const setorId = urlParams.get('id');

    let isEditMode = false;

    if (setorId) {
        isEditMode = true;
        if (tituloPagina) tituloPagina.textContent = 'Editar Setor'; 
        if (breadcrumbAtivo) breadcrumbAtivo.textContent = 'Edição'; 
        if (btnSalvar) { 
            btnSalvar.textContent = 'Atualizar Setor';
            btnSalvar.classList.remove('btn-primary');
            btnSalvar.classList.add('btn-warning');
        }

        try {
            console.log(`Carregando dados do setor para edição: ID ${setorId}`);
            const response = await fetch(`${API_BASE_URL}/setores/buscarId/${setorId}`);
            if (!response.ok) {
                if (response.status === 404) {
                    alert('Setor não encontrado para edição.');
                } else {
                    alert(`Erro HTTP ao buscar dados do setor! Status: ${response.status}`);
                }
                window.location.href = 'setores.html';
                return;
            }
            const setor = await response.json();
            if (descricaoInput) descricaoInput.value = setor.descricao; 

        } catch (error) {
            console.error("Erro ao carregar dados do setor para edição:", error);
            alert(`Erro ao carregar dados do setor para edição: ${error.message}`);
            window.location.href = 'setores.html';
            return;
        }
    } else {
        console.log("Modo de Cadastro: Criando novo setor.");
    }

    if (formSetor) { 
        formSetor.addEventListener('submit', async (event) => {
            event.preventDefault();

            if (!formSetor.checkValidity()) {
                event.stopPropagation();
                formSetor.classList.add('was-validated');
                return;
            }
            formSetor.classList.remove('was-validated');

            const descricao = descricaoInput.value.trim();

            const setorData = {
                descricao: descricao
            };

            let url = `${API_BASE_URL}/setores/novo`;
            let method = 'POST';
            let successMessage = 'Setor cadastrado com sucesso!';
            let errorMessage = 'Erro ao cadastrar setor:';

            if (isEditMode) {
                url = `${API_BASE_URL}/setores/editar/${setorId}`;
                method = 'PUT';
                setorData.id = setorId;
                successMessage = 'Setor atualizado com sucesso!';
                errorMessage = 'Erro ao atualizar setor:';
            }

            try {
                console.log(`Enviando ${method} para ${url} com dados:`, setorData);
                const response = await fetch(url, {
                    method: method,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(setorData)
                });

                if (response.ok) {
                    alert(successMessage);
                    window.location.href = 'setores.html';
                } else if (response.status === 400) {
                    const errorData = await response.json();
                    alert(`Erro de validação: ${errorData.message || response.statusText}`);
                    console.error("Detalhes do erro de validação do backend:", errorData);
                } else if (response.status === 404 && isEditMode) {
                     alert('Erro: Setor não encontrado para atualização.');
                } else {
                    const errorData = await response.json();
                    alert(`${errorMessage} ${response.status} - ${errorData.message || response.statusText}`);
                    console.error("Detalhes do erro:", errorData);
                }
            } catch (error) {
                console.error("Erro na requisição (rede ou CORS):", error);
                alert(`Erro de conexão: ${error.message}`);
            }
        });
    } else {
        console.error("Erro: Formulário com ID 'formSetor' não encontrado no HTML!");
    }
});