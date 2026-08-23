import { PecaCliente } from './types.js';

export async function listarPecasCliente(): Promise<PecaCliente[]> {
    try {
        const resposta = await fetch('peca_cliente.php');
        if (!resposta.ok) throw new Error(`Erro na requisição: Status ${resposta.status}`);
        return await resposta.json();
    } catch (erro) {
        console.error('Falha ao listar peças do cliente:', erro);
        throw erro;
    }
}

export async function criarPecaCliente(pecaCliente: Omit<PecaCliente, 'id' | 'data_solicitacao'>): Promise<void> {
    try {
        const resposta = await fetch('peca_cliente.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(pecaCliente)
        });
        if (!resposta.ok) throw new Error(`Erro na requisição: Status ${resposta.status}`);
    } catch (erro) {
        console.error('Falha ao criar peça do cliente:', erro);
        throw erro;
    }
}

export async function atualizarPecaCliente(pecaCliente: PecaCliente): Promise<void> {
    try {
        const resposta = await fetch('peca_cliente.php', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(pecaCliente)
        });
        if (!resposta.ok) throw new Error(`Erro na requisição: Status ${resposta.status}`);
    } catch (erro) {
        console.error('Falha ao atualizar peça do cliente:', erro);
        throw erro;
    }
}

export async function excluirPecaCliente(id: number): Promise<void> {
    try {
        const resposta = await fetch('peca_cliente.php', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        });
        if (!resposta.ok) throw new Error(`Erro na requisição: Status ${resposta.status}`);
    } catch (erro) {
        console.error('Falha ao excluir peça do cliente:', erro);
        throw erro;
    }
}
