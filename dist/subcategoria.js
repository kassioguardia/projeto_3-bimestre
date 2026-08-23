export async function listarSubcategorias() {
    try {
        const resposta = await fetch('subcategoria.php');
        if (!resposta.ok)
            throw new Error(`Erro na requisição: Status ${resposta.status}`);
        return await resposta.json();
    }
    catch (erro) {
        console.error('Falha ao listar subcategorias:', erro);
        throw erro;
    }
}
export async function criarSubcategoria(subcategoria) {
    try {
        const resposta = await fetch('subcategoria.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(subcategoria)
        });
        if (!resposta.ok)
            throw new Error(`Erro na requisição: Status ${resposta.status}`);
    }
    catch (erro) {
        console.error('Falha ao criar subcategoria:', erro);
        throw erro;
    }
}
export async function atualizarSubcategoria(subcategoria) {
    try {
        const resposta = await fetch('subcategoria.php', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(subcategoria)
        });
        if (!resposta.ok)
            throw new Error(`Erro na requisição: Status ${resposta.status}`);
    }
    catch (erro) {
        console.error('Falha ao atualizar subcategoria:', erro);
        throw erro;
    }
}
export async function excluirSubcategoria(id) {
    try {
        const resposta = await fetch('subcategoria.php', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        });
        if (!resposta.ok)
            throw new Error(`Erro na requisição: Status ${resposta.status}`);
    }
    catch (erro) {
        console.error('Falha ao excluir subcategoria:', erro);
        throw erro;
    }
}
