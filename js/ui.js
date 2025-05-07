/**
 * Módulo para interface do usuário
 * Contém funções para renderizar e atualizar a interface
 */

import { DOM, mostrarToast } from './dom.js';
import { EstoqueModel } from './models.js';
import { formatarData, formatarDataHora, obterStatusEstoque, formatarCategoria } from './utils.js';

// Carregar componentes HTML
export async function carregarComponentesHTML() {
    try {
        // Carregar sidebar - Caminho corrigido de html para htlml
        const sidebarResponse = await fetch('../htlml/components/sidebar.html');
        const sidebarHTML = await sidebarResponse.text();
        document.getElementById('sidebar-container').innerHTML = sidebarHTML;
        
        // Carregar dashboard - Caminho corrigido
        const dashboardResponse = await fetch('../htlml/components/dashboard.html');
        const dashboardHTML = await dashboardResponse.text();
        document.getElementById('dashboard-container').innerHTML = dashboardHTML;
        
        // Carregar modal de item - Caminho corrigido
        const modalItemResponse = await fetch('../htlml/components/modal-item.html');
        const modalItemHTML = await modalItemResponse.text();
        document.getElementById('modal-item-container').innerHTML = modalItemHTML;
        
        // Carregar modal de exclusão - Caminho corrigido
        const modalDeleteResponse = await fetch('../htlml/components/model-delete.html');
        const modalDeleteHTML = await modalDeleteResponse.text();
        document.getElementById('modal-delete-container').innerHTML = modalDeleteHTML;
    } catch (error) {
        console.error('Erro ao carregar componentes HTML:', error);
    }
}

// Renderizar a tabela de estoque com filtros aplicados
export function renderizarTabelaEstoque() {
    // Limpar a tabela
    DOM.corpoTabelaEstoque.innerHTML = '';
    
    // Obter valores dos filtros
    const termoBusca = DOM.campoBusca.value.toLowerCase();
    const valorCategoria = DOM.filtroCategoria.value;
    const valorEstoque = DOM.filtroEstoque.value;
    
    // Filtrar os dados - otimizado para melhor performance
    const dadosFiltrados = EstoqueModel.filtrarDados(termoBusca, valorCategoria, valorEstoque);
    
    // Criar fragmento de documento para melhor performance
    const fragmento = document.createDocumentFragment();
    
    // Renderizar os dados filtrados
    dadosFiltrados.forEach(item => {
        const linha = document.createElement('tr');
        
        // Determinar status do estoque
        const { statusEstoque, textoStatus } = obterStatusEstoque(item);
        
        // Calcular valor total
        const valorTotal = (item.quantidade * item.preco).toFixed(2);
        
        // Formatar nome da categoria para exibição
        const categoriaExibicao = formatarCategoria(item.categoria);
        
        linha.innerHTML = `
            <td>${item.id}</td>
            <td>${item.nome}</td>
            <td>${categoriaExibicao}</td>
            <td>${item.quantidade}</td>
            <td>${item.unidade}</td>
            <td>R$${item.preco.toFixed(2)}</td>
            <td>R$${valorTotal}</td>
            <td>${formatarData(item.ultimaAtualizacao)}</td>
            <td><span class="status status-${statusEstoque}">${textoStatus}</span></td>
            <td class="action-buttons">
                <button class="action-btn edit-btn" data-id="${item.id}"><i class="fas fa-edit"></i></button>
                <button class="action-btn delete-btn" data-id="${item.id}"><i class="fas fa-trash"></i></button>
            </td>
        `;
        
        fragmento.appendChild(linha);
    });
    
    // Adicionar fragmento à tabela (operação DOM única)
    DOM.corpoTabelaEstoque.appendChild(fragmento);
    
    // Atualizar a hora da última atualização
    DOM.ultimaAtualizacao.textContent = formatarDataHora(new Date());
}

// Atualizar as estatísticas do dashboard
export function atualizarEstatisticas() {
    const estatisticas = EstoqueModel.obterEstatisticas();
    
    // Atualizar elementos do DOM
    DOM.totalItens.textContent = estatisticas.totalItens;
    DOM.estoqueBaixo.textContent = estatisticas.estoqueBaixo;
    DOM.categorias.textContent = estatisticas.categorias;
    DOM.valorTotal.textContent = `R$${estatisticas.valorTotal.toFixed(2)}`;
}

// Abrir o modal para adicionar item
export function abrirModalAdicionarItem() {
    // Resetar o formulário
    DOM.formItem.reset();
    DOM.itemId.value = '';
    DOM.tituloModal.textContent = 'Adicionar Novo Item';
    
    // Mostrar o modal
    DOM.modalItem.style.display = 'flex';
}

// Abrir o modal para editar item
export function abrirModalEditarItem(itemId) {
    // Encontrar o item
    const item = EstoqueModel.buscarItemPorId(itemId);
    if (!item) return;
    
    // Preencher o formulário com os dados do item
    DOM.itemId.value = item.id;
    DOM.nomeItem.value = item.nome;
    DOM.categoriaItem.value = item.categoria;
    DOM.quantidadeItem.value = item.quantidade;
    DOM.unidadeItem.value = item.unidade;
    DOM.precoItem.value = item.preco;
    DOM.estoqueMinItem.value = item.estoqueMin;
    DOM.observacoesItem.value = item.observacoes || '';
    
    // Atualizar título do modal
    DOM.tituloModal.textContent = 'Editar Item';
    
    // Mostrar o modal
    DOM.modalItem.style.display = 'flex';
}

// Carregar modal de exclusão
const modalDeleteResponse = await fetch('../htlml/components/model-delete.html');
// Abrir o modal de confirmação de exclusão
export function abrirModalExcluir(itemId) {
    // Encontrar o item
    const item = EstoqueModel.buscarItemPorId(itemId);
    if (!item) return;
    
    // Definir o nome do item na mensagem de confirmação
    DOM.nomeItemExcluir.textContent = item.nome;
    
    // Armazenar o ID do item para exclusão
    DOM.botaoConfirmarExclusao.setAttribute('data-id', itemId);
    
    // Mostrar o modal
    DOM.modalExcluir.style.display = 'flex';
}