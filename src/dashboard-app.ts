import {
    listarClientes, criarCliente, atualizarCliente, excluirCliente,
    listarCategorias, criarCategoria, atualizarCategoria, excluirCategoria,
    listarSubcategorias, criarSubcategoria, atualizarSubcategoria, excluirSubcategoria,
    listarPecas3d, criarPeca3d, atualizarPeca3d, excluirPeca3d,
    listarPecasCliente, criarPecaCliente, atualizarPecaCliente, excluirPecaCliente,
    carregarDashboard
} from './app.js';

import { Cliente, Categoria, Subcategoria, Peca3d, PecaCliente } from './types.js';
import { escapeHtml, formatCurrency, formatDate } from './utils/dom.js';
import { showToast, confirmAction, showTableLoading, setButtonLoading, setModalError } from './utils/ui.js';

declare const bootstrap: any;

// ─── Estado ──────────────────────────────────────────────────────────────────
let activeTab = 'dashboard';
let activeEntity = '';
let bsModalInstance: any = null;
let editingId: number | null = null;

// Caches tipados — evitam JSON.stringify nos botões de edição
const cacheClientes = new Map<number, Cliente>();
const cacheCategorias = new Map<number, Categoria>();
const cacheSubcategorias = new Map<number, Subcategoria>();
const cachePecas = new Map<number, Peca3d>();
const cachePedidos = new Map<number, PecaCliente>();

// Arquivos de componentes e abas (estrutura original do projeto)
const componentFiles: Record<string, string> = {
    'sidebar-container': 'components/sidebar.html',
    'header-container':  'components/header.html',
    'modal-container':   'components/modal.html',
};
const tabNames = ['dashboard', 'clientes', 'categorias', 'subcategorias', 'pecas', 'pedidos'];

// ─── Carregamento de interface (fetch de components/ e tabs/) ─────────────────
async function loadInterface(): Promise<void> {
    await Promise.all(
        Object.entries(componentFiles).map(async ([id, file]) => {
            const res = await fetch(file);
            if (!res.ok) throw new Error(`Falha ao carregar ${file}`);
            const el = document.getElementById(id);
            if (el) el.innerHTML = await res.text();
        })
    );

    const tabsContainer = document.getElementById('tabs-container');
    if (!tabsContainer) throw new Error('Container das abas não encontrado.');

    const tabs = await Promise.all(
        tabNames.map(async (name) => {
            const res = await fetch(`tabs/${name}.html`);
            if (!res.ok) throw new Error(`Falha ao carregar tabs/${name}.html`);
            return res.text();
        })
    );
    tabsContainer.innerHTML = tabs.join('');
}

// ─── Roteamento por Hash (persiste aba no F5 e navegação) ─────────────────────
function getActiveTabFromUrl(): string {
    const hash = window.location.hash.slice(1).trim();
    const valid = ['dashboard', 'clientes', 'categorias', 'subcategorias', 'pecas', 'pedidos'];
    if (valid.includes(hash)) return hash;
    return localStorage.getItem('activeTab') ?? 'dashboard';
}

function setActiveTabInUrl(tabName: string): void {
    history.pushState(null, '', `#${tabName}`);
    localStorage.setItem('activeTab', tabName);
}

window.addEventListener('popstate', () => {
    switchTabInternal(getActiveTabFromUrl(), false);
});

// ─── Navegação entre abas ──────────────────────────────────────────────────────
function switchTabInternal(tabName: string, updateUrl = true): void {
    document.querySelectorAll<HTMLElement>('.tab-content').forEach(el => el.classList.add('d-none'));
    document.querySelectorAll<HTMLElement>('.sidebar .nav-link').forEach(el => el.classList.remove('active'));

    document.getElementById(`tab-${tabName}`)?.classList.remove('d-none');
    document.getElementById(`btn-${tabName}`)?.classList.add('active');

    const titleMap: Record<string, string> = {
        dashboard:     'Painel Geral',
        clientes:      'Gerenciamento de Clientes',
        categorias:    'Gerenciamento de Categorias',
        subcategorias: 'Gerenciamento de Subcategorias',
        pecas:         'Gerenciamento de Peças 3D',
        pedidos:       'Gerenciamento de Pedidos',
    };

    const titleEl = document.getElementById('page-title');
    if (titleEl) titleEl.textContent = titleMap[tabName] ?? 'Painel';

    activeTab = tabName;
    if (updateUrl) setActiveTabInUrl(tabName);

    loadTabData(tabName);
}

// ─── Carga de dados ────────────────────────────────────────────────────────────
async function loadTabData(tabName: string): Promise<void> {
    try {
        if (tabName === 'dashboard')      await carregarDashboard();
        else if (tabName === 'clientes')      await loadClientes();
        else if (tabName === 'categorias')    await loadCategorias();
        else if (tabName === 'subcategorias') await loadSubcategorias();
        else if (tabName === 'pecas')         await loadPecas();
        else if (tabName === 'pedidos')       await loadPedidos();
    } catch (err) {
        showToast(err instanceof Error ? err.message : 'Erro ao carregar dados.', 'danger');
    }
}

async function loadClientes(): Promise<void> {
    const tbody = document.getElementById('tabela-clientes-body');
    if (!tbody) return;
    showTableLoading(tbody, 7);
    const data = await listarClientes();
    cacheClientes.clear();
    data.forEach(c => cacheClientes.set(c.id, c));
    if (data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center py-3 text-muted">Nenhum cliente cadastrado.</td></tr>';
        return;
    }
    tbody.innerHTML = data.map(item => `
        <tr>
            <td class="fw-bold">#${item.id}</td>
            <td>${escapeHtml(item.nome)}</td>
            <td>${escapeHtml(item.email)}</td>
            <td>${escapeHtml(item.telefone)}</td>
            <td>${escapeHtml(item.endereco)}</td>
            <td>${formatDate(item.data_cadastro)}</td>
            <td class="text-end">
                <button data-action="edit" data-entity="cliente" data-id="${item.id}"
                    class="btn btn-sm btn-outline-primary me-1" aria-label="Editar cliente ${escapeHtml(item.nome)}">
                    <i class="fa-solid fa-pen"></i>
                </button>
                <button data-action="delete" data-entity="cliente" data-id="${item.id}"
                    class="btn btn-sm btn-outline-danger" aria-label="Excluir cliente ${escapeHtml(item.nome)}">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        </tr>`).join('');
}

async function loadCategorias(): Promise<void> {
    const tbody = document.getElementById('tabela-categorias-body');
    if (!tbody) return;
    showTableLoading(tbody, 3);
    const data = await listarCategorias();
    cacheCategorias.clear();
    data.forEach(c => cacheCategorias.set(c.id, c));
    if (data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3" class="text-center py-3 text-muted">Nenhuma categoria cadastrada.</td></tr>';
        return;
    }
    tbody.innerHTML = data.map(item => `
        <tr>
            <td class="fw-bold">#${item.id}</td>
            <td>${escapeHtml(item.nome)}</td>
            <td class="text-end">
                <button data-action="edit" data-entity="categoria" data-id="${item.id}"
                    class="btn btn-sm btn-outline-primary me-1" aria-label="Editar categoria ${escapeHtml(item.nome)}">
                    <i class="fa-solid fa-pen"></i>
                </button>
                <button data-action="delete" data-entity="categoria" data-id="${item.id}"
                    class="btn btn-sm btn-outline-danger" aria-label="Excluir categoria ${escapeHtml(item.nome)}">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        </tr>`).join('');
}

async function loadSubcategorias(): Promise<void> {
    const tbody = document.getElementById('tabela-subcategorias-body');
    if (!tbody) return;
    showTableLoading(tbody, 4);
    const data = await listarSubcategorias();
    cacheSubcategorias.clear();
    data.forEach(s => cacheSubcategorias.set(s.id, s));
    if (cacheCategorias.size === 0) {
        (await listarCategorias()).forEach(c => cacheCategorias.set(c.id, c));
    }
    if (data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="text-center py-3 text-muted">Nenhuma subcategoria cadastrada.</td></tr>';
        return;
    }
    tbody.innerHTML = data.map(item => {
        const catNome = cacheCategorias.get(item.id_categoria)?.nome ?? `ID: ${item.id_categoria}`;
        return `
        <tr>
            <td class="fw-bold">#${item.id}</td>
            <td>${escapeHtml(item.nome)}</td>
            <td>${escapeHtml(catNome)}</td>
            <td class="text-end">
                <button data-action="edit" data-entity="subcategoria" data-id="${item.id}"
                    class="btn btn-sm btn-outline-primary me-1" aria-label="Editar subcategoria ${escapeHtml(item.nome)}">
                    <i class="fa-solid fa-pen"></i>
                </button>
                <button data-action="delete" data-entity="subcategoria" data-id="${item.id}"
                    class="btn btn-sm btn-outline-danger" aria-label="Excluir subcategoria ${escapeHtml(item.nome)}">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        </tr>`;
    }).join('');
}

async function loadPecas(): Promise<void> {
    const tbody = document.getElementById('tabela-pecas-body');
    if (!tbody) return;
    showTableLoading(tbody, 10);
    const data = await listarPecas3d();
    cachePecas.clear();
    data.forEach(p => cachePecas.set(p.id, p));
    if (cacheSubcategorias.size === 0) {
        (await listarSubcategorias()).forEach(s => cacheSubcategorias.set(s.id, s));
    }
    if (data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="10" class="text-center py-3 text-muted">Nenhuma peça 3D cadastrada.</td></tr>';
        return;
    }
    tbody.innerHTML = data.map(item => {
        const subNome = cacheSubcategorias.get(item.id_subcategoria)?.nome ?? `ID: ${item.id_subcategoria}`;
        return `
        <tr>
            <td class="fw-bold">#${item.id}</td>
            <td class="fw-bold text-secondary">${escapeHtml(item.modelo)}</td>
            <td>${escapeHtml(item.descricao)}</td>
            <td>${item.tamanho != null ? item.tamanho : '-'}</td>
            <td>${escapeHtml(item.tempoImpressao)}</td>
            <td>${item.peso != null ? item.peso + 'g' : '-'}</td>
            <td class="text-success fw-bold">${item.preco != null ? formatCurrency(Number(item.preco)) : '-'}</td>
            <td>${item.quantidade}</td>
            <td>${escapeHtml(subNome)}</td>
            <td class="text-end">
                <button data-action="edit" data-entity="peca" data-id="${item.id}"
                    class="btn btn-sm btn-outline-primary me-1" aria-label="Editar peça ${escapeHtml(item.modelo)}">
                    <i class="fa-solid fa-pen"></i>
                </button>
                <button data-action="delete" data-entity="peca" data-id="${item.id}"
                    class="btn btn-sm btn-outline-danger" aria-label="Excluir peça ${escapeHtml(item.modelo)}">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        </tr>`;
    }).join('');
}

async function loadPedidos(): Promise<void> {
    const tbody = document.getElementById('tabela-pedidos-body');
    if (!tbody) return;
    showTableLoading(tbody, 7);
    const data = await listarPecasCliente();
    cachePedidos.clear();
    data.forEach(p => cachePedidos.set(p.id, p));
    if (cacheClientes.size === 0) {
        (await listarClientes()).forEach(c => cacheClientes.set(c.id, c));
    }
    if (cachePecas.size === 0) {
        (await listarPecas3d()).forEach(p => cachePecas.set(p.id, p));
    }
    if (data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center py-3 text-muted">Nenhum pedido cadastrado.</td></tr>';
        return;
    }
    tbody.innerHTML = data.map(item => {
        const clienteNome = cacheClientes.get(item.id_cliente)?.nome ?? `#${item.id_cliente}`;
        const pecaNome    = cachePecas.get(item.id_peca3d)?.modelo ?? `#${item.id_peca3d}`;
        const statusClass = item.status === 'Concluído' ? 'bg-success'
            : item.status === 'Cancelado' ? 'bg-danger' : 'bg-warning text-dark';
        return `
        <tr>
            <td class="fw-bold">#${item.id}</td>
            <td>${escapeHtml(pecaNome)}</td>
            <td>${escapeHtml(clienteNome)}</td>
            <td>${escapeHtml(item.observacao)}</td>
            <td><span class="badge ${statusClass}">${escapeHtml(item.status ?? 'Pendente')}</span></td>
            <td>${formatDate(item.data_solicitacao)}</td>
            <td class="text-end">
                <button data-action="edit" data-entity="pedido" data-id="${item.id}"
                    class="btn btn-sm btn-outline-primary me-1" aria-label="Editar pedido #${item.id}">
                    <i class="fa-solid fa-pen"></i>
                </button>
                <button data-action="delete" data-entity="pedido" data-id="${item.id}"
                    class="btn btn-sm btn-outline-danger" aria-label="Excluir pedido #${item.id}">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        </tr>`;
    }).join('');
}

// ─── Modal de formulário ───────────────────────────────────────────────────────
async function openModal(entity: string, id?: number): Promise<void> {
    activeEntity = entity;
    editingId = id ?? null;

    const data = id != null ? getEntityFromCache(entity, id) : null;

    const titleEl  = document.getElementById('modal-title');
    const fieldsEl = document.getElementById('modal-fields');
    const alertEl  = document.getElementById('modal-alert');
    const idField  = document.getElementById('field-id') as HTMLInputElement | null;
    const form     = document.getElementById('generic-form') as HTMLFormElement | null;

    if (idField)  idField.value = id != null ? String(id) : '';
    if (titleEl)  titleEl.textContent = id != null
        ? `Editar ${entityLabel(entity)}`
        : `Adicionar ${entityLabel(entity)}`;

    form?.classList.remove('was-validated');
    setModalError(alertEl, null);

    if (fieldsEl) fieldsEl.innerHTML =
        '<div class="text-center py-3"><div class="spinner-border spinner-border-sm text-secondary"></div></div>';

    if (!bsModalInstance) {
        const modalEl = document.getElementById('form-modal');
        if (modalEl) bsModalInstance = new bootstrap.Modal(modalEl);
    }
    if (bsModalInstance) bsModalInstance.show();

    const fieldsHtml = await buildFormFields(entity);
    if (fieldsEl) {
        fieldsEl.innerHTML = fieldsHtml;
        if (id != null && data != null) populateFormFields(entity, data);
    }
}

function getEntityFromCache(entity: string, id: number): any {
    switch (entity) {
        case 'cliente':      return cacheClientes.get(id) ?? null;
        case 'categoria':    return cacheCategorias.get(id) ?? null;
        case 'subcategoria': return cacheSubcategorias.get(id) ?? null;
        case 'peca':         return cachePecas.get(id) ?? null;
        case 'pedido':       return cachePedidos.get(id) ?? null;
        default:             return null;
    }
}

function entityLabel(entity: string): string {
    const labels: Record<string, string> = {
        cliente: 'Cliente', categoria: 'Categoria',
        subcategoria: 'Subcategoria', peca: 'Peça 3D', pedido: 'Pedido',
    };
    return labels[entity] ?? entity.toUpperCase();
}

async function buildFormFields(entity: string): Promise<string> {
    if (entity === 'cliente') {
        return `
        <div class="mb-3">
            <label for="c-nome" class="form-label fw-bold">Nome <span class="text-danger">*</span></label>
            <input type="text" id="c-nome" class="form-control" required>
        </div>
        <div class="mb-3">
            <label for="c-email" class="form-label fw-bold">Email <span class="text-danger">*</span></label>
            <input type="email" id="c-email" class="form-control" required>
        </div>
        <div class="mb-3">
            <label for="c-telefone" class="form-label fw-bold">Telefone</label>
            <input type="text" id="c-telefone" class="form-control">
        </div>
        <div class="mb-3">
            <label for="c-endereco" class="form-label fw-bold">Endereço</label>
            <input type="text" id="c-endereco" class="form-control">
        </div>`;
    }

    if (entity === 'categoria') {
        return `
        <div class="mb-3">
            <label for="cat-nome" class="form-label fw-bold">Nome <span class="text-danger">*</span></label>
            <input type="text" id="cat-nome" class="form-control" required>
        </div>`;
    }

    if (entity === 'subcategoria') {
        const cats = cacheCategorias.size > 0
            ? Array.from(cacheCategorias.values())
            : await listarCategorias().then(list => { list.forEach(c => cacheCategorias.set(c.id, c)); return list; });
        const opts = cats.map(c => `<option value="${c.id}">${escapeHtml(c.nome)}</option>`).join('');
        return `
        <div class="mb-3">
            <label for="scat-nome" class="form-label fw-bold">Nome <span class="text-danger">*</span></label>
            <input type="text" id="scat-nome" class="form-control" required>
        </div>
        <div class="mb-3">
            <label for="scat-id-cat" class="form-label fw-bold">Categoria Pai <span class="text-danger">*</span></label>
            <select id="scat-id-cat" class="form-select" required>
                <option value="">Selecione...</option>${opts}
            </select>
        </div>`;
    }

    if (entity === 'peca') {
        const subs = cacheSubcategorias.size > 0
            ? Array.from(cacheSubcategorias.values())
            : await listarSubcategorias().then(list => { list.forEach(s => cacheSubcategorias.set(s.id, s)); return list; });
        const opts = subs.map(s => `<option value="${s.id}">${escapeHtml(s.nome)}</option>`).join('');
        return `
        <div class="mb-3">
            <label for="p-modelo" class="form-label fw-bold">Modelo <span class="text-danger">*</span></label>
            <input type="text" id="p-modelo" class="form-control" required>
        </div>
        <div class="mb-3">
            <label for="p-desc" class="form-label fw-bold">Descrição</label>
            <input type="text" id="p-desc" class="form-control">
        </div>
        <div class="row g-2 mb-3">
            <div class="col-6">
                <label for="p-tamanho" class="form-label fw-bold">Tamanho (cm³)</label>
                <input type="number" id="p-tamanho" class="form-control">
            </div>
            <div class="col-6">
                <label for="p-tempo" class="form-label fw-bold">Tempo (HH:MM:SS)</label>
                <input type="text" id="p-tempo" placeholder="02:30:00" class="form-control">
            </div>
        </div>
        <div class="row g-2 mb-3">
            <div class="col-6">
                <label for="p-peso" class="form-label fw-bold">Peso (g)</label>
                <input type="number" step="0.01" id="p-peso" class="form-control">
            </div>
            <div class="col-6">
                <label for="p-preco" class="form-label fw-bold">Preço (R$)</label>
                <input type="number" step="0.01" id="p-preco" class="form-control">
            </div>
        </div>
        <div class="mb-3">
            <label for="p-quantidade" class="form-label fw-bold">Quantidade <span class="text-danger">*</span></label>
            <input type="number" min="0" step="1" id="p-quantidade" value="0" class="form-control" required>
        </div>
        <div class="mb-3">
            <label for="p-id-sub" class="form-label fw-bold">Subcategoria <span class="text-danger">*</span></label>
            <select id="p-id-sub" class="form-select" required>
                <option value="">Selecione...</option>${opts}
            </select>
        </div>`;
    }

    if (entity === 'pedido') {
        const [clientes, pecas] = await Promise.all([
            cacheClientes.size > 0
                ? Promise.resolve(Array.from(cacheClientes.values()))
                : listarClientes().then(l => { l.forEach(c => cacheClientes.set(c.id, c)); return l; }),
            cachePecas.size > 0
                ? Promise.resolve(Array.from(cachePecas.values()))
                : listarPecas3d().then(l => { l.forEach(p => cachePecas.set(p.id, p)); return l; }),
        ]);
        const cliOpts = clientes.map(c => `<option value="${c.id}">${escapeHtml(c.nome)}</option>`).join('');
        const pecOpts = pecas.map(p => `<option value="${p.id}">${escapeHtml(p.modelo)}</option>`).join('');
        return `
        <div class="mb-3">
            <label for="ped-id-peca" class="form-label fw-bold">Peça 3D <span class="text-danger">*</span></label>
            <select id="ped-id-peca" class="form-select" required>
                <option value="">Selecione...</option>${pecOpts}
            </select>
        </div>
        <div class="mb-3">
            <label for="ped-id-cli" class="form-label fw-bold">Cliente <span class="text-danger">*</span></label>
            <select id="ped-id-cli" class="form-select" required>
                <option value="">Selecione...</option>${cliOpts}
            </select>
        </div>
        <div class="mb-3">
            <label for="ped-obs" class="form-label fw-bold">Observação</label>
            <input type="text" id="ped-obs" class="form-control">
        </div>
        <div class="mb-3">
            <label for="ped-status" class="form-label fw-bold">Status</label>
            <select id="ped-status" class="form-select">
                <option value="Pendente">Pendente</option>
                <option value="Concluído">Concluído</option>
                <option value="Cancelado">Cancelado</option>
            </select>
        </div>`;
    }

    return '<p class="text-muted">Entidade desconhecida.</p>';
}

function populateFormFields(entity: string, data: any): void {
    const setVal = (id: string, val: string | number | null | undefined) => {
        const el = document.getElementById(id) as HTMLInputElement | HTMLSelectElement | null;
        if (el) el.value = val != null ? String(val) : '';
    };
    if (entity === 'cliente') {
        setVal('c-nome', data.nome); setVal('c-email', data.email);
        setVal('c-telefone', data.telefone); setVal('c-endereco', data.endereco);
    } else if (entity === 'categoria') {
        setVal('cat-nome', data.nome);
    } else if (entity === 'subcategoria') {
        setVal('scat-nome', data.nome); setVal('scat-id-cat', data.id_categoria);
    } else if (entity === 'peca') {
        setVal('p-modelo', data.modelo); setVal('p-desc', data.descricao);
        setVal('p-tamanho', data.tamanho); setVal('p-tempo', data.tempoImpressao);
        setVal('p-peso', data.peso); setVal('p-preco', data.preco);
        setVal('p-quantidade', data.quantidade ?? 0); setVal('p-id-sub', data.id_subcategoria);
    } else if (entity === 'pedido') {
        setVal('ped-id-peca', data.id_peca3d); setVal('ped-id-cli', data.id_cliente);
        setVal('ped-obs', data.observacao); setVal('ped-status', data.status ?? 'Pendente');
    }
}

function closeModal(): void {
    if (bsModalInstance) bsModalInstance.hide();
}

// ─── Salvamento ────────────────────────────────────────────────────────────────
let isSaving = false;

async function saveForm(e: Event): Promise<void> {
    e.preventDefault();
    if (isSaving) return;

    const form = e.target as HTMLFormElement;
    if (!form.checkValidity()) { form.classList.add('was-validated'); return; }
    form.classList.remove('was-validated');

    isSaving = true;
    const submitBtn = form.querySelector('button[type="submit"]') as HTMLButtonElement | null;
    if (submitBtn) setButtonLoading(submitBtn, true);
    const alertEl = document.getElementById('modal-alert');
    setModalError(alertEl, null);

    try {
        let mensagem = '';
        const isEdit = editingId != null;

        if (activeEntity === 'cliente') {
            const d = {
                nome:     (document.getElementById('c-nome')     as HTMLInputElement).value,
                email:    (document.getElementById('c-email')    as HTMLInputElement).value,
                telefone: (document.getElementById('c-telefone') as HTMLInputElement).value || null,
                endereco: (document.getElementById('c-endereco') as HTMLInputElement).value || null,
            };
            mensagem = isEdit ? await atualizarCliente({ id: editingId!, ...d }) : await criarCliente(d);
        } else if (activeEntity === 'categoria') {
            const d = { nome: (document.getElementById('cat-nome') as HTMLInputElement).value };
            mensagem = isEdit ? await atualizarCategoria({ id: editingId!, ...d }) : await criarCategoria(d);
        } else if (activeEntity === 'subcategoria') {
            const d = {
                nome:         (document.getElementById('scat-nome')   as HTMLInputElement).value,
                id_categoria: Number((document.getElementById('scat-id-cat') as HTMLSelectElement).value),
            };
            mensagem = isEdit ? await atualizarSubcategoria({ id: editingId!, ...d }) : await criarSubcategoria(d);
        } else if (activeEntity === 'peca') {
            const num = (id: string) => { const v = (document.getElementById(id) as HTMLInputElement).value; return v ? Number(v) : null; };
            const d = {
                modelo:         (document.getElementById('p-modelo')    as HTMLInputElement).value,
                descricao:      (document.getElementById('p-desc')      as HTMLInputElement).value || null,
                tamanho:        num('p-tamanho'),
                tempoImpressao: (document.getElementById('p-tempo')     as HTMLInputElement).value || null,
                peso:           num('p-peso'),
                preco:          num('p-preco'),
                quantidade:     Number((document.getElementById('p-quantidade') as HTMLInputElement).value),
                id_subcategoria: Number((document.getElementById('p-id-sub') as HTMLSelectElement).value),
            };
            mensagem = isEdit ? await atualizarPeca3d({ id: editingId!, ...d }) : await criarPeca3d(d);
        } else if (activeEntity === 'pedido') {
            const d = {
                id_peca3d:  Number((document.getElementById('ped-id-peca') as HTMLSelectElement).value),
                id_cliente: Number((document.getElementById('ped-id-cli')  as HTMLSelectElement).value),
                observacao: (document.getElementById('ped-obs')    as HTMLInputElement).value || null,
                status:     (document.getElementById('ped-status') as HTMLSelectElement).value || 'Pendente',
            };
            mensagem = isEdit ? await atualizarPecaCliente({ id: editingId!, ...d }) : await criarPecaCliente(d);
        }

        closeModal();
        showToast(mensagem, 'success');
        await loadTabData(activeTab);

    } catch (err) {
        setModalError(alertEl, err instanceof Error ? err.message : 'Erro desconhecido ao salvar.');
    } finally {
        isSaving = false;
        if (submitBtn) setButtonLoading(submitBtn, false);
    }
}

// ─── Exclusão ──────────────────────────────────────────────────────────────────
async function deleteItem(entity: string, id: number): Promise<void> {
    const confirmed = await confirmAction(
        `Excluir ${entityLabel(entity)}`,
        `Deseja realmente excluir este(a) ${entityLabel(entity).toLowerCase()}? Esta ação não pode ser desfeita.`
    );
    if (!confirmed) return;

    try {
        let mensagem = '';
        if (entity === 'cliente')      mensagem = await excluirCliente(id);
        else if (entity === 'categoria')    mensagem = await excluirCategoria(id);
        else if (entity === 'subcategoria') mensagem = await excluirSubcategoria(id);
        else if (entity === 'peca')         mensagem = await excluirPeca3d(id);
        else if (entity === 'pedido')       mensagem = await excluirPecaCliente(id);
        showToast(mensagem, 'success');
        await loadTabData(activeTab);
    } catch (err) {
        showToast(err instanceof Error ? err.message : 'Erro ao excluir.', 'danger');
    }
}

// ─── Delegação de eventos ──────────────────────────────────────────────────────
function setupEventDelegation(): void {
    document.addEventListener('click', async (e) => {
        const target = e.target as HTMLElement;

        const tabBtn = target.closest('[data-tab]') as HTMLElement | null;
        if (tabBtn) { switchTabInternal(tabBtn.dataset['tab']!); return; }

        const newBtn = target.closest('[data-action="new"]') as HTMLElement | null;
        if (newBtn) { await openModal(newBtn.dataset['entity']!); return; }

        const editBtn = target.closest('[data-action="edit"]') as HTMLElement | null;
        if (editBtn) {
            await openModal(editBtn.dataset['entity']!, Number(editBtn.dataset['id']));
            return;
        }

        const deleteBtn = target.closest('[data-action="delete"]') as HTMLElement | null;
        if (deleteBtn) { await deleteItem(deleteBtn.dataset['entity']!, Number(deleteBtn.dataset['id'])); return; }
    });

    document.addEventListener('submit', (e) => {
        if ((e.target as HTMLElement).id === 'generic-form') saveForm(e);
    });
}

// ─── Inicialização ─────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
    try {
        await loadInterface();
        setupEventDelegation();
        const startTab = getActiveTabFromUrl();
        switchTabInternal(startTab, false);
        if (!window.location.hash) history.replaceState(null, '', `#${startTab}`);
    } catch (err) {
        console.error('Falha ao inicializar a interface:', err);
        alert('Falha ao carregar a interface do painel. Verifique o console.');
    }
});
