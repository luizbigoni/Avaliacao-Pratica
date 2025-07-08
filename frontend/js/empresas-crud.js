// assets/js/empresas-crud.js

const API_BASE_URL = 'http://localhost:8080';

// Função para carregar e exibir as empresas na tabela
async function carregarEmpresas() {
    try {
        const response = await fetch(`${API_BASE_URL}/empresas/listar`);
        // Verifica se a resposta foi bem-sucedida (status 2xx)
        if (!response.ok) {
            // Se a lista estiver vazia (204 No Content), o fetch ainda pode ser ok, mas sem corpo.
            if (response.status === 204) {
                console.log('Nenhuma empresa encontrada.');
                document.querySelector('#dataTable tbody').innerHTML = '<tr><td colspan="5">Nenhuma empresa cadastrada.</td></tr>';
                return;
            }
            throw new Error(`Erro HTTP! Status: ${response.status}`);
        }

        const empresas = await response.json(); // Converte a resposta para JSON
        const tbody = document.querySelector('#dataTable tbody'); // Seleciona o corpo da tabela
        tbody.innerHTML = ''; // Limpa o corpo da tabela antes de preencher

        empresas.forEach(empresa => {
            const row = tbody.insertRow(); // Insere uma nova linha
            row.insertCell().textContent = empresa.id;
            row.insertCell().textContent = empresa.razaoSocial;
            row.insertCell().textContent = empresa.nomeFantasia;
            row.insertCell().textContent = empresa.cnpj;

            // Coluna de Ações (botões de Editar/Excluir para cada linha)
            const acoesCell = row.insertCell();
            const btnEditar = document.createElement('button');
            btnEditar.textContent = 'Editar';
            btnEditar.className = 'btn btn-sm btn-info me-1'; // Estilo Bootstrap
            btnEditar.addEventListener('click', () => editarEmpresa(empresa.id)); // Chama função de edição
            acoesCell.appendChild(btnEditar);

            const btnExcluir = document.createElement('button');
            btnExcluir.textContent = 'Excluir';
            btnExcluir.className = 'btn btn-sm btn-danger'; // Estilo Bootstrap
            btnExcluir.addEventListener('click', () => excluirEmpresa(empresa.id)); // Chama função de exclusão
            acoesCell.appendChild(btnExcluir);
        });

    } catch (error) {
        console.error("Erro ao carregar empresas:", error);
        document.querySelector('#dataTable tbody').innerHTML = `<tr><td colspan="5">Erro ao carregar empresas: ${error.message}</td></tr>`;
    }
}

// Funções placeholder para as operações CRUD que você fará a seguir
function novaEmpresa() {
    alert('Funcionalidade de Nova Empresa (formulário) será implementada aqui.');
    // Aqui você abrirá um modal ou redirecionará para um formulário
}

function editarEmpresa(id) {
    alert(`Funcionalidade de Editar Empresa ID: ${id} será implementada aqui.`);
    // Aqui você buscará os dados da empresa pelo ID e preencherá um formulário de edição
}

function excluirEmpresa(id) {
    if (confirm(`Tem certeza que deseja excluir a empresa ID: ${id}?`)) {
        // Lógica para chamar o endpoint DELETE
        alert(`Funcionalidade de Excluir Empresa ID: ${id} será implementada aqui.`);
        // Depois de excluir, recarregar a lista
        // carregarEmpresas();
    }
}

function verDetalhesEmpresa(id) {
    alert(`Funcionalidade de Ver Detalhes da Empresa ID: ${id} será implementada aqui.`);
    // Aqui você buscará os dados da empresa e os exibirá em um modal ou seção de detalhes
}

// Adicionar eventos de click aos botões dos cartões
document.addEventListener('DOMContentLoaded', () => {
    carregarEmpresas(); // Carrega as empresas quando a página é totalmente carregada

    // Captura os botões dos cartões
    const btnNovaEmpresa = document.getElementById('btnNovaEmpresa');
    const btnEditarEmpresa = document.getElementById('btnEditarEmpresa');
    const btnVerEmpresa = document.getElementById('btnVerEmpresa');
    const btnExcluirEmpresa = document.getElementById('btnExcluirEmpresa');

    if (btnNovaEmpresa) {
        btnNovaEmpresa.addEventListener('click', novaEmpresa);
    }
    // Para editar/ver/excluir pelos cartões, precisaríamos de uma forma de selecionar a empresa primeiro,
    // por exemplo, um campo de ID ou uma seleção na tabela.
    // Por enquanto, esses botões podem abrir modais genéricos ou funcionar em conjunto com a seleção de linha.
    // Os botões da tabela são mais diretos para Editar/Excluir por ID.
    if (btnEditarEmpresa) {
         btnEditarEmpresa.addEventListener('click', () => alert('Selecione uma empresa na tabela para editar.'));
    }
    if (btnVerEmpresa) {
         btnVerEmpresa.addEventListener('click', () => alert('Selecione uma empresa na tabela para ver detalhes.'));
    }
    if (btnExcluirEmpresa) {
         btnExcluirEmpresa.addEventListener('click', () => alert('Selecione uma empresa na tabela para excluir.'));
    }
});