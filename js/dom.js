/**
 * Módulo para manipulação do DOM
 * Contém funções para acessar e manipular elementos do DOM
 */

// Cache de elementos DOM frequentemente acessados
export const DOM = {};

// Inicializar cache de elementos DOM para melhor performance
export function inicializarCacheDOM() {
    DOM.corpoTabelaEstoque = document.getElementById('corpoTabelaEstoque');
    DOM.botaoAdicionarItem = document.getElementById('botaoAdicionarItem');
    DOM.modalItem = document.getElementById('modalItem');
    DOM.modalExcluir = document.getElementById('modalExcluir');
    DOM.botoesFecharModal = document.querySelectorAll('.close-modal');
    DOM.formItem = document.getElementById('formItem');
    DOM.botaoCancelarItem = document.getElementById('botaoCancelarItem');
    DOM.campoBusca = document.getElementById('campoBusca');
    DOM.botaoBusca = document.getElementById('botaoBusca');
    DOM.filtroCategoria = document.getElementById('filtroCategoria');
    DOM.filtroEstoque = document.getElementById('filtroEstoque');
    DOM.botaoLimparFiltros = document.getElementById('botaoLimparFiltros');
    DOM.botaoAtualizar = document.getElementById('botaoAtualizar');
    DOM.botaoConfirmarExclusao = document.getElementById('botaoConfirmarExclusao');
    DOM.botaoCancelarExclusao = document.getElementById('botaoCancelarExclusao');
    DOM.nomeItemExcluir = document.getElementById('nomeItemExcluir');
    DOM.toast = document.getElementById('toast');
    DOM.mensagemToast = document.getElementById('mensagemToast');
    DOM.ultimaAtualizacao = document.getElementById('ultimaAtualizacao');
    
    // Elementos de estatísticas
    DOM.totalItens = document.getElementById('totalItens');
    DOM.estoqueBaixo = document.getElementById('estoqueBaixo');
    DOM.categorias = document.getElementById('categorias');
    DOM.valorTotal = document.getElementById('valorTotal');
    
    // Elementos do formulário
    DOM.itemId = document.getElementById('itemId');
    DOM.nomeItem = document.getElementById('nomeItem');
    DOM.categoriaItem = document.getElementById('categoriaItem');
    DOM.quantidadeItem = document.getElementById('quantidadeItem');
    DOM.unidadeItem = document.getElementById('unidadeItem');
    DOM.precoItem = document.getElementById('precoItem');
    DOM.estoqueMinItem = document.getElementById('estoqueMinItem');
    DOM.observacoesItem = document.getElementById('observacoesItem');
    DOM.tituloModal = document.getElementById('tituloModal');
}

// Mostrar uma notificação toast
export function mostrarToast(mensagem) {
    DOM.mensagemToast.textContent = mensagem;
    DOM.toast.style.display = 'block';
    
    // Esconder o toast após 3 segundos
    setTimeout(() => {
        DOM.toast.style.display = 'none';
    }, 3000);
}