export async function listarPecasCliente() {
    try {
        const resposta = await fetch('api/peca_cliente.php');
        if (!resposta.ok) {
            const erroData = await resposta.json().catch(() => null);
            throw new Error(erroData?.erro || erroData?.error || erroData?.mensagem || `Erro na requisição: Status ${resposta.status}`);
        }
        return await resposta.json();
    }
    catch (erro) {
        console.error('Falha ao listar peças do cliente:', erro);
        throw erro;
    }
}
export async function criarPecaCliente(pecaCliente) {
    try {
        const resposta = await fetch('api/peca_cliente.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(pecaCliente)
        });
        if (!resposta.ok) {
            const erroData = await resposta.json().catch(() => null);
            throw new Error(erroData?.erro || erroData?.error || erroData?.mensagem || `Erro na requisição: Status ${resposta.status}`);
        }
        const dados = await resposta.json();
        return dados.mensagem ?? 'Pedido cadastrado com sucesso.';
    }
    catch (erro) {
        console.error('Falha ao criar peça do cliente:', erro);
        throw erro;
    }
}
export async function atualizarPecaCliente(pecaCliente) {
    try {
        const resposta = await fetch('api/peca_cliente.php', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(pecaCliente)
        });
        if (!resposta.ok) {
            const erroData = await resposta.json().catch(() => null);
            throw new Error(erroData?.erro || erroData?.error || erroData?.mensagem || `Erro na requisição: Status ${resposta.status}`);
        }
        const dados = await resposta.json();
        return dados.mensagem ?? 'Pedido atualizado com sucesso.';
    }
    catch (erro) {
        console.error('Falha ao atualizar peça do cliente:', erro);
        throw erro;
    }
}
export async function excluirPecaCliente(id) {
    try {
        const resposta = await fetch('api/peca_cliente.php', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        });
        if (!resposta.ok) {
            const erroData = await resposta.json().catch(() => null);
            throw new Error(erroData?.erro || erroData?.error || erroData?.mensagem || `Erro na requisição: Status ${resposta.status}`);
        }
        const dados = await resposta.json();
        return dados.mensagem ?? 'Pedido excluído com sucesso.';
    }
    catch (erro) {
        console.error('Falha ao excluir peça do cliente:', erro);
        throw erro;
    }
}
