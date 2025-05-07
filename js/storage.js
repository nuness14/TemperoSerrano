/**
 * Módulo para gerenciamento de armazenamento
 * Contém funções para salvar e carregar dados do localStorage
 */

import { EstoqueModel } from './models.js';

// Carregar dados do localStorage
export function carregarDadosLocais() {
    const dadosSalvos = localStorage.getItem('dadosEstoque');
    if (dadosSalvos) {
        try {
            EstoqueModel.dadosEstoque = JSON.parse(dadosSalvos);
        } catch (e) {
            console.error('Erro ao carregar dados do localStorage:', e);
            EstoqueModel.dadosEstoque = [];
        }
    }
}

// Salvar dados no localStorage
export function salvarNoLocalStorage() {
    localStorage.setItem('dadosEstoque', JSON.stringify(EstoqueModel.dadosEstoque));
}