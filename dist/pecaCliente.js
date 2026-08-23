export async function listarPecasCliente() {
    try {
        const resposta = await fetch('peca_cliente.php');
        if (!resposta.ok)
            throw new Error(`Erro na requisição: Status ${resposta.status}`);
        return await resposta.json();
    }
    catch (erro) {
        console.error('Falha ao listar peças do cliente:', erro);
        throw erro;
    }
}
export async function criarPecaCliente(pecaCliente) {
    try {
        const resposta = await fetch('peca_cliente.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(pecaCliente)
        });
        if (!resposta.ok)
            throw new Error(`Erro na requisição: Status ${resposta.status}`);
    }
    catch (erro) {
        console.error('Falha ao criar peça do cliente:', erro);
        throw erro;
    }
}
export async function atualizarPecaCliente(pecaCliente) {
    try {
        const resposta = await fetch('peca_cliente.php', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(pecaCliente)
        });
        if (!resposta.ok)
            throw new Error(`Erro na requisição: Status ${resposta.status}`);
    }
    catch (erro) {
        console.error('Falha ao atualizar peça do cliente:', erro);
        throw erro;
    }
}
export async function excluirPecaCliente(id) {
    try {
        const resposta = await fetch('peca_cliente.php', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        });
        if (!resposta.ok)
            throw new Error(`Erro na requisição: Status ${resposta.status}`);
    }
    catch (erro) {
        console.error('Falha ao excluir peça do cliente:', erro);
        throw erro;
    }
}
