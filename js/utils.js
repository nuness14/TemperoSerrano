/**
 * Módulo de utilidades
 * Contém funções auxiliares usadas em todo o sistema
 */

// Obter status do estoque
export function obterStatusEstoque(item) {
    let statusEstoque = 'normal';
    let textoStatus = 'Normal';
    
    if (item.quantidade <= item.estoqueMin) {
        statusEstoque = 'baixo';
        textoStatus = 'Estoque Baixo';
    } else if (item.quantidade > item.estoqueMin * 2) {
        statusEstoque = 'alto';
        textoStatus = 'Estoque Alto';
    }
    
    return { statusEstoque, textoStatus };
}

// Formatar categoria para exibição
export function formatarCategoria(categoria) {
    return categoria.split('-').map(palavra => 
        palavra.charAt(0).toUpperCase() + palavra.slice(1)
    ).join(' ');
}

// Função auxiliar para formatar uma data para exibição
export function formatarData(dataString) {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR');
}

// Função auxiliar para formatar uma data e hora para exibição
export function formatarDataHora(data) {
    return data.toLocaleDateString('pt-BR') + ', ' + data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

// Função auxiliar para formatar uma data para armazenamento
export function formatarDataParaArmazenamento(data) {
    return data.toISOString().split('T')[0];
}