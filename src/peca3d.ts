import { Peca3d } from './types.js';

export async function listarPecas3d(): Promise<Peca3d[]> {
    try {
        const resposta = await fetch('peca3d.php');
        if (!resposta.ok) throw new Error(`Erro na requisição: Status ${resposta.status}`);
        return await resposta.json();
    } catch (erro) {
        console.error('Falha ao listar peças 3D:', erro);
        throw erro;
    }
}

export async function criarPeca3d(peca: Omit<Peca3d, 'id'>): Promise<void> {
    try {
        const resposta = await fetch('peca3d.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(peca)
        });
        if (!resposta.ok) throw new Error(`Erro na requisição: Status ${resposta.status}`);
    } catch (erro) {
        console.error('Falha ao criar peça 3D:', erro);
        throw erro;
    }
}

export async function atualizarPeca3d(peca: Peca3d): Promise<void> {
    try {
        const resposta = await fetch('peca3d.php', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(peca)
        });
        if (!resposta.ok) throw new Error(`Erro na requisição: Status ${resposta.status}`);
    } catch (erro) {
        console.error('Falha ao atualizar peça 3D:', erro);
        throw erro;
    }
}

export async function excluirPeca3d(id: number): Promise<void> {
    try {
        const resposta = await fetch('peca3d.php', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        });
        if (!resposta.ok) throw new Error(`Erro na requisição: Status ${resposta.status}`);
    } catch (erro) {
        console.error('Falha ao excluir peça 3D:', erro);
        throw erro;
    }
}
