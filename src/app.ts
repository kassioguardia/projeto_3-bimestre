export * from './cliente.js';
export * from './categoria.js';
export * from './subcategoria.js';
export * from './peca3d.js';
export * from './pecaCliente.js';

import { RelatorioVendasCliente } from './types.js';
import { escapeHtml, formatCurrency, safeNumber } from './utils/dom.js';

export async function carregarDashboard(): Promise<void> {
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
        const dashboard = document.getElementById('tab-dashboard');
        if (dashboard) {
            const alertEl = dashboard.querySelector('.dashboard-error-alert') as HTMLElement | null;
            if (alertEl) {
                alertEl.textContent = 'Erro ao carregar os dados da API. Verifique o console.';
                alertEl.classList.remove('d-none');
            }
        }
    }
}

function getItemQuantidade(item: any): number {
    if (!item) return 0;
    const val = item.quantidade ?? item.total_vendas ?? item.total_venda ?? item.qtd ?? item.total ?? 1;
    const n = safeNumber(val);
    return n > 0 ? n : 1;
}

function getItemValorUnitario(item: any): number {
    if (!item) return 0;
    const val = item.valor_unitario ?? item.preco ?? item.valor_total ?? item.valor ?? 0;
    return safeNumber(val);
}

function atualizarCards(relatorio: RelatorioVendasCliente[]): void {
    const elTotal = document.getElementById('card-total-clientes');
    const elMedia = document.getElementById('card-media-vendas');
    const elMaiorCliente = document.getElementById('card-cliente-destaque');

    if (!Array.isArray(relatorio) || relatorio.length === 0) {
        if (elTotal) elTotal.textContent = '0';
        if (elMedia) elMedia.textContent = formatCurrency(0);
        if (elMaiorCliente) elMaiorCliente.textContent = 'Sem dados';
        return;
    }

    const totalClientes = new Set(relatorio.map((item) => item.id_cliente)).size;

    const faturamentoTotal = relatorio.reduce((acc, item) => {
        const qtd = getItemQuantidade(item);
        const val = getItemValorUnitario(item);
        return acc + (qtd * val);
    }, 0);

    const vendasPorCliente = relatorio.reduce<Record<number, { cliente: string; quantidade: number }>>((acc, item) => {
        const id = item.id_cliente;
        const qtd = getItemQuantidade(item);
        if (!acc[id]) {
            acc[id] = { cliente: item.cliente || `Cliente #${id}`, quantidade: 0 };
        }
        acc[id].quantidade += qtd;
        return acc;
    }, {});

    const listaVendas = Object.values(vendasPorCliente);
    const clienteMaisVendas = listaVendas.length > 0
        ? listaVendas.reduce((maior, item) => item.quantidade > maior.quantidade ? item : maior)
        : null;

    if (elTotal) elTotal.textContent = totalClientes.toString();
    if (elMedia) elMedia.textContent = formatCurrency(faturamentoTotal);
    if (elMaiorCliente) {
        if (clienteMaisVendas) {
            elMaiorCliente.textContent = `${clienteMaisVendas.cliente} (${clienteMaisVendas.quantidade} un.)`;
        } else {
            elMaiorCliente.textContent = 'Sem dados';
        }
    }
}

function exibirTabela(relatorio: RelatorioVendasCliente[]): void {
    const tbody = document.getElementById('tabela-vendas-body');
    if (!tbody) return;

    tbody.innerHTML = '';

    if (!Array.isArray(relatorio) || relatorio.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="text-center py-3 text-muted">Nenhuma venda cadastrada.</td></tr>';
        return;
    }

    const vendasPorCliente = relatorio.reduce<Record<number, { id_cliente: number; cliente: string; quantidade: number; valor_total: number }>>((acc, item) => {
        const id = item.id_cliente;
        const qtd = getItemQuantidade(item);
        const valUnitario = getItemValorUnitario(item);
        if (!acc[id]) {
            acc[id] = { id_cliente: id, cliente: item.cliente || `Cliente #${id}`, quantidade: 0, valor_total: 0 };
        }
        acc[id].quantidade += qtd;
        acc[id].valor_total += (qtd * valUnitario);
        return acc;
    }, {});

    Object.values(vendasPorCliente).forEach((item) => {
        const tr = document.createElement('tr');

        const tdId = document.createElement('td');
        tdId.textContent = `#${item.id_cliente}`;

        const tdNome = document.createElement('td');
        const strong = document.createElement('strong');
        strong.textContent = item.cliente;
        tdNome.appendChild(strong);

        const tdQtd = document.createElement('td');
        tdQtd.textContent = `${item.quantidade} un.`;

        const tdValor = document.createElement('td');
        tdValor.textContent = formatCurrency(item.valor_total);

        tr.appendChild(tdId);
        tr.appendChild(tdNome);
        tr.appendChild(tdQtd);
        tr.appendChild(tdValor);
        tbody.appendChild(tr);
    });
}
