const API_BASE_URL = 'http://localhost:8080';

document.addEventListener('DOMContentLoaded', async () => {
    const totalEmpresasSpan = document.getElementById('totalEmpresas');
    const totalSetoresSpan = document.getElementById('totalSetores');

    async function carregarMetricasDoPainel() {
        try {
            const empresasResponse = await fetch(`${API_BASE_URL}/empresas/listar`);
            const empresas = empresasResponse.ok && empresasResponse.status !== 204 ? await empresasResponse.json() : [];
            const totalEmpresas = empresas.length;

            const setoresResponse = await fetch(`${API_BASE_URL}/setores/listar`);
            const setores = setoresResponse.ok && setoresResponse.status !== 204 ? await setoresResponse.json() : [];
            const totalSetores = setores.length;

            if (totalEmpresasSpan) totalEmpresasSpan.textContent = totalEmpresas;
            if (totalSetoresSpan) totalSetoresSpan.textContent = totalSetores;

        } catch (error) {
            console.error("Erro ao carregar métricas do painel:", error);
        }
    }

    await carregarMetricasDoPainel(); 
});