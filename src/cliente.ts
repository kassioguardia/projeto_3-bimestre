import { Cliente } from './types.js';

export async function listarClientes(): Promise<Cliente[]> {
    try {
        const resposta = await fetch('api/cliente.php');
        if (!resposta.ok) throw new Error(`Erro na requisição: Status ${resposta.status}`);
        return await resposta.json();
    } catch (erro) {
        console.error('Falha ao listar clientes:', erro);
        throw erro;
    }
}

export async function criarCliente(cliente: Omit<Cliente, 'id' | 'data_cadastro'>): Promise<void> {
    try {
        const resposta = await fetch('api/cliente.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cliente)
        });
        if (!resposta.ok) throw new Error(`Erro na requisição: Status ${resposta.status}`);
    } catch (erro) {
        console.error('Falha ao criar cliente:', erro);
        throw erro;
    }
}

export async function atualizarCliente(cliente: Cliente): Promise<void> {
    try {
        const resposta = await fetch('api/cliente.php', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cliente)
        });
        if (!resposta.ok) throw new Error(`Erro na requisição: Status ${resposta.status}`);
    } catch (erro) {
        console.error('Falha ao atualizar cliente:', erro);
        throw erro;
    }
}

export async function excluirCliente(id: number): Promise<void> {
    try {
        const resposta = await fetch('api/cliente.php', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        });
        if (!resposta.ok) throw new Error(`Erro na requisição: Status ${resposta.status}`);
    } catch (erro) {
        console.error('Falha ao excluir cliente:', erro);
        throw erro;
    }
}
