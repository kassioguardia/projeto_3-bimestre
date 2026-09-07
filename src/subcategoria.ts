import { Subcategoria } from './types.js';

export async function listarSubcategorias(): Promise<Subcategoria[]> {
    try {
        const resposta = await fetch('api/subcategoria.php');
        if (!resposta.ok) {
            const erroData = await resposta.json().catch(() => null);
            throw new Error(erroData?.erro || erroData?.error || erroData?.mensagem || `Erro na requisição: Status ${resposta.status}`);
        }
        return await resposta.json();
    } catch (erro) {
        console.error('Falha ao listar subcategorias:', erro);
        throw erro;
    }
}

export async function criarSubcategoria(subcategoria: Omit<Subcategoria, 'id'>): Promise<string> {
    try {
        const resposta = await fetch('api/subcategoria.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(subcategoria)
        });
        if (!resposta.ok) {
            const erroData = await resposta.json().catch(() => null);
            throw new Error(erroData?.erro || erroData?.error || erroData?.mensagem || `Erro na requisição: Status ${resposta.status}`);
        }
        const dados = await resposta.json();
        return dados.mensagem ?? 'Subcategoria cadastrada com sucesso.';
    } catch (erro) {
        console.error('Falha ao criar subcategoria:', erro);
        throw erro;
    }
}

export async function atualizarSubcategoria(subcategoria: Subcategoria): Promise<string> {
    try {
        const resposta = await fetch('api/subcategoria.php', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(subcategoria)
        });
        if (!resposta.ok) {
            const erroData = await resposta.json().catch(() => null);
            throw new Error(erroData?.erro || erroData?.error || erroData?.mensagem || `Erro na requisição: Status ${resposta.status}`);
        }
        const dados = await resposta.json();
        return dados.mensagem ?? 'Subcategoria atualizada com sucesso.';
    } catch (erro) {
        console.error('Falha ao atualizar subcategoria:', erro);
        throw erro;
    }
}

export async function excluirSubcategoria(id: number): Promise<string> {
    try {
        const resposta = await fetch('api/subcategoria.php', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        });
        if (!resposta.ok) {
            const erroData = await resposta.json().catch(() => null);
            throw new Error(erroData?.erro || erroData?.error || erroData?.mensagem || `Erro na requisição: Status ${resposta.status}`);
        }
        const dados = await resposta.json();
        return dados.mensagem ?? 'Subcategoria excluída com sucesso.';
    } catch (erro) {
        console.error('Falha ao excluir subcategoria:', erro);
        throw erro;
    }
}
