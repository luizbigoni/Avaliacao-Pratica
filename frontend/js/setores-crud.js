const API_BASE_URL = 'http://localhost:8080';

async function carregarSetores() {
    try {
        const response = await fetch(`${API_BASE_URL}/setores/listar`);
        
        if (!response.ok) {
            if (response.status === 204) {
                console.log('Nenhum setor encontrado.');
                document.querySelector('#dataTable tbody').innerHTML = '<tr><td colspan="3">Nenhum setor cadastrado.</td></tr>';
                return;
            }
            throw new Error(`Erro HTTP! Status: ${response.status}`);
        }
        
        const setores = await response.json();
        const tbody = document.querySelector('#dataTable tbody'); 
        tbody.innerHTML = ''; 

        if (setores.length === 0) {
            document.querySelector('#dataTable tbody').innerHTML = '<tr><td colspan="3">Nenhum setor cadastrado.</td></tr>';
            return;
        }

        setores.forEach(setor => {
            const row = tbody.insertRow();
            row.insertCell().textContent = setor.id;
            row.insertCell().textContent = setor.descricao; 

            const acoesCell = row.insertCell();
            
            const btnVisualizar = document.createElement('button');
            btnVisualizar.textContent = 'Visualizar';
            btnVisualizar.className = 'btn btn-sm btn-success me-1';
 //           btnVisualizar.addEventListener('click', () => visualizarSetor(setor.id));
 //           acoesCell.appendChild(btnVisualizar);

            const btnEditar = document.createElement('button');
            btnEditar.textContent = 'Editar';
            btnEditar.className = 'btn btn-sm btn-info me-1';
            btnEditar.addEventListener('click', () => editarSetor(setor.id));
            acoesCell.appendChild(btnEditar);

            const btnExcluir = document.createElement('button');
            btnExcluir.textContent = 'Excluir';
            btnExcluir.className = 'btn btn-sm btn-danger';
            btnExcluir.addEventListener('click', () => excluirSetor(setor.id));
            acoesCell.appendChild(btnExcluir);
        });

    } catch (error) {
        console.error("Erro ao carregar setores:", error);
        document.querySelector('#dataTable tbody').innerHTML = `<tr><td colspan="3">Erro ao carregar setores: ${error.message}</td></tr>`;
    }
}

function novoSetor() {
    window.location.href = 'setor-cadastro.html'; 
}

function editarSetor(id) {
    window.location.href = `setor-cadastro.html?id=${id}`;
}

function visualizarSetor(id) {
    window.location.href = `setor-detalhes.html?id=${id}`;
}

async function excluirSetor(id) {
    if (confirm(`Tem certeza que deseja excluir o setor ID: ${id}?`)) {
        try {
            const response = await fetch(`${API_BASE_URL}/setores/excluir/${id}`, {
                method: 'DELETE'
            });

            if (response.status === 204) { 
                alert('Setor excluído com sucesso!');
                carregarSetores(); 
            } else if (response.status === 404) {
                alert('Setor não encontrado para exclusão.');
            } else {
                throw new Error(`Erro ao excluir setor! Status: ${response.status}`);
            }
        } catch (error) {
            console.error("Erro ao excluir setor:", error);
            alert(`Erro ao excluir setor: ${error.message}`);
        }
    }
}

async function buscarSetores() {
    const termoBusca = document.getElementById('campoBuscaSetor').value.trim();
    let url;

    if (termoBusca) {
        url = `${API_BASE_URL}/setores/buscar?query=${encodeURIComponent(termoBusca)}`;
    } else {
        carregarSetores(); 
        return;
    }

    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            if (response.status === 204) {
                console.log('Nenhum setor encontrado para o termo de busca.');
                document.querySelector('#dataTable tbody').innerHTML = '<tr><td colspan="3">Nenhum setor encontrado.</td></tr>';
                return;
            }
            throw new Error(`Erro HTTP ao buscar setores! Status: ${response.status}`);
        }
        
        const setores = await response.json(); 
        const tbody = document.querySelector('#dataTable tbody');
        tbody.innerHTML = ''; 

        if (setores.length === 0) {
            document.querySelector('#dataTable tbody').innerHTML = '<tr><td colspan="3">Nenhum setor encontrado.</td></tr>';
            return;
        }

        setores.forEach(setor => {
            const row = tbody.insertRow();
            row.insertCell().textContent = setor.id;
            row.insertCell().textContent = setor.descricao; 

            const acoesCell = row.insertCell();


            const btnEditar = document.createElement('button');
            btnEditar.textContent = 'Editar';
            btnEditar.className = 'btn btn-sm btn-info me-1';
            btnEditar.addEventListener('click', () => editarSetor(setor.id));
            acoesCell.appendChild(btnEditar);

            const btnExcluir = document.createElement('button');
            btnExcluir.textContent = 'Excluir';
            btnExcluir.className = 'btn btn-sm btn-danger';
            btnExcluir.addEventListener('click', () => excluirSetor(setor.id));
            acoesCell.appendChild(btnExcluir);
        });

    } catch (error) {
        console.error("Erro ao buscar setores:", error);
        document.querySelector('#dataTable tbody').innerHTML = `<tr><td colspan="3">Erro ao buscar setores: ${error.message}</td></tr>`; 
    }
}

document.addEventListener('DOMContentLoaded', () => {
    carregarSetores(); 

    const btnNovoSetorTopo = document.getElementById('btnNovoSetorTopo'); 
    if (btnNovoSetorTopo) {
        btnNovoSetorTopo.addEventListener('click', novoSetor);
    }

    const campoBusca = document.getElementById('campoBuscaSetor');
    const btnBuscar = document.getElementById('btnBuscarSetor');
    if (btnBuscar) {
        btnBuscar.addEventListener('click', buscarSetores);
    }
    if (campoBusca) {
        campoBusca.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                buscarSetores();
            }
        });
    }
});