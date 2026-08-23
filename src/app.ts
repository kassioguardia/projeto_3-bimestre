import { RelatorioVendasCliente } from './types.js';

export * from './cliente.js';
export * from './categoria.js';
export * from './subcategoria.js';
export * from './peca3d.js';
export * from './pecaCliente.js';

async function carregarDashboard(): Promise<void> {
    try {
        const resposta = await fetch('api.php');

        if (!resposta.ok) {
            throw new Error(`Erro na requisição: Status ${resposta.status}`);
        }

        const relatorio: RelatorioVendasCliente[] = await resposta.json();

        atualizarCards(relatorio);
        exibirTabela(relatorio);

    } catch (erro) {
        console.error('Falha ao carregar relatório:', erro);
        alert('Erro ao carregar os dados da API PHP. Verifique o console.');
    }
}

function atualizarCards(relatorio: RelatorioVendasCliente[]): void {
    if (relatorio.length === 0) return;

    const totalClientes: number = relatorio.length;

    const somaValores: number = relatorio.reduce((acumulador, item) => {
        return acumulador + Number(item.valor_total);
    }, 0);
    const mediaValor: number = somaValores / totalClientes;

    const clienteMaisVendas: RelatorioVendasCliente = relatorio.reduce((maior, item) => {
        return Number(item.total_vendas) > Number(maior.total_vendas) ? item : maior;
    }, relatorio[0]);

    const elTotal = document.getElementById('card-total-clientes');
    if (elTotal) {
        elTotal.innerText = totalClientes.toString();
    }

    const elMedia = document.getElementById('card-media-vendas');
    if (elMedia) {
        elMedia.innerText = formatarMoeda(mediaValor);
    }

    const elMaiorCliente = document.getElementById('card-cliente-destaque');
    if (elMaiorCliente) {
        elMaiorCliente.innerText = `${clienteMaisVendas.cliente} (${clienteMaisVendas.total_vendas} un.)`;
    }
}

function exibirTabela(relatorio: RelatorioVendasCliente[]): void {
    const tbody = document.getElementById('tabela-vendas-body');
    if (!tbody) return;

    tbody.innerHTML = '';

    if (relatorio.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4">Nenhuma venda cadastrada.</td></tr>';
        return;
    }

    relatorio.forEach((item) => {
        const tr = document.createElement('tr');

        tr.innerHTML = `
            <td>#${item.id_cliente}</td>
            <td><strong>${item.cliente}</strong></td>
            <td>${item.total_vendas} un.</td>
            <td>${formatarMoeda(Number(item.valor_total))}</td>
        `;

        tbody.appendChild(tr);
    });
}

function formatarMoeda(valor: number): string {
    return valor.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}

document.addEventListener('dashboard:ready', () => {
    carregarDashboard();
});
