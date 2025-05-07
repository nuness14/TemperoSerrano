/**
 * Módulo para gerenciamento de eventos
 * Contém funções para configurar e gerenciar eventos da interface
 */

import { DOM, mostrarToast } from './dom.js';
import { EstoqueModel, Item } from './models.js';
import { salvarNoLocalStorage } from './storage.js';
import { 
    renderizarTabelaEstoque, 
    atualizarEstatisticas, 
    abrirModalAdicionarItem, 
    abrirModalEditarItem, 
    abrirModalExcluir 
} from './ui.js';
import { formatarDataParaArmazenamento } from './utils.js';

// Temporizador para debounce da busca
let temporizadorBusca = null;

// Configurar todos os event listeners
export function configurarEventListeners() {
    // Botão adicionar item
    DOM.botaoAdicionarItem.addEventListener('click', abrirModalAdicionarItem);
    
    // Botões fechar modal
    DOM.botoesFecharModal.forEach(btn => {
        btn.addEventListener('click', () => {
            DOM.modalItem.style.display = 'none';
            DOM.modalExcluir.style.display = 'none';
        });
    });
    
    // Botão cancelar item
    DOM.botaoCancelarItem.addEventListener('click', () => {
        DOM.modalItem.style.display = 'none';
    });
    
    // Submissão do formulário de item
    DOM.formItem.addEventListener('submit', (e) => {
        e.preventDefault();
        salvarItem();
    });
    
    // Funcionalidade de busca com debounce para melhor performance
    DOM.campoBusca.addEventListener('input', () => {
        // Limpar temporizador anterior
        if (temporizadorBusca) {
            clearTimeout(temporizadorBusca);
        }
        
        // Configurar novo temporizador (300ms de atraso)
        temporizadorBusca = setTimeout(() => {
            renderizarTabelaEstoque();
        }, 300);
    });
    
    DOM.botaoBusca.addEventListener('click', () => {
        renderizarTabelaEstoque();
    });
    
    // Filtros
    DOM.filtroCategoria.addEventListener('change', renderizarTabelaEstoque);
    DOM.filtroEstoque.addEventListener('change', renderizarTabelaEstoque);
    
    // Limpar filtros
    DOM.botaoLimparFiltros.addEventListener('click', () => {
        DOM.filtroCategoria.value = 'all';
        DOM.filtroEstoque.value = 'all';
        DOM.campoBusca.value = '';
        renderizarTabelaEstoque();
    });
    
    // Botão atualizar
    DOM.botaoAtualizar.addEventListener('click', () => {
        renderizarTabelaEstoque();
        atualizarEstatisticas();
        mostrarToast('Dados atualizados com sucesso');
    });
    
    // Confirmação de exclusão
    DOM.botaoConfirmarExclusao.addEventListener('click', confirmarExclusao);
    DOM.botaoCancelarExclusao.addEventListener('click', () => {
        DOM.modalExcluir.style.display = 'none';
    });
    
    // Fechar modais ao clicar fora
    window.addEventListener('click', (e) => {
        if (e.target === DOM.modalItem) {
            DOM.modalItem.style.display = 'none';
        }
        if (e.target === DOM.modalExcluir) {
            DOM.modalExcluir.style.display = 'none';
        }
    });
    
    // Adicionar event listeners aos botões de editar e excluir
    adicionarEventListenersBotoes();
}

// Adicionar event listeners aos botões de ação
export function adicionarEventListenersBotoes() {
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const itemId = parseInt(btn.getAttribute('data-id'));
            abrirModalEditarItem(itemId);
        });
    });
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const itemId = parseInt(btn.getAttribute('data-id'));
            abrirModalExcluir(itemId);
        });
    });
}

// Salvar um item (adicionar ou editar)
function salvarItem() {
    // Obter valores do formulário
    const itemId = DOM.itemId.value;
    const nome = DOM.nomeItem.value;
    const categoria = DOM.categoriaItem.value;
    const quantidade = parseFloat(DOM.quantidadeItem.value);
    const unidade = DOM.unidadeItem.value;
    const preco = parseFloat(DOM.precoItem.value);
    const estoqueMin = parseFloat(DOM.estoqueMinItem.value);
    const observacoes = DOM.observacoesItem.value;
    
    // Criar objeto do item
    const item = {
        nome,
        categoria,
        quantidade,
        unidade,
        preco,
        estoqueMin,
        observacoes,
        ultimaAtualizacao: formatarDataParaArmazenamento(new Date())
    };
    
    // Adicionar ou atualizar o item
    if (itemId) {
        // Atualizar item existente
        item.id = parseInt(itemId);
        if (EstoqueModel.atualizarItem(item)) {
            mostrarToast('Item atualizado com sucesso');
        }
    } else {
        // Adicionar novo item
        EstoqueModel.adicionarItem(item);
        mostrarToast('Item adicionado com sucesso');
    }
    
    // Salvar no localStorage
    salvarNoLocalStorage();
    
    // Fechar o modal
    DOM.modalItem.style.display = 'none';
    
    // Atualizar a tabela e estatísticas
    renderizarTabelaEstoque();
    atualizarEstatisticas();
}

// Confirmar exclusão de um item
function confirmarExclusao() {
    const itemId = parseInt(DOM.botaoConfirmarExclusao.getAttribute('data-id'));
    
    // Remover o item do array
    EstoqueModel.removerItem(itemId);
    
    // Salvar no localStorage
    salvarNoLocalStorage();
    
    // Fechar o modal
    DOM.modalExcluir.style.display = 'none';
    
    // Atualizar a tabela e estatísticas
    renderizarTabelaEstoque();
    atualizarEstatisticas();
    
    mostrarToast('Item excluído com sucesso');
}