import { Categoria } from './types.js';

export async function listarCategorias(): Promise<Categoria[]> {
    try {
        const resposta = await fetch('categoria.php');
        if (!resposta.ok) throw new Error(`Erro na requisição: Status ${resposta.status}`);
        return await resposta.json();
    } catch (erro) {
        console.error('Falha ao listar categorias:', erro);
        throw erro;
    }
}

export async function criarCategoria(categoria: Omit<Categoria, 'id'>): Promise<void> {
    try {
        const resposta = await fetch('categoria.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(categoria)
        });
        if (!resposta.ok) throw new Error(`Erro na requisição: Status ${resposta.status}`);
    } catch (erro) {
        console.error('Falha ao criar categoria:', erro);
        throw erro;
    }
}

export async function atualizarCategoria(categoria: Categoria): Promise<void> {
    try {
        const resposta = await fetch('categoria.php', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(categoria)
        });
        if (!resposta.ok) throw new Error(`Erro na requisição: Status ${resposta.status}`);
    } catch (erro) {
        console.error('Falha ao atualizar categoria:', erro);
        throw erro;
    }
}

export async function excluirCategoria(id: number): Promise<void> {
    try {
        const resposta = await fetch('categoria.php', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        });
        if (!resposta.ok) throw new Error(`Erro na requisição: Status ${resposta.status}`);
    } catch (erro) {
        console.error('Falha ao excluir categoria:', erro);
        throw erro;
    }
}
