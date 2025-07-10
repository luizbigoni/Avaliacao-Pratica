const API_BASE_URL = 'http://localhost:8080'; 

document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const empresaId = urlParams.get('id');

    if (!empresaId) {
        alert('ID da empresa não fornecido na URL.');
        window.location.href = 'empresas.html'; 
        return;
    }

    async function carregarDetalhesEmpresa() {
        try {
            const response = await fetch(`${API_BASE_URL}/empresas/buscarId/${empresaId}`); 
            if (!response.ok) {
                if (response.status === 404) {
                    alert('Empresa não encontrada.');
                    window.location.href = 'empresas.html';
                    return;
                }
                throw new Error(`Erro HTTP! Status: ${response.status}`);
            }

            const empresa = await response.json();

            document.getElementById('empresaId').textContent = empresa.id;
            document.getElementById('razaoSocial').textContent = empresa.razaoSocial;
            document.getElementById('nomeFantasia').textContent = empresa.nomeFantasia;
            document.getElementById('cnpj').textContent = empresa.cnpj;

            await carregarSetoresVinculados(empresaId);

        } catch (error) {
            console.error("Erro ao carregar detalhes da empresa:", error);
            alert(`Erro ao carregar detalhes da empresa: ${error.message}`);
            window.location.href = 'empresas.html'; 
        }
    }

    async function carregarSetoresVinculados(empresaId) {
        const setoresVinculadosTableBody = document.getElementById('setoresVinculadosTableBody');
        const noSetoresMessage = document.getElementById('noSetoresMessage');
        setoresVinculadosTableBody.innerHTML = '';

        try {
            const response = await fetch(`${API_BASE_URL}/empresas_setores/buscaSetoresPorEmpresa/${empresaId}`); 

            if (!response.ok) {
                if (response.status === 204) {
                    noSetoresMessage.style.display = 'block';
                    return;
                }
                throw new Error(`Erro HTTP ao carregar setores vinculados! Status: ${response.status}`);
            }

            const setores = await response.json(); 

            if (setores.length === 0) {
                noSetoresMessage.style.display = 'block';
            } else {
                noSetoresMessage.style.display = 'none';
                setores.forEach(setor => { 
                    const row = setoresVinculadosTableBody.insertRow();
                    row.insertCell().textContent = setor.id;
                    row.insertCell().textContent = setor.nome; 
                });
            }

        } catch (error) {
            console.error("Erro ao carregar setores vinculados:", error);
            noSetoresMessage.textContent = `Não há setores vinculado a empresa!`;
            noSetoresMessage.style.display = 'block';
        }
    }

    carregarDetalhesEmpresa();
});