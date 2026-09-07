export async function listarClientes() {
    try {
        const resposta = await fetch('api/cliente.php');
        if (!resposta.ok) {
            const erroData = await resposta.json().catch(() => null);
            throw new Error(erroData?.erro || erroData?.error || erroData?.mensagem || `Erro na requisição: Status ${resposta.status}`);
        }
        return await resposta.json();
    }
    catch (erro) {
        console.error('Falha ao listar clientes:', erro);
        throw erro;
    }
}
export async function criarCliente(cliente) {
    try {
        const resposta = await fetch('api/cliente.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cliente)
        });
        if (!resposta.ok) {
            const erroData = await resposta.json().catch(() => null);
            throw new Error(erroData?.erro || erroData?.error || erroData?.mensagem || `Erro na requisição: Status ${resposta.status}`);
        }
        const dados = await resposta.json();
        return dados.mensagem ?? 'Cliente cadastrado com sucesso.';
    }
    catch (erro) {
        console.error('Falha ao criar cliente:', erro);
        throw erro;
    }
}
export async function atualizarCliente(cliente) {
    try {
        const resposta = await fetch('api/cliente.php', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cliente)
        });
        if (!resposta.ok) {
            const erroData = await resposta.json().catch(() => null);
            throw new Error(erroData?.erro || erroData?.error || erroData?.mensagem || `Erro na requisição: Status ${resposta.status}`);
        }
        const dados = await resposta.json();
        return dados.mensagem ?? 'Cliente atualizado com sucesso.';
    }
    catch (erro) {
        console.error('Falha ao atualizar cliente:', erro);
        throw erro;
    }
}
export async function excluirCliente(id) {
    try {
        const resposta = await fetch('api/cliente.php', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        });
        if (!resposta.ok) {
            const erroData = await resposta.json().catch(() => null);
            throw new Error(erroData?.erro || erroData?.error || erroData?.mensagem || `Erro na requisição: Status ${resposta.status}`);
        }
        const dados = await resposta.json();
        return dados.mensagem ?? 'Cliente excluído com sucesso.';
    }
    catch (erro) {
        console.error('Falha ao excluir cliente:', erro);
        throw erro;
    }
}
