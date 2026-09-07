export async function listarCategorias() {
    try {
        const resposta = await fetch('api/categoria.php');
        if (!resposta.ok) {
            const erroData = await resposta.json().catch(() => null);
            throw new Error(erroData?.erro || erroData?.error || erroData?.mensagem || `Erro na requisição: Status ${resposta.status}`);
        }
        return await resposta.json();
    }
    catch (erro) {
        console.error('Falha ao listar categorias:', erro);
        throw erro;
    }
}
export async function criarCategoria(categoria) {
    try {
        const resposta = await fetch('api/categoria.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(categoria)
        });
        if (!resposta.ok) {
            const erroData = await resposta.json().catch(() => null);
            throw new Error(erroData?.erro || erroData?.error || erroData?.mensagem || `Erro na requisição: Status ${resposta.status}`);
        }
        const dados = await resposta.json();
        return dados.mensagem ?? 'Categoria cadastrada com sucesso.';
    }
    catch (erro) {
        console.error('Falha ao criar categoria:', erro);
        throw erro;
    }
}
export async function atualizarCategoria(categoria) {
    try {
        const resposta = await fetch('api/categoria.php', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(categoria)
        });
        if (!resposta.ok) {
            const erroData = await resposta.json().catch(() => null);
            throw new Error(erroData?.erro || erroData?.error || erroData?.mensagem || `Erro na requisição: Status ${resposta.status}`);
        }
        const dados = await resposta.json();
        return dados.mensagem ?? 'Categoria atualizada com sucesso.';
    }
    catch (erro) {
        console.error('Falha ao atualizar categoria:', erro);
        throw erro;
    }
}
export async function excluirCategoria(id) {
    try {
        const resposta = await fetch('api/categoria.php', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        });
        if (!resposta.ok) {
            const erroData = await resposta.json().catch(() => null);
            throw new Error(erroData?.erro || erroData?.error || erroData?.mensagem || `Erro na requisição: Status ${resposta.status}`);
        }
        const dados = await resposta.json();
        return dados.mensagem ?? 'Categoria excluída com sucesso.';
    }
    catch (erro) {
        console.error('Falha ao excluir categoria:', erro);
        throw erro;
    }
}
