const API_BASE_URL = 'http://localhost:8080';

async function carregarEmpresas() {
    try {
        const response = await fetch(`${API_BASE_URL}/empresas/listar`);
        
        if (!response.ok) {
            if (response.status === 204) {
                console.log('Nenhuma empresa encontrada.');
                document.querySelector('#dataTable tbody').innerHTML = '<tr><td colspan="5">Nenhuma empresa cadastrada.</td></tr>';
                return;
            }
            throw new Error(`Erro HTTP! Status: ${response.status}`);
        }
        
        const empresas = await response.json(); 
        const tbody = document.querySelector('#dataTable tbody'); 
        tbody.innerHTML = ''; 

        empresas.forEach(empresa => {
            const row = tbody.insertRow(); 
            row.insertCell().textContent = empresa.id;
            row.insertCell().textContent = empresa.razaoSocial;
            row.insertCell().textContent = empresa.nomeFantasia;
            row.insertCell().textContent = empresa.cnpj;

            const acoesCell = row.insertCell();
            
            const btnVisualizar = document.createElement('button');
            btnVisualizar.textContent = 'Visualizar';
            btnVisualizar.className = 'btn btn-sm btn-success me-1';
            btnVisualizar.addEventListener('click', () => visualizarEmpresa(empresa.id));
            acoesCell.appendChild(btnVisualizar);

            const btnEditar = document.createElement('button');
            btnEditar.textContent = 'Editar';
            btnEditar.className = 'btn btn-sm btn-info me-1';
            btnEditar.addEventListener('click', () => editarEmpresa(empresa.id));
            acoesCell.appendChild(btnEditar);

            const btnExcluir = document.createElement('button');
            btnExcluir.textContent = 'Excluir';
            btnExcluir.className = 'btn btn-sm btn-danger';
            btnExcluir.addEventListener('click', () => excluirEmpresa(empresa.id));
            acoesCell.appendChild(btnExcluir);
        });

    } catch (error) {
        console.error("Erro ao carregar empresas:", error);
        document.querySelector('#dataTable tbody').innerHTML = `<tr><td colspan="5">Erro ao carregar empresas: ${error.message}</td></tr>`;
    }
}

function novaEmpresa() {
    window.location.href = 'empresa-cadastro.html';
}

function editarEmpresa(id) {
    window.location.href = `empresa-cadastro.html?id=${id}`;
}

function visualizarEmpresa(id) {
    window.location.href = `empresa-detalhes.html?id=${id}`;
}

async function excluirEmpresa(id) {
    if (confirm(`Tem certeza que deseja excluir a empresa ID: ${id}?`)) {
        try {
            const response = await fetch(`${API_BASE_URL}/empresas/excluir/${id}`, {
                method: 'DELETE'
            });

            if (response.status === 204) { 
                alert('Empresa excluída com sucesso!');
                carregarEmpresas(); 
            } else if (response.status === 404) {
                alert('Empresa não encontrada para exclusão.');
            } else {
                throw new Error(`Erro ao excluir empresa! Status: ${response.status}`);
            }
        } catch (error) {
            console.error("Erro ao excluir empresa:", error);
            alert(`Erro ao excluir empresa: ${error.message}`);
        }
    }
}

async function buscarEmpresas() {
    const termoBusca = document.getElementById('campoBuscaEmpresa').value.trim();
    let url;

    if (termoBusca) 
        url = `${API_BASE_URL}/empresas/buscar?query=${encodeURIComponent(termoBusca)}`;
    else 
        url = `${API_BASE_URL}/empresas/listar`;
    

    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            if (response.status === 204) {
                console.log('Nenhuma empresa encontrada para o termo de busca.');
                document.querySelector('#dataTable tbody').innerHTML = '<tr><td colspan="5">Nenhuma empresa encontrada.</td></tr>';
                return;
            }
            throw new Error(`Erro HTTP ao buscar empresas! Status: ${response.status}`);
        }
        const empresas = await response.json();
        const tbody = document.querySelector('#dataTable tbody');
        tbody.innerHTML = ''; 

        empresas.forEach(empresa => {
            const row = tbody.insertRow();
            row.insertCell().textContent = empresa.id;
            row.insertCell().textContent = empresa.razaoSocial;
            row.insertCell().textContent = empresa.nomeFantasia;
            row.insertCell().textContent = empresa.cnpj;

            const acoesCell = row.insertCell();
            const btnVisualizar = document.createElement('button');
            btnVisualizar.textContent = 'Visualizar';
            btnVisualizar.className = 'btn btn-sm btn-success me-1';
            btnVisualizar.addEventListener('click', () => visualizarEmpresa(empresa.id));
            acoesCell.appendChild(btnVisualizar);

            const btnEditar = document.createElement('button');
            btnEditar.textContent = 'Editar';
            btnEditar.className = 'btn btn-sm btn-info me-1';
            btnEditar.addEventListener('click', () => editarEmpresa(empresa.id));
            acoesCell.appendChild(btnEditar);

            const btnExcluir = document.createElement('button');
            btnExcluir.textContent = 'Excluir';
            btnExcluir.className = 'btn btn-sm btn-danger';
            btnExcluir.addEventListener('click', () => excluirEmpresa(empresa.id));
            acoesCell.appendChild(btnExcluir);
        });

    }catch (error){
        console.error("Erro ao buscar empresas:", error);
        document.querySelector('#dataTable tbody').innerHTML = `<tr><td colspan="5">Erro ao buscar empresas: ${error.message}</td></tr>`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    carregarEmpresas(); 

    const btnNovaEmpresaTopo = document.getElementById('btnNovaEmpresaTopo');
    if (btnNovaEmpresaTopo) {
        btnNovaEmpresaTopo.addEventListener('click', novaEmpresa);
    }

    const campoBusca = document.getElementById('campoBuscaEmpresa');
    const btnBuscar = document.getElementById('btnBuscarEmpresa');
    if (btnBuscar) {
        btnBuscar.addEventListener('click', buscarEmpresas);
    }

    if (campoBusca) {
        campoBusca.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault(); 
                buscarEmpresas();
            }
        });
    }
});