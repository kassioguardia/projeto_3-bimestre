export type Categoria = {
    id: number;
    nome: string;
};

export type Subcategoria = {
    id: number;
    nome: string;
    id_categoria: number;
};

export type Cliente = {
    id: number;
    nome: string;
    email: string;
    telefone: string | null;
    data_cadastro?: string;
    endereco: string | null;
};

export type Peca3d = {
    id: number;
    tamanho: number | null;
    modelo: string;
    descricao: string | null;
    tempoImpressao: string | null;
    peso: number | null;
    preco: number | null;
    quantidade: number;
    id_subcategoria: number;
};

export type PecaCliente = {
    id: number;
    id_peca3d: number;
    id_cliente: number;
    data_solicitacao?: string;
    observacao: string | null;
    status: string | null;
};

export type RelatorioVendasCliente = {
    id_cliente: number;
    cliente: string;
    quantidade: number;
    valor_unitario: number;
};