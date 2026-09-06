import { RelatorioVendasCliente } from './types.js';

export * from './cliente.js';
export * from './categoria.js';
export * from './subcategoria.js';
export * from './peca3d.js';
export * from './pecaCliente.js';

async function carregarDashboard(): Promise<void> {
    try {
        const resposta = await fetch('api/api.php');

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
    const elTotal = document.getElementById('card-total-clientes');
    const elMedia = document.getElementById('card-media-vendas');
    const elMaiorCliente = document.getElementById('card-cliente-destaque');

    if (relatorio.length === 0) {
        if (elTotal) elTotal.innerText = 'Nenhum dado registrado';
        if (elMedia) elMedia.innerText = 'Nenhum dado registrado';
        if (elMaiorCliente) elMaiorCliente.innerText = 'Nenhum dado registrado';
        return;
    }

    const totalClientes: number = new Set(relatorio.map((item) => item.id_cliente)).size;

    const faturamentoTotal: number = relatorio.reduce((acumulador, item) => {
        return acumulador + numeroSeguro(item.quantidade) * numeroSeguro(item.valor_unitario);
    }, 0);

    const vendasPorCliente = relatorio.reduce<Record<number, { cliente: string; quantidade: number }>>((acumulador, item) => {
        if (!acumulador[item.id_cliente]) {
            acumulador[item.id_cliente] = { cliente: item.cliente, quantidade: 0 };
        }
        acumulador[item.id_cliente].quantidade += numeroSeguro(item.quantidade);
        return acumulador;
    }, {});

    const clienteMaisVendas = Object.values(vendasPorCliente).reduce((maior, item) => {
        return item.quantidade > maior.quantidade ? item : maior;
    });

    if (elTotal) {
        elTotal.innerText = totalClientes.toString();
    }

    if (elMedia) {
        elMedia.innerText = formatarMoeda(faturamentoTotal);
    }

    if (elMaiorCliente) {
        elMaiorCliente.innerText = `${clienteMaisVendas.cliente} (${clienteMaisVendas.quantidade} un.)`;
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

    const vendasPorCliente = relatorio.reduce<Record<number, { id_cliente: number; cliente: string; quantidade: number; valor_total: number }>>((acumulador, item) => {
        if (!acumulador[item.id_cliente]) {
            acumulador[item.id_cliente] = {
                id_cliente: item.id_cliente,
                cliente: item.cliente,
                quantidade: 0,
                valor_total: 0
            };
        }
        acumulador[item.id_cliente].quantidade += numeroSeguro(item.quantidade);
        acumulador[item.id_cliente].valor_total += numeroSeguro(item.quantidade) * numeroSeguro(item.valor_unitario);
        return acumulador;
    }, {});

    Object.values(vendasPorCliente).forEach((item) => {
        const tr = document.createElement('tr');

        tr.innerHTML = `
            <td>#${item.id_cliente}</td>
            <td><strong>${item.cliente}</strong></td>
            <td>${item.quantidade} un.</td>
            <td>${formatarMoeda(item.valor_total)}</td>
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

function numeroSeguro(valor: number | null | undefined): number {
    const numero = Number(valor);
    return Number.isFinite(numero) ? numero : 0;
}

document.addEventListener('dashboard:ready', () => {
    carregarDashboard();
});
