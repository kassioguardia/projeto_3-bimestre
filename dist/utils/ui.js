/**
 * Exibe um toast Bootstrap flutuante no canto superior direito.
 */
export function showToast(message, type = 'success') {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'toast-container position-fixed top-0 end-0 p-3';
        container.style.zIndex = '9999';
        document.body.appendChild(container);
    }
    const iconMap = {
        success: 'fa-circle-check',
        danger: 'fa-circle-xmark',
        warning: 'fa-triangle-exclamation',
        info: 'fa-circle-info',
    };
    const headerBgMap = {
        success: 'text-bg-success',
        danger: 'text-bg-danger',
        warning: 'text-bg-warning',
        info: 'text-bg-info',
    };
    const toastEl = document.createElement('div');
    toastEl.className = `toast align-items-center border-0 ${headerBgMap[type]}`;
    toastEl.setAttribute('role', 'alert');
    toastEl.setAttribute('aria-live', 'assertive');
    toastEl.setAttribute('aria-atomic', 'true');
    toastEl.innerHTML = `
        <div class="d-flex">
            <div class="toast-body d-flex align-items-center gap-2">
                <i class="fa-solid ${iconMap[type]}"></i>
                <span>${message}</span>
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Fechar"></button>
        </div>`;
    container.appendChild(toastEl);
    const bsToast = new bootstrap.Toast(toastEl, { delay: 4000 });
    bsToast.show();
    toastEl.addEventListener('hidden.bs.toast', () => toastEl.remove());
}
/**
 * Exibe um modal de confirmação Bootstrap de forma assíncrona.
 * Retorna true se o usuário confirmar, false se cancelar.
 */
export function confirmAction(title, message) {
    return new Promise((resolve) => {
        let modalEl = document.getElementById('confirm-action-modal');
        if (!modalEl) {
            modalEl = document.createElement('div');
            modalEl.id = 'confirm-action-modal';
            modalEl.className = 'modal fade';
            modalEl.setAttribute('tabindex', '-1');
            modalEl.setAttribute('role', 'dialog');
            modalEl.setAttribute('aria-modal', 'true');
            modalEl.innerHTML = `
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content border-0 shadow">
                        <div class="modal-header border-0" style="background-color: #1e1b4b;">
                            <h5 class="modal-title text-white" id="confirm-modal-title"></h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Fechar"></button>
                        </div>
                        <div class="modal-body" id="confirm-modal-body"></div>
                        <div class="modal-footer border-0">
                            <button type="button" class="btn btn-outline-secondary" id="confirm-cancel-btn">Cancelar</button>
                            <button type="button" class="btn btn-danger" id="confirm-ok-btn">
                                <i class="fa-solid fa-trash me-1"></i>Excluir
                            </button>
                        </div>
                    </div>
                </div>`;
            document.body.appendChild(modalEl);
        }
        const titleEl = document.getElementById('confirm-modal-title');
        const bodyEl = document.getElementById('confirm-modal-body');
        const cancelBtn = document.getElementById('confirm-cancel-btn');
        const okBtn = document.getElementById('confirm-ok-btn');
        if (titleEl)
            titleEl.textContent = title;
        if (bodyEl)
            bodyEl.textContent = message;
        const bsModal = new bootstrap.Modal(modalEl);
        const cleanup = (result) => {
            cancelBtn?.removeEventListener('click', onCancel);
            okBtn?.removeEventListener('click', onOk);
            bsModal.hide();
            resolve(result);
        };
        const onCancel = () => cleanup(false);
        const onOk = () => cleanup(true);
        cancelBtn?.addEventListener('click', onCancel);
        okBtn?.addEventListener('click', onOk);
        modalEl.addEventListener('hidden.bs.modal', () => cleanup(false), { once: true });
        bsModal.show();
    });
}
/**
 * Exibe uma linha de carregamento animada dentro de um <tbody>.
 */
export function showTableLoading(tbody, colspan) {
    tbody.innerHTML = `
        <tr>
            <td colspan="${colspan}" class="text-center py-4">
                <div class="spinner-border spinner-border-sm text-secondary me-2" role="status"></div>
                <span class="text-muted">Carregando...</span>
            </td>
        </tr>`;
}
/**
 * Coloca ou remove o estado de loading de um botão de submit.
 */
export function setButtonLoading(btn, loading, loadingText = 'Salvando...') {
    if (loading) {
        btn.dataset['originalText'] = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = `<span class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>${loadingText}`;
    }
    else {
        btn.disabled = false;
        if (btn.dataset['originalText']) {
            btn.innerHTML = btn.dataset['originalText'];
        }
    }
}
/**
 * Exibe ou oculta mensagem de erro dentro do modal de formulário.
 */
export function setModalError(alertEl, message) {
    if (!alertEl)
        return;
    if (message) {
        const span = alertEl.querySelector('span') ?? alertEl;
        span.textContent = message;
        alertEl.classList.remove('d-none');
    }
    else {
        const span = alertEl.querySelector('span') ?? alertEl;
        span.textContent = '';
        alertEl.classList.add('d-none');
    }
}
