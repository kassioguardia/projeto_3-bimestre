import {
    listarClientes, criarCliente, atualizarCliente, excluirCliente,
    listarCategorias, criarCategoria, atualizarCategoria, excluirCategoria,
    listarSubcategorias, criarSubcategoria, atualizarSubcategoria, excluirSubcategoria,
    listarPecas3d, criarPeca3d, atualizarPeca3d, excluirPeca3d,
    listarPecasCliente, criarPecaCliente, atualizarPecaCliente, excluirPecaCliente
} from './app.js';

declare const bootstrap: any;

let activeTab = 'dashboard';
let activeEntity = '';
let bsModalInstance: any = null;

const componentFiles: Record<string, string> = {
    'sidebar-container': 'components/sidebar.html',
    'header-container': 'components/header.html',
    'modal-container': 'components/modal.html'
};

const tabNames = ['dashboard', 'clientes', 'categorias', 'subcategorias', 'pecas', 'pedidos'];

async function loadInterface(): Promise<void> {
    await Promise.all(Object.entries(componentFiles).map(async ([containerId, file]) => {
        const response = await fetch(file);
        if (!response.ok) throw new Error(`Falha ao carregar ${file}`);
        const container = document.getElementById(containerId);
        if (container) container.innerHTML = await response.text();
    }));

    const tabsContainer = document.getElementById('tabs-container');
    if (!tabsContainer) throw new Error('Container das abas não encontrado.');

    const tabs = await Promise.all(tabNames.map(async (tabName) => {
        const response = await fetch(`tabs/${tabName}.html`);
        if (!response.ok) throw new Error(`Falha ao carregar tabs/${tabName}.html`);
        return response.text();
    }));
    tabsContainer.innerHTML = tabs.join('');
    document.dispatchEvent(new CustomEvent('dashboard:ready'));
}

function switchTab(tabName: string) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.add('d-none'));
    document.querySelectorAll('.sidebar .nav-link').forEach(el => el.classList.remove('active'));

    document.getElementById(`tab-${tabName}`)?.classList.remove('d-none');
    document.getElementById(`btn-${tabName}`)?.classList.add('active');

    const titleMap: Record<string, string> = {
        'dashboard': 'Painel Geral',
        'clientes': 'Gerenciamento de Clientes',
        'categorias': 'Gerenciamento de Categorias',
        'subcategorias': 'Gerenciamento de Subcategorias',
        'pecas': 'Gerenciamento de Peças 3D',
        'pedidos': 'Gerenciamento de Pedidos'
    };
    
    const titleEl = document.getElementById('page-title');
    if (titleEl) {
        titleEl.innerText = titleMap[tabName] || 'Painel';
    }
    activeTab = tabName;

    loadTabData(tabName);
}

async function loadTabData(tabName: string) {
    try {
        if (tabName === 'clientes') {
            const data = await listarClientes();
            const tbody = document.getElementById('tabela-clientes-body');
            if (tbody) {
                tbody.innerHTML = data.map(item => `
                    <tr>
                        <td class="fw-bold">#${item.id}</td>
                        <td>${item.nome}</td>
                        <td>${item.email}</td>
                        <td>${item.telefone || '-'}</td>
                        <td>${item.endereco || '-'}</td>
                        <td>${item.data_cadastro ? new Date(item.data_cadastro).toLocaleDateString('pt-BR') : '-'}</td>
                        <td class="text-end">
                            <button onclick='editItem("cliente", ${JSON.stringify(item)})' class="btn btn-sm btn-outline-primary me-1"><i class="fa-solid fa-pen"></i></button>
                            <button onclick='deleteItem("cliente", ${item.id})' class="btn btn-sm btn-outline-danger"><i class="fa-solid fa-trash"></i></button>
                        </td>
                    </tr>
                `).join('') || '<tr><td colspan="7" class="text-center py-3">Nenhum cliente cadastrado.</td></tr>';
            }
        } else if (tabName === 'categorias') {
            const data = await listarCategorias();
            const tbody = document.getElementById('tabela-categorias-body');
            if (tbody) {
                tbody.innerHTML = data.map(item => `
                    <tr>
                        <td class="fw-bold">#${item.id}</td>
                        <td>${item.nome}</td>
                        <td class="text-end">
                            <button onclick='editItem("categoria", ${JSON.stringify(item)})' class="btn btn-sm btn-outline-primary me-1"><i class="fa-solid fa-pen"></i></button>
                            <button onclick='deleteItem("categoria", ${item.id})' class="btn btn-sm btn-outline-danger"><i class="fa-solid fa-trash"></i></button>
                        </td>
                    </tr>
                `).join('') || '<tr><td colspan="3" class="text-center py-3">Nenhuma categoria cadastrada.</td></tr>';
            }
        } else if (tabName === 'subcategorias') {
            const data = await listarSubcategorias();
            const tbody = document.getElementById('tabela-subcategorias-body');
            if (tbody) {
                tbody.innerHTML = data.map(item => `
                    <tr>
                        <td class="fw-bold">#${item.id}</td>
                        <td>${item.nome}</td>
                        <td>ID: ${item.id_categoria}</td>
                        <td class="text-end">
                            <button onclick='editItem("subcategoria", ${JSON.stringify(item)})' class="btn btn-sm btn-outline-primary me-1"><i class="fa-solid fa-pen"></i></button>
                            <button onclick='deleteItem("subcategoria", ${item.id})' class="btn btn-sm btn-outline-danger"><i class="fa-solid fa-trash"></i></button>
                        </td>
                    </tr>
                `).join('') || '<tr><td colspan="4" class="text-center py-3">Nenhuma subcategoria cadastrada.</td></tr>';
            }
        } else if (tabName === 'pecas') {
            const data = await listarPecas3d();
            const tbody = document.getElementById('tabela-pecas-body');
            if (tbody) {
                tbody.innerHTML = data.map(item => `
                    <tr>
                        <td class="fw-bold">#${item.id}</td>
                        <td class="fw-bold text-secondary">${item.modelo}</td>
                        <td>${item.descricao || '-'}</td>
                        <td>${item.tamanho || '-'}</td>
                        <td>${item.tempoImpressao || '-'}</td>
                        <td>${item.peso ? item.peso + 'g' : '-'}</td>
                        <td class="text-success fw-bold">${item.preco ? 'R$ ' + Number(item.preco).toFixed(2) : '-'}</td>
                        <td>Subcat: ${item.id_subcategoria}</td>
                        <td class="text-end">
                            <button onclick='editItem("peca", ${JSON.stringify(item)})' class="btn btn-sm btn-outline-primary me-1"><i class="fa-solid fa-pen"></i></button>
                            <button onclick='deleteItem("peca", ${item.id})' class="btn btn-sm btn-outline-danger"><i class="fa-solid fa-trash"></i></button>
                        </td>
                    </tr>
                `).join('') || '<tr><td colspan="9" class="text-center py-3">Nenhuma peça 3D cadastrada.</td></tr>';
            }
        } else if (tabName === 'pedidos') {
            const data = await listarPecasCliente();
            const tbody = document.getElementById('tabela-pedidos-body');
            if (tbody) {
                tbody.innerHTML = data.map(item => `
                    <tr>
                        <td class="fw-bold">#${item.id}</td>
                        <td>Peça #${item.id_peca3d}</td>
                        <td>Cliente #${item.id_cliente}</td>
                        <td>${item.observacao || '-'}</td>
                        <td>
                            <span class="badge ${
                                item.status === 'Concluído' ? 'bg-success' :
                                item.status === 'Cancelado' ? 'bg-danger' : 'bg-warning text-dark'
                            }">${item.status || 'Pendente'}</span>
                        </td>
                        <td>${item.data_solicitacao ? new Date(item.data_solicitacao).toLocaleDateString('pt-BR') : '-'}</td>
                        <td class="text-end">
                            <button onclick='editItem("pedido", ${JSON.stringify(item)})' class="btn btn-sm btn-outline-primary me-1"><i class="fa-solid fa-pen"></i></button>
                            <button onclick='deleteItem("pedido", ${item.id})' class="btn btn-sm btn-outline-danger"><i class="fa-solid fa-trash"></i></button>
                        </td>
                    </tr>
                `).join('') || '<tr><td colspan="7" class="text-center py-3">Nenhum pedido cadastrado.</td></tr>';
            }
        }
    } catch (err) {
        console.error(err);
        alert("Falha ao carregar os dados desta seção.");
    }
}

function openModal(entity: string, data: any = null) {
    activeEntity = entity;
    const titleEl = document.getElementById('modal-title');
    const fieldsEl = document.getElementById('modal-fields');
    const idField = document.getElementById('field-id') as HTMLInputElement;

    if (idField) idField.value = data ? data.id : '';
    if (titleEl) titleEl.innerText = data ? `Editar ${entity.toUpperCase()}` : `Adicionar ${entity.toUpperCase()}`;

    let fieldsHtml = '';

    if (entity === 'cliente') {
        fieldsHtml = `
            <div class="mb-3">
                <label class="form-label font-bold">Nome</label>
                <input type="text" id="c-nome" value="${data ? data.nome : ''}" required class="form-control">
            </div>
            <div class="mb-3">
                <label class="form-label font-bold">Email</label>
                <input type="email" id="c-email" value="${data ? data.email : ''}" required class="form-control">
            </div>
            <div class="mb-3">
                <label class="form-label font-bold">Telefone</label>
                <input type="text" id="c-telefone" value="${data ? data.telefone || '' : ''}" class="form-control">
            </div>
            <div class="mb-3">
                <label class="form-label font-bold">Endereço</label>
                <input type="text" id="c-endereco" value="${data ? data.endereco || '' : ''}" class="form-control">
            </div>
        `;
    } else if (entity === 'categoria') {
        fieldsHtml = `
            <div class="mb-3">
                <label class="form-label font-bold">Nome</label>
                <input type="text" id="cat-nome" value="${data ? data.nome : ''}" required class="form-control">
            </div>
        `;
    } else if (entity === 'subcategoria') {
        fieldsHtml = `
            <div class="mb-3">
                <label class="form-label font-bold">Nome</label>
                <input type="text" id="scat-nome" value="${data ? data.nome : ''}" required class="form-control">
            </div>
            <div class="mb-3">
                <label class="form-label font-bold">ID Categoria Pai</label>
                <input type="number" id="scat-id-cat" value="${data ? data.id_categoria : ''}" required class="form-control">
            </div>
        `;
    } else if (entity === 'peca') {
        fieldsHtml = `
            <div class="mb-3">
                <label class="form-label font-bold">Modelo</label>
                <input type="text" id="p-modelo" value="${data ? data.modelo : ''}" required class="form-control">
            </div>
            <div class="mb-3">
                <label class="form-label font-bold">Descrição</label>
                <input type="text" id="p-desc" value="${data ? data.descricao || '' : ''}" class="form-control">
            </div>
            <div class="row g-2 mb-3">
                <div class="col-6">
                    <label class="form-label font-bold">Tamanho (cm³)</label>
                    <input type="number" id="p-tamanho" value="${data ? data.tamanho || '' : ''}" class="form-control">
                </div>
                <div class="col-6">
                    <label class="form-label font-bold">Tempo (HH:MM:SS)</label>
                    <input type="text" id="p-tempo" placeholder="02:30:00" value="${data ? data.tempoImpressao || '' : ''}" class="form-control">
                </div>
            </div>
            <div class="row g-2 mb-3">
                <div class="col-6">
                    <label class="form-label font-bold">Peso (g)</label>
                    <input type="number" step="0.01" id="p-peso" value="${data ? data.peso || '' : ''}" class="form-control">
                </div>
                <div class="col-6">
                    <label class="form-label font-bold">Preço (R$)</label>
                    <input type="number" step="0.01" id="p-preco" value="${data ? data.preco || '' : ''}" class="form-control">
                </div>
            </div>
            <div class="mb-3">
                <label class="form-label font-bold">ID Subcategoria</label>
                <input type="number" id="p-id-sub" value="${data ? data.id_subcategoria : ''}" required class="form-control">
            </div>
        `;
    } else if (entity === 'pedido') {
        fieldsHtml = `
            <div class="mb-3">
                <label class="form-label font-bold">ID Peça 3D</label>
                <input type="number" id="ped-id-peca" value="${data ? data.id_peca3d : ''}" required class="form-control">
            </div>
            <div class="mb-3">
                <label class="form-label font-bold">ID Cliente</label>
                <input type="number" id="ped-id-cli" value="${data ? data.id_cliente : ''}" required class="form-control">
            </div>
            <div class="mb-3">
                <label class="form-label font-bold">Observação</label>
                <input type="text" id="ped-obs" value="${data ? data.observacao || '' : ''}" class="form-control">
            </div>
            <div class="mb-3">
                <label class="form-label font-bold">Status</label>
                <select id="ped-status" class="form-select">
                    <option value="Pendente" ${data && data.status === 'Pendente' ? 'selected' : ''}>Pendente</option>
                    <option value="Concluído" ${data && data.status === 'Concluído' ? 'selected' : ''}>Concluído</option>
                    <option value="Cancelado" ${data && data.status === 'Cancelado' ? 'selected' : ''}>Cancelado</option>
                </select>
            </div>
        `;
    }

    if (fieldsEl) fieldsEl.innerHTML = fieldsHtml;

    if (!bsModalInstance) {
        const modalEl = document.getElementById('form-modal');
        if (modalEl) {
            bsModalInstance = new bootstrap.Modal(modalEl);
        }
    }
    if (bsModalInstance) bsModalInstance.show();
}

function closeModal() {
    if (bsModalInstance) {
        bsModalInstance.hide();
    }
}

async function saveForm(e: Event) {
    e.preventDefault();
    const idField = document.getElementById('field-id') as HTMLInputElement;
    const id = idField ? idField.value : '';
    const isEdit = id !== '';

    try {
        if (activeEntity === 'cliente') {
            const clientData = {
                nome: (document.getElementById('c-nome') as HTMLInputElement).value,
                email: (document.getElementById('c-email') as HTMLInputElement).value,
                telefone: (document.getElementById('c-telefone') as HTMLInputElement).value || null,
                endereco: (document.getElementById('c-endereco') as HTMLInputElement).value || null
            };
            if (isEdit) {
                await atualizarCliente({ id: Number(id), ...clientData });
            } else {
                await criarCliente(clientData);
            }
        } else if (activeEntity === 'categoria') {
            const catData = {
                nome: (document.getElementById('cat-nome') as HTMLInputElement).value
            };
            if (isEdit) {
                await atualizarCategoria({ id: Number(id), ...catData });
            } else {
                await criarCategoria(catData);
            }
        } else if (activeEntity === 'subcategoria') {
            const scatData = {
                nome: (document.getElementById('scat-nome') as HTMLInputElement).value,
                id_categoria: Number((document.getElementById('scat-id-cat') as HTMLInputElement).value)
            };
            if (isEdit) {
                await atualizarSubcategoria({ id: Number(id), ...scatData });
            } else {
                await criarSubcategoria(scatData);
            }
        } else if (activeEntity === 'peca') {
            const pecaData = {
                modelo: (document.getElementById('p-modelo') as HTMLInputElement).value,
                descricao: (document.getElementById('p-desc') as HTMLInputElement).value || null,
                tamanho: (document.getElementById('p-tamanho') as HTMLInputElement).value ? Number((document.getElementById('p-tamanho') as HTMLInputElement).value) : null,
                tempoImpressao: (document.getElementById('p-tempo') as HTMLInputElement).value || null,
                peso: (document.getElementById('p-peso') as HTMLInputElement).value ? parseFloat((document.getElementById('p-peso') as HTMLInputElement).value) : null,
                preco: (document.getElementById('p-preco') as HTMLInputElement).value ? parseFloat((document.getElementById('p-preco') as HTMLInputElement).value) : null,
                id_subcategoria: Number((document.getElementById('p-id-sub') as HTMLInputElement).value)
            };
            if (isEdit) {
                await atualizarPeca3d({ id: Number(id), ...pecaData });
            } else {
                await criarPeca3d(pecaData);
            }
        } else if (activeEntity === 'pedido') {
            const pedData = {
                id_peca3d: Number((document.getElementById('ped-id-peca') as HTMLInputElement).value),
                id_cliente: Number((document.getElementById('ped-id-cli') as HTMLInputElement).value),
                observacao: (document.getElementById('ped-obs') as HTMLInputElement).value || null,
                status: (document.getElementById('ped-status') as HTMLSelectElement).value || null
            };
            if (isEdit) {
                await atualizarPecaCliente({ id: Number(id), ...pedData });
            } else {
                await criarPecaCliente(pedData);
            }
        }

        closeModal();
        loadTabData(activeTab);
    } catch (err) {
        console.error(err);
        alert("Ocorreu um erro ao salvar o registro.");
    }
}

async function editItem(entity: string, data: any) {
    openModal(entity, data);
}

async function deleteItem(entity: string, id: number) {
    if (!confirm(`Deseja realmente excluir este registro?`)) return;

    try {
        if (entity === 'cliente') await excluirCliente(id);
        else if (entity === 'categoria') await excluirCategoria(id);
        else if (entity === 'subcategoria') await excluirSubcategoria(id);
        else if (entity === 'peca') await excluirPeca3d(id);
        else if (entity === 'pedido') await excluirPecaCliente(id);

        loadTabData(activeTab);
    } catch (err) {
        console.error(err);
        alert("Ocorreu um erro ao excluir o registro.");
    }
}

(window as any).switchTab = switchTab;
(window as any).openModal = openModal;
(window as any).closeModal = closeModal;
(window as any).saveForm = saveForm;
(window as any).editItem = editItem;
(window as any).deleteItem = deleteItem;

document.addEventListener('DOMContentLoaded', async () => {
    try {
        await loadInterface();
        switchTab('dashboard');
    } catch (err) {
        console.error(err);
        alert('Falha ao carregar a interface do painel.');
    }
});
