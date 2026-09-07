import { Peca3d } from './types.js';

export async function listarPecas3d(): Promise<Peca3d[]> {
    try {
        const resposta = await fetch('api/peca3d.php');
        if (!resposta.ok) {
            const erroData = await resposta.json().catch(() => null);
            throw new Error(erroData?.erro || erroData?.error || erroData?.mensagem || `Erro na requisição: Status ${resposta.status}`);
        }
        return await resposta.json();
    } catch (erro) {
        console.error('Falha ao listar peças 3D:', erro);
        throw erro;
    }
}

export async function criarPeca3d(peca: Omit<Peca3d, 'id'>): Promise<string> {
    try {
        const resposta = await fetch('api/peca3d.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(peca)
        });
        if (!resposta.ok) {
            const erroData = await resposta.json().catch(() => null);
            throw new Error(erroData?.erro || erroData?.error || erroData?.mensagem || `Erro na requisição: Status ${resposta.status}`);
        }
        const dados = await resposta.json();
        return dados.mensagem ?? 'Peça 3D cadastrada com sucesso.';
    } catch (erro) {
        console.error('Falha ao criar peça 3D:', erro);
        throw erro;
    }
}

export async function atualizarPeca3d(peca: Peca3d): Promise<string> {
    try {
        const resposta = await fetch('api/peca3d.php', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(peca)
        });
        if (!resposta.ok) {
            const erroData = await resposta.json().catch(() => null);
            throw new Error(erroData?.erro || erroData?.error || erroData?.mensagem || `Erro na requisição: Status ${resposta.status}`);
        }
        const dados = await resposta.json();
        return dados.mensagem ?? 'Peça 3D atualizada com sucesso.';
    } catch (erro) {
        console.error('Falha ao atualizar peça 3D:', erro);
        throw erro;
    }
}

export async function excluirPeca3d(id: number): Promise<string> {
    try {
        const resposta = await fetch('api/peca3d.php', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        });
        if (!resposta.ok) {
            const erroData = await resposta.json().catch(() => null);
            throw new Error(erroData?.erro || erroData?.error || erroData?.mensagem || `Erro na requisição: Status ${resposta.status}`);
        }
        const dados = await resposta.json();
        return dados.mensagem ?? 'Peça 3D excluída com sucesso.';
    } catch (erro) {
        console.error('Falha ao excluir peça 3D:', erro);
        throw erro;
    }
}
