/**
 * Módulo para definição de modelos de dados
 * Contém estruturas de dados e funções relacionadas
 */

// Modelo de dados do estoque
export const EstoqueModel = {
    // Array para armazenar os dados do estoque
    dadosEstoque: [],
    
    // Adicionar um novo item ao estoque
    adicionarItem(item) {
        item.id = this.gerarIdItem();
        this.dadosEstoque.push(item);
        return item;
    },
    
    // Atualizar um item existente
    atualizarItem(item) {
        const index = this.dadosEstoque.findIndex(i => i.id === item.id);
        if (index !== -1) {
            this.dadosEstoque[index] = item;
            return true;
        }
        return false;
    },
    
    // Remover um item do estoque
    removerItem(id) {
        this.dadosEstoque = this.dadosEstoque.filter(item => item.id !== id);
    },
    
    // Buscar um item pelo ID
    buscarItemPorId(id) {
        return this.dadosEstoque.find(item => item.id === id);
    },
    
    // Gerar um novo ID para um item
    gerarIdItem() {
        if (this.dadosEstoque.length === 0) return 1;
        const maxId = Math.max(...this.dadosEstoque.map(item => item.id));
        return maxId + 1;
    },
    
    // Filtrar dados com base em critérios
    filtrarDados(termoBusca, valorCategoria, valorEstoque) {
        return this.dadosEstoque.filter(item => {
            // Filtro de busca
            const correspondeTermoBusca = item.nome.toLowerCase().includes(termoBusca) || 
                             item.categoria.toLowerCase().includes(termoBusca) ||
                             (item.observacoes && item.observacoes.toLowerCase().includes(termoBusca));
            
            // Filtro de categoria
            const correspondeCategoria = valorCategoria === 'all' || item.categoria === valorCategoria;
            
            // Filtro de estoque
            let correspondeEstoque = true;
            if (valorEstoque === 'baixo') {
                correspondeEstoque = item.quantidade <= item.estoqueMin;
            } else if (valorEstoque === 'normal') {
                correspondeEstoque = item.quantidade > item.estoqueMin && item.quantidade <= item.estoqueMin * 2;
            } else if (valorEstoque === 'alto') {
                correspondeEstoque = item.quantidade > item.estoqueMin * 2;
            }
            
            return correspondeTermoBusca && correspondeCategoria && correspondeEstoque;
        });
    },
    
    // Obter estatísticas do estoque
    obterEstatisticas() {
        const totalItens = this.dadosEstoque.length;
        const estoqueBaixo = this.dadosEstoque.filter(item => item.quantidade <= item.estoqueMin).length;
        const categoriasUnicas = new Set(this.dadosEstoque.map(item => item.categoria));
        const valorTotal = this.dadosEstoque.reduce((soma, item) => soma + (item.quantidade * item.preco), 0);
        
        return {
            totalItens,
            estoqueBaixo,
            categorias: categoriasUnicas.size,
            valorTotal
        };
    }
};

// Classe para representar um item do estoque
export class Item {
    constructor(nome, categoria, quantidade, unidade, preco, estoqueMin, observacoes) {
        this.nome = nome;
        this.categoria = categoria;
        this.quantidade = quantidade;
        this.unidade = unidade;
        this.preco = preco;
        this.estoqueMin = estoqueMin;
        this.observacoes = observacoes;
        this.ultimaAtualizacao = new Date().toISOString().split('T')[0];
    }
}