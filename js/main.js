/**
 * Sistema de Controle de Estoque para Restaurante
 * Versão Green Code - Otimizada para eficiência
 * Arquivo principal que inicializa a aplicação
 */

// Importar módulos
import { inicializarCacheDOM } from './dom.js';
import { carregarDadosLocais } from './storage.js';
import { renderizarTabelaEstoque, atualizarEstatisticas, carregarComponentesHTML } from './ui.js';
import { configurarEventListeners } from './events.js';

// Inicializar a aplicação
document.addEventListener('DOMContentLoaded', async () => {
    // Carregar componentes HTML
    await carregarComponentesHTML();
    
    // Inicializar cache de elementos DOM
    inicializarCacheDOM();
    
    // Carregar dados do localStorage se disponíveis
    carregarDadosLocais();
    
    // Renderizar a tabela e atualizar estatísticas
    renderizarTabelaEstoque();
    atualizarEstatisticas();
    
    // Configurar event listeners
    configurarEventListeners();
});