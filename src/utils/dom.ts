
export function escapeHtml(str: string | null | undefined): string {
    if (str == null) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}


export function formatCurrency(val: number | null | undefined | string): string {
    if (val == null || val === "") return "R$ 0,00";
    const num = safeNumber(val);
    return num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function formatDate(val?: string | null): string {
    if (!val) return '-';
    const d = new Date(val);
    if (isNaN(d.getTime())) return val;
    return d.toLocaleDateString('pt-BR');
}

export function safeNumber(val: number | string | null | undefined): number {
    if (val == null) return 0;
    if (typeof val === 'number') return Number.isFinite(val) ? val : 0;
    let s = String(val).trim().replace(/[R$\s]/g, '');
    if (!s) return 0;
    if (s.includes(',') && s.includes('.')) {
        s = s.replace(/\./g, '').replace(',', '.');
    } else if (s.includes(',')) {
        s = s.replace(',', '.');
    }
    const n = parseFloat(s);
    return Number.isFinite(n) ? n : 0;
}
