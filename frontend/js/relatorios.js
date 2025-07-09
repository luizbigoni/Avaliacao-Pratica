// assets/js/relatorios.js

const API_BASE_URL = 'http://localhost:8080';

document.addEventListener('DOMContentLoaded', async () => {
    const filtroEmpresaNomeInput = document.getElementById('filtroEmpresaNome');
    const filtroSetorDescricaoInput = document.getElementById('filtroSetorDescricao');
    const btnGerarRelatorio = document.getElementById('btnGerarRelatorio');
    const btnLimparFiltros = document.getElementById('btnLimparFiltros');
    const relatorioTableBody = document.getElementById('relatorioTableBody');
    const noResultsMessage = document.getElementById('noResultsMessage');

    async function gerarRelatorio() {
        // MUDANÇA AQUI: Aplicar toLowerCase() e adicionar wildcards '%' no frontend
        const empresaTermoRaw = filtroEmpresaNomeInput.value.trim();
        const setorTermoRaw = filtroSetorDescricaoInput.value.trim();

        let empresaTermoFinal = (empresaTermoRaw) ? `%${empresaTermoRaw.toLowerCase()}%` : null;
        let setorTermoFinal = (setorTermoRaw) ? `%${setorTermoRaw.toLowerCase()}%` : null;
        
        relatorioTableBody.innerHTML = '';
        noResultsMessage.style.display = 'none';

        let vinculos = [];

        try {
            let url = `${API_BASE_URL}/empresas_setores/relatorio?`;
            
            // Passa os termos JÁ PROCESSADOS para o backend
            if (empresaTermoFinal) {
                url += `empresaTermo=${encodeURIComponent(empresaTermoFinal)}&`;
            }
            if (setorTermoFinal) {
                url += `setorTermo=${encodeURIComponent(setorTermoFinal)}&`;
            }
            if (url.endsWith('&')) {
                url = url.slice(0, -1);
            }
            
            console.log("Chamando API de relatório com URL:", url);
            const response = await fetch(url);

            if (!response.ok) {
                if (response.status === 204) {
                    noResultsMessage.style.display = 'block';
                    return;
                }
                throw new Error(`Erro HTTP ao carregar vínculos para relatório! Status: ${response.status}`);
            }

            vinculos = await response.json();
            console.log("Vínculos recebidos do backend (já filtrados):", vinculos); 

            if (vinculos.length === 0) {
                noResultsMessage.style.display = 'block';
            } else {
                vinculos.forEach(vinculo => {
                    const row = relatorioTableBody.insertRow();
                    row.insertCell().textContent = `${vinculo.id.empresaId} - ${vinculo.id.setorId}`;
                    
                    if (vinculo.empresa) {
                        row.insertCell().textContent = `${vinculo.empresa.id} - ${vinculo.empresa.razaoSocial} (${vinculo.empresa.cnpj})`;
                    } else {
                        row.insertCell().textContent = 'Empresa indisponível';
                    }

                    if (vinculo.setor) {
                        row.insertCell().textContent = `${vinculo.setor.id} - ${vinculo.setor.nome}`;
                    } else {
                        row.insertCell().textContent = 'Setor indisponível';
                    }
                });
            }

        } catch (error) {
            console.error("Erro ao gerar relatório:", error);
            alert(`Erro ao gerar relatório: ${error.message}`);
            noResultsMessage.textContent = `Erro ao carregar relatório: ${error.message}`;
            noResultsMessage.style.display = 'block';
        }
    }

    // Função para limpar os campos de filtro
    function limparFiltros() {
        filtroEmpresaNomeInput.value = '';
        filtroSetorDescricaoInput.value = '';
        gerarRelatorio();
    }

    // Inicialização
    btnGerarRelatorio.addEventListener('click', gerarRelatorio);
    btnLimparFiltros.addEventListener('click', limparFiltros);
    
    await gerarRelatorio(); 
});