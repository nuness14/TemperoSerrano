/**
 * Sistema de Controle de Estoque para Restaurante
 */

// Arrays para armazenar dados
let dadosEstoque = []
let dadosFornecedores = []

// Inicializar a aplicação
document.addEventListener("DOMContentLoaded", () => {
  // Carregar dados do localStorage
  carregarDadosLocais()

  // Configurar navegação
  configurarNavegacao()

  // Configurar formulários
  configurarFormularios()

  // Renderizar dados iniciais
  renderizarTabelaEstoque()
  atualizarEstatisticas()
})

// Carregar dados do localStorage
function carregarDadosLocais() {
  const estoqueLocal = localStorage.getItem("dadosEstoque")
  if (estoqueLocal) {
    dadosEstoque = JSON.parse(estoqueLocal)
  }

  const fornecedoresLocal = localStorage.getItem("dadosFornecedores")
  if (fornecedoresLocal) {
    dadosFornecedores = JSON.parse(fornecedoresLocal)
  }
}

// Salvar dados no localStorage
function salvarDadosLocais() {
  localStorage.setItem("dadosEstoque", JSON.stringify(dadosEstoque))
  localStorage.setItem("dadosFornecedores", JSON.stringify(dadosFornecedores))
}

// Configurar navegação
function configurarNavegacao() {
  // Navegação principal
  document.getElementById("menu-estoque").addEventListener("click", (e) => {
    e.preventDefault()
    mostrarSecao("estoque")
  })

  document.getElementById("menu-relatorios").addEventListener("click", (e) => {
    e.preventDefault()
    mostrarSecao("relatorios")
    atualizarRelatorios()
  })

  document.getElementById("menu-fornecedores").addEventListener("click", (e) => {
    e.preventDefault()
    mostrarSecao("fornecedores")
    renderizarFornecedores()
  })

  // Botão atualizar
  document.getElementById("botaoAtualizar").addEventListener("click", () => {
    const secaoAtiva = document.querySelector('.dashboard:not([style*="display: none"])').id

    if (secaoAtiva === "secao-estoque") {
      renderizarTabelaEstoque()
      atualizarEstatisticas()
    } else if (secaoAtiva === "secao-relatorios") {
      atualizarRelatorios()
    } else if (secaoAtiva === "secao-fornecedores") {
      renderizarFornecedores()
    }

    mostrarToast("Dados atualizados com sucesso")
  })

  // Visualização de fornecedores
  document.getElementById("botaoVisualizacaoGrid").addEventListener("click", () => {
    document.getElementById("containerFornecedores").className = "supplier-grid"
    document.getElementById("botaoVisualizacaoGrid").classList.add("active")
    document.getElementById("botaoVisualizacaoLista").classList.remove("active")
  })

  document.getElementById("botaoVisualizacaoLista").addEventListener("click", () => {
    document.getElementById("containerFornecedores").className = "supplier-list-view"
    document.getElementById("botaoVisualizacaoGrid").classList.remove("active")
    document.getElementById("botaoVisualizacaoLista").classList.add("active")
  })
}

// Configurar formulários e modais
function configurarFormularios() {
  // Botões para abrir modais
  document.getElementById("botaoAdicionarItem").addEventListener("click", () => {
    document.getElementById("formItem").reset()
    document.getElementById("itemId").value = ""
    document.getElementById("tituloModal").textContent = "Adicionar Novo Item"
    document.getElementById("modalItem").style.display = "flex"
  })

  document.getElementById("botaoAdicionarFornecedor").addEventListener("click", () => {
    document.getElementById("formFornecedor").reset()
    document.getElementById("fornecedorId").value = ""
    document.getElementById("tituloModalFornecedor").textContent = "Adicionar Novo Fornecedor"
    document.getElementById("modalFornecedor").style.display = "flex"
  })

  // Botões para fechar modais
  document.querySelectorAll(".close-modal").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.getElementById("modalItem").style.display = "none"
      document.getElementById("modalFornecedor").style.display = "none"
      document.getElementById("modalExcluir").style.display = "none"
    })
  })

  // Botões cancelar
  document.getElementById("botaoCancelarItem").addEventListener("click", () => {
    document.getElementById("modalItem").style.display = "none"
  })

  document.getElementById("botaoCancelarFornecedor").addEventListener("click", () => {
    document.getElementById("modalFornecedor").style.display = "none"
  })

  document.getElementById("botaoCancelarExclusao").addEventListener("click", () => {
    document.getElementById("modalExcluir").style.display = "none"
  })

  // Submissão de formulários
  document.getElementById("formItem").addEventListener("submit", (e) => {
    e.preventDefault()
    salvarItem()
  })

  document.getElementById("formFornecedor").addEventListener("submit", (e) => {
    e.preventDefault()
    salvarFornecedor()
  })

  // Confirmação de exclusão
  document.getElementById("botaoConfirmarExclusao").addEventListener("click", confirmarExclusao)

  // Filtros de estoque
  document.getElementById("filtroCategoria").addEventListener("change", renderizarTabelaEstoque)
  document.getElementById("filtroEstoque").addEventListener("change", renderizarTabelaEstoque)
  document.getElementById("botaoBusca").addEventListener("click", renderizarTabelaEstoque)
  document.getElementById("campoBusca").addEventListener("keyup", (e) => {
    if (e.key === "Enter") renderizarTabelaEstoque()
  })

  document.getElementById("botaoLimparFiltros").addEventListener("click", () => {
    document.getElementById("filtroCategoria").value = "all"
    document.getElementById("filtroEstoque").value = "all"
    document.getElementById("campoBusca").value = ""
    renderizarTabelaEstoque()
  })

  // Filtros de relatórios
  document.getElementById("filtroRelatorio").addEventListener("change", atualizarRelatorios)

  // Exportação
  document.getElementById("botaoGerarCSV").addEventListener("click", exportarCSV)
  document.getElementById("botaoGerarPDF").addEventListener("click", () => {
    mostrarToast("Exportação para PDF iniciada")
  })

  // Filtros de fornecedores
  document.getElementById("filtroCategoriaProduto").addEventListener("change", renderizarFornecedores)
  document.getElementById("filtroAvaliacao").addEventListener("change", renderizarFornecedores)
  document.getElementById("botaoBuscaFornecedor").addEventListener("click", renderizarFornecedores)
  document.getElementById("campoBuscaFornecedor").addEventListener("keyup", (e) => {
    if (e.key === "Enter") renderizarFornecedores()
  })
}

// Mostrar seção específica
function mostrarSecao(secao) {
  // Atualizar menu
  document.querySelectorAll(".sidebar-menu li").forEach((item) => {
    item.classList.remove("active")
  })

  // Esconder todas as seções
  document.getElementById("secao-estoque").style.display = "none"
  document.getElementById("secao-relatorios").style.display = "none"
  document.getElementById("secao-fornecedores").style.display = "none"

  // Mostrar a seção selecionada
  if (secao === "estoque") {
    document.getElementById("secao-estoque").style.display = "block"
    document.getElementById("menu-estoque").parentElement.classList.add("active")
  } else if (secao === "relatorios") {
    document.getElementById("secao-relatorios").style.display = "block"
    document.getElementById("menu-relatorios").parentElement.classList.add("active")
  } else if (secao === "fornecedores") {
    document.getElementById("secao-fornecedores").style.display = "block"
    document.getElementById("menu-fornecedores").parentElement.classList.add("active")
  }
}

// Renderizar a tabela de estoque
function renderizarTabelaEstoque() {
  const corpoTabelaEstoque = document.getElementById("corpoTabelaEstoque")
  corpoTabelaEstoque.innerHTML = ""

  // Obter valores dos filtros
  const termoBusca = document.getElementById("campoBusca").value.toLowerCase()
  const valorCategoria = document.getElementById("filtroCategoria").value
  const valorEstoque = document.getElementById("filtroEstoque").value

  // Filtrar os dados
  const dadosFiltrados = dadosEstoque.filter((item) => {
    // Filtro de busca
    const correspondeTermoBusca =
      item.nome.toLowerCase().includes(termoBusca) ||
      item.categoria.toLowerCase().includes(termoBusca) ||
      (item.observacoes && item.observacoes.toLowerCase().includes(termoBusca))

    // Filtro de categoria
    const correspondeCategoria = valorCategoria === "all" || item.categoria === valorCategoria

    // Filtro de estoque
    let correspondeEstoque = true
    if (valorEstoque === "baixo") {
      correspondeEstoque = item.quantidade <= item.estoqueMin
    } else if (valorEstoque === "normal") {
      correspondeEstoque = item.quantidade > item.estoqueMin && item.quantidade <= item.estoqueMin * 2
    } else if (valorEstoque === "alto") {
      correspondeEstoque = item.quantidade > item.estoqueMin * 2
    }

    return correspondeTermoBusca && correspondeCategoria && correspondeEstoque
  })

  // Renderizar os dados filtrados
  dadosFiltrados.forEach((item) => {
    const linha = document.createElement("tr")

    // Determinar status do estoque
    let statusEstoque = "normal"
    let textoStatus = "Normal"

    if (item.quantidade <= item.estoqueMin) {
      statusEstoque = "baixo"
      textoStatus = "Estoque Baixo"
    } else if (item.quantidade > item.estoqueMin * 2) {
      statusEstoque = "alto"
      textoStatus = "Estoque Alto"
    }

    // Calcular valor total
    const valorTotal = (item.quantidade * item.preco).toFixed(2)

    // Formatar nome da categoria para exibição
    const categoriaExibicao = item.categoria
      .split("-")
      .map((palavra) => palavra.charAt(0).toUpperCase() + palavra.slice(1))
      .join(" ")

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
        `

    corpoTabelaEstoque.appendChild(linha)
  })

  // Adicionar event listeners aos botões de editar e excluir
  document.querySelectorAll(".edit-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const itemId = Number.parseInt(btn.getAttribute("data-id"))
      abrirModalEditarItem(itemId)
    })
  })

  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const itemId = Number.parseInt(btn.getAttribute("data-id"))
      abrirModalExcluir(itemId, "estoque")
    })
  })

  // Atualizar a hora da última atualização
  document.getElementById("ultimaAtualizacao").textContent = formatarDataHora(new Date())
}

// Renderizar fornecedores
function renderizarFornecedores() {
  const containerFornecedores = document.getElementById("containerFornecedores")
  containerFornecedores.innerHTML = ""

  // Obter valores dos filtros
  const termoBusca = document.getElementById("campoBuscaFornecedor").value.toLowerCase()
  const valorCategoria = document.getElementById("filtroCategoriaProduto").value
  const valorAvaliacao = document.getElementById("filtroAvaliacao").value

  // Filtrar os dados
  const dadosFiltrados = dadosFornecedores.filter((fornecedor) => {
    // Filtro de busca
    const correspondeTermoBusca =
      fornecedor.nome.toLowerCase().includes(termoBusca) ||
      (fornecedor.email && fornecedor.email.toLowerCase().includes(termoBusca)) ||
      (fornecedor.cidade && fornecedor.cidade.toLowerCase().includes(termoBusca)) ||
      (fornecedor.observacoes && fornecedor.observacoes.toLowerCase().includes(termoBusca))

    // Filtro de categoria
    const correspondeCategoria =
      valorCategoria === "all" || (fornecedor.categorias && fornecedor.categorias.includes(valorCategoria))

    // Filtro de avaliação
    const correspondeAvaliacao =
      valorAvaliacao === "all" || (fornecedor.avaliacao && fornecedor.avaliacao >= Number.parseInt(valorAvaliacao))

    return correspondeTermoBusca && correspondeCategoria && correspondeAvaliacao
  })

  // Verificar se há fornecedores
  if (dadosFiltrados.length === 0) {
    containerFornecedores.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-users fa-3x" style="color: var(--primary-light); margin-bottom: 15px;"></i>
                <h3>Nenhum fornecedor encontrado</h3>
                <p>Adicione um novo fornecedor ou ajuste os filtros de busca.</p>
            </div>
        `
    return
  }

  // Renderizar os dados filtrados
  dadosFiltrados.forEach((fornecedor) => {
    const card = document.createElement("div")
    card.className = "supplier-card"

    // Formatar categorias para exibição
    const categoriasHTML = fornecedor.categorias
      ? fornecedor.categorias
          .map((cat) => {
            const categoriaExibicao = cat
              .split("-")
              .map((palavra) => palavra.charAt(0).toUpperCase() + palavra.slice(1))
              .join(" ")

            return `<span class="supplier-product-tag">${categoriaExibicao}</span>`
          })
          .join("")
      : ""

    card.innerHTML = `
            <div class="supplier-header">
                <h3 class="supplier-name">${fornecedor.nome}</h3>
                <div class="supplier-actions">
                    <button class="action-btn edit-btn" data-id="${fornecedor.id}"><i class="fas fa-edit"></i></button>
                    <button class="action-btn delete-btn" data-id="${fornecedor.id}"><i class="fas fa-trash"></i></button>
                </div>
            </div>
            <div class="supplier-info">
                <div class="supplier-info-item">
                    <span class="supplier-info-label">Email</span>
                    <span class="supplier-info-value">${fornecedor.email || "Não informado"}</span>
                </div>
                <div class="supplier-info-item">
                    <span class="supplier-info-label">Telefone</span>
                    <span class="supplier-info-value">${fornecedor.telefone || "Não informado"}</span>
                </div>
                <div class="supplier-info-item">
                    <span class="supplier-info-label">Cidade/Estado</span>
                    <span class="supplier-info-value">${fornecedor.cidade || "Não informado"}/${fornecedor.estado || "Não informado"}</span>
                </div>
            </div>
            <div class="supplier-products">
                <h4 class="supplier-products-title">Categorias de Produtos</h4>
                <div class="supplier-products-list">
                    ${categoriasHTML || '<span class="supplier-product-tag">Nenhuma categoria</span>'}
                </div>
            </div>
        `

    containerFornecedores.appendChild(card)
  })

  // Adicionar event listeners aos botões de editar e excluir
  document.querySelectorAll(".supplier-card .edit-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const fornecedorId = Number.parseInt(btn.getAttribute("data-id"))
      abrirModalEditarFornecedor(fornecedorId)
    })
  })

  document.querySelectorAll(".supplier-card .delete-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const fornecedorId = Number.parseInt(btn.getAttribute("data-id"))
      abrirModalExcluir(fornecedorId, "fornecedor")
    })
  })
}

// Atualizar as estatísticas do dashboard
function atualizarEstatisticas() {
  // Contagem total de itens
  document.getElementById("totalItens").textContent = dadosEstoque.length

  // Contagem de estoque baixo
  const contagemEstoqueBaixo = dadosEstoque.filter((item) => item.quantidade <= item.estoqueMin).length
  document.getElementById("estoqueBaixo").textContent = contagemEstoqueBaixo

  // Contagem de categorias
  const categoriasUnicas = new Set(dadosEstoque.map((item) => item.categoria))
  document.getElementById("categorias").textContent = categoriasUnicas.size

  // Valor total do estoque
  const valorTotal = dadosEstoque.reduce((soma, item) => soma + item.quantidade * item.preco, 0)
  document.getElementById("valorTotal").textContent = `R$${valorTotal.toFixed(2)}`
}

// Atualizar relatórios
function atualizarRelatorios() {
  // Atualizar tabela de estoque baixo
  atualizarTabelaEstoqueBaixo()

  // Atualizar tabela de valor por categoria
  atualizarTabelaValorCategoria()

  // Atualizar resumo geral
  atualizarResumoGeral()
}

// Atualizar tabela de estoque baixo
function atualizarTabelaEstoqueBaixo() {
  const corpoTabelaEstoqueBaixo = document.getElementById("corpoTabelaEstoqueBaixo")
  corpoTabelaEstoqueBaixo.innerHTML = ""

  const itensEstoqueBaixo = dadosEstoque.filter((item) => item.quantidade <= item.estoqueMin)

  if (itensEstoqueBaixo.length === 0) {
    const linha = document.createElement("tr")
    linha.innerHTML = '<td colspan="5" style="text-align: center;">Não há itens com estoque baixo</td>'
    corpoTabelaEstoqueBaixo.appendChild(linha)
    return
  }

  itensEstoqueBaixo.forEach((item) => {
    const linha = document.createElement("tr")
    const diferenca = item.quantidade - item.estoqueMin

    // Formatar nome da categoria para exibição
    const categoriaExibicao = item.categoria
      .split("-")
      .map((palavra) => palavra.charAt(0).toUpperCase() + palavra.slice(1))
      .join(" ")

    linha.innerHTML = `
            <td>${item.nome}</td>
            <td>${categoriaExibicao}</td>
            <td>${item.quantidade} ${item.unidade}</td>
            <td>${item.estoqueMin} ${item.unidade}</td>
            <td>${diferenca.toFixed(2)} ${item.unidade}</td>
        `

    corpoTabelaEstoqueBaixo.appendChild(linha)
  })
}

// Atualizar tabela de valor por categoria
function atualizarTabelaValorCategoria() {
  const corpoTabelaValorCategoria = document.getElementById("corpoTabelaValorCategoria")
  corpoTabelaValorCategoria.innerHTML = ""

  // Obter categorias únicas
  const categorias = [...new Set(dadosEstoque.map((item) => item.categoria))]

  if (categorias.length === 0) {
    const linha = document.createElement("tr")
    linha.innerHTML = '<td colspan="4" style="text-align: center;">Não há categorias para exibir</td>'
    corpoTabelaValorCategoria.appendChild(linha)
    return
  }

  // Calcular valor total do estoque
  const valorTotalEstoque = dadosEstoque.reduce((soma, item) => soma + item.quantidade * item.preco, 0)

  // Para cada categoria, calcular estatísticas
  categorias.forEach((categoria) => {
    const itensDaCategoria = dadosEstoque.filter((item) => item.categoria === categoria)
    const quantidadeItens = itensDaCategoria.length
    const valorCategoria = itensDaCategoria.reduce((soma, item) => soma + item.quantidade * item.preco, 0)
    const percentual = valorTotalEstoque > 0 ? (valorCategoria / valorTotalEstoque) * 100 : 0

    const linha = document.createElement("tr")

    // Formatar nome da categoria para exibição
    const categoriaExibicao = categoria
      .split("-")
      .map((palavra) => palavra.charAt(0).toUpperCase() + palavra.slice(1))
      .join(" ")

    linha.innerHTML = `
            <td>${categoriaExibicao}</td>
            <td>${quantidadeItens}</td>
            <td>R$${valorCategoria.toFixed(2)}</td>
            <td>${percentual.toFixed(2)}%</td>
        `

    corpoTabelaValorCategoria.appendChild(linha)
  })
}

// Atualizar resumo geral
function atualizarResumoGeral() {
  // Total de itens
  document.getElementById("relatorioTotalItens").textContent = dadosEstoque.length

  // Valor total do estoque
  const valorTotal = dadosEstoque.reduce((soma, item) => soma + item.quantidade * item.preco, 0)
  document.getElementById("relatorioValorTotal").textContent = `R$${valorTotal.toFixed(2)}`

  // Itens com estoque baixo
  const contagemEstoqueBaixo = dadosEstoque.filter((item) => item.quantidade <= item.estoqueMin).length
  document.getElementById("relatorioEstoqueBaixo").textContent = contagemEstoqueBaixo

  // Categorias
  const categoriasUnicas = new Set(dadosEstoque.map((item) => item.categoria))
  document.getElementById("relatorioCategorias").textContent = categoriasUnicas.size

  // Data do relatório
  document.getElementById("relatorioData").textContent = formatarData(new Date().toISOString().split("T")[0])
}

// Abrir o modal para editar item
function abrirModalEditarItem(itemId) {
  // Encontrar o item
  const item = dadosEstoque.find((item) => item.id === itemId)
  if (!item) return

  // Preencher o formulário com os dados do item
  document.getElementById("itemId").value = item.id
  document.getElementById("nomeItem").value = item.nome
  document.getElementById("categoriaItem").value = item.categoria
  document.getElementById("quantidadeItem").value = item.quantidade
  document.getElementById("unidadeItem").value = item.unidade
  document.getElementById("precoItem").value = item.preco
  document.getElementById("estoqueMinItem").value = item.estoqueMin
  document.getElementById("observacoesItem").value = item.observacoes || ""

  // Atualizar título do modal
  document.getElementById("tituloModal").textContent = "Editar Item"

  // Mostrar o modal
  document.getElementById("modalItem").style.display = "flex"
}

// Abrir o modal para editar fornecedor
function abrirModalEditarFornecedor(fornecedorId) {
  // Encontrar o fornecedor
  const fornecedor = dadosFornecedores.find((f) => f.id === fornecedorId)
  if (!fornecedor) return

  // Preencher o formulário com os dados do fornecedor
  document.getElementById("fornecedorId").value = fornecedor.id
  document.getElementById("nomeFornecedor").value = fornecedor.nome
  document.getElementById("emailFornecedor").value = fornecedor.email || ""
  document.getElementById("telefoneFornecedor").value = fornecedor.telefone || ""
  document.getElementById("enderecoFornecedor").value = fornecedor.endereco || ""
  document.getElementById("cidadeFornecedor").value = fornecedor.cidade || ""
  document.getElementById("estadoFornecedor").value = fornecedor.estado || ""
  document.getElementById("cepFornecedor").value = fornecedor.cep || ""
  document.getElementById("observacoesFornecedor").value = fornecedor.observacoes || ""

  // Desmarcar todas as categorias
  document.querySelectorAll('input[name="categoriasFornecedor"]').forEach((checkbox) => {
    checkbox.checked = false
  })

  // Marcar as categorias do fornecedor
  if (fornecedor.categorias) {
    fornecedor.categorias.forEach((categoria) => {
      const checkbox = document.getElementById(`categoria${categoria.charAt(0).toUpperCase() + categoria.slice(1)}`)
      if (checkbox) checkbox.checked = true
    })
  }

  // Atualizar título do modal
  document.getElementById("tituloModalFornecedor").textContent = "Editar Fornecedor"

  // Mostrar o modal
  document.getElementById("modalFornecedor").style.display = "flex"
}

// Abrir o modal de confirmação de exclusão
function abrirModalExcluir(id, tipo) {
  let item

  if (tipo === "estoque") {
    item = dadosEstoque.find((item) => item.id === id)
  } else if (tipo === "fornecedor") {
    item = dadosFornecedores.find((f) => f.id === id)
  }

  if (!item) return

  // Definir o nome do item na mensagem de confirmação
  document.getElementById("nomeItemExcluir").textContent = item.nome

  // Armazenar o ID e tipo do item para exclusão
  document.getElementById("botaoConfirmarExclusao").setAttribute("data-id", id)
  document.getElementById("botaoConfirmarExclusao").setAttribute("data-tipo", tipo)

  // Mostrar o modal
  document.getElementById("modalExcluir").style.display = "flex"
}

// Salvar um item (adicionar ou editar)
function salvarItem() {
  // Obter valores do formulário
  const itemId = document.getElementById("itemId").value
  const nome = document.getElementById("nomeItem").value
  const categoria = document.getElementById("categoriaItem").value
  const quantidade = Number.parseFloat(document.getElementById("quantidadeItem").value)
  const unidade = document.getElementById("unidadeItem").value
  const preco = Number.parseFloat(document.getElementById("precoItem").value)
  const estoqueMin = Number.parseFloat(document.getElementById("estoqueMinItem").value)
  const observacoes = document.getElementById("observacoesItem").value

  // Criar objeto do item
  const item = {
    nome,
    categoria,
    quantidade,
    unidade,
    preco,
    estoqueMin,
    observacoes,
    ultimaAtualizacao: formatarDataParaArmazenamento(new Date()),
  }

  // Adicionar ou atualizar o item
  if (itemId) {
    // Atualizar item existente
    const index = dadosEstoque.findIndex((item) => item.id === Number.parseInt(itemId))
    if (index !== -1) {
      item.id = Number.parseInt(itemId)
      dadosEstoque[index] = item
      mostrarToast("Item atualizado com sucesso")
    }
  } else {
    // Adicionar novo item
    item.id = gerarId(dadosEstoque)
    dadosEstoque.push(item)
    mostrarToast("Item adicionado com sucesso")
  }

  // Salvar no localStorage
  salvarDadosLocais()

  // Fechar o modal
  document.getElementById("modalItem").style.display = "none"

  // Atualizar a tabela e estatísticas
  renderizarTabelaEstoque()
  atualizarEstatisticas()
}

// Salvar um fornecedor (adicionar ou editar)
function salvarFornecedor() {
  // Obter valores do formulário
  const fornecedorId = document.getElementById("fornecedorId").value
  const nome = document.getElementById("nomeFornecedor").value
  const email = document.getElementById("emailFornecedor").value
  const telefone = document.getElementById("telefoneFornecedor").value
  const endereco = document.getElementById("enderecoFornecedor").value
  const cidade = document.getElementById("cidadeFornecedor").value
  const estado = document.getElementById("estadoFornecedor").value
  const cep = document.getElementById("cepFornecedor").value
  const observacoes = document.getElementById("observacoesFornecedor").value

  // Obter categorias selecionadas
  const categorias = []
  document.querySelectorAll('input[name="categoriasFornecedor"]:checked').forEach((checkbox) => {
    categorias.push(checkbox.value)
  })

  // Criar objeto do fornecedor
  const fornecedor = {
    nome,
    email,
    telefone,
    endereco,
    cidade,
    estado,
    cep,
    categorias,
    observacoes,
    dataCadastro: formatarDataParaArmazenamento(new Date()),
  }

  // Adicionar ou atualizar o fornecedor
  if (fornecedorId) {
    // Atualizar fornecedor existente
    const index = dadosFornecedores.findIndex((f) => f.id === Number.parseInt(fornecedorId))
    if (index !== -1) {
      fornecedor.id = Number.parseInt(fornecedorId)
      dadosFornecedores[index] = fornecedor
      mostrarToast("Fornecedor atualizado com sucesso")
    }
  } else {
    // Adicionar novo fornecedor
    fornecedor.id = gerarId(dadosFornecedores)
    dadosFornecedores.push(fornecedor)
    mostrarToast("Fornecedor adicionado com sucesso")
  }

  // Salvar no localStorage
  salvarDadosLocais()

  // Fechar o modal
  document.getElementById("modalFornecedor").style.display = "none"

  // Atualizar a lista de fornecedores
  renderizarFornecedores()
}

// Confirmar exclusão de um item
function confirmarExclusao() {
  const id = Number.parseInt(document.getElementById("botaoConfirmarExclusao").getAttribute("data-id"))
  const tipo = document.getElementById("botaoConfirmarExclusao").getAttribute("data-tipo")

  if (tipo === "estoque") {
    // Remover o item do array
    dadosEstoque = dadosEstoque.filter((item) => item.id !== id)

    // Atualizar a tabela e estatísticas
    renderizarTabelaEstoque()
    atualizarEstatisticas()

    mostrarToast("Item excluído com sucesso")
  } else if (tipo === "fornecedor") {
    // Remover o fornecedor do array
    dadosFornecedores = dadosFornecedores.filter((f) => f.id !== id)

    // Atualizar a lista de fornecedores
    renderizarFornecedores()

    mostrarToast("Fornecedor excluído com sucesso")
  }

  // Salvar no localStorage
  salvarDadosLocais()

  // Fechar o modal
  document.getElementById("modalExcluir").style.display = "none"
}

// Exportar dados para CSV
function exportarCSV() {
  // Cabeçalho do CSV
  let csv =
    "ID,Nome,Categoria,Quantidade,Unidade,Preço Unitário,Valor Total,Estoque Mínimo,Última Atualização,Observações\n"

  // Adicionar cada item
  dadosEstoque.forEach((item) => {
    const valorTotal = (item.quantidade * item.preco).toFixed(2)
    const linha = [
      item.id,
      `"${item.nome}"`,
      `"${item.categoria}"`,
      item.quantidade,
      `"${item.unidade}"`,
      item.preco.toFixed(2),
      valorTotal,
      item.estoqueMin,
      `"${item.ultimaAtualizacao}"`,
      `"${item.observacoes || ""}"`,
    ].join(",")

    csv += linha + "\n"
  })

  // Criar blob e link para download
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")
  const url = URL.createObjectURL(blob)

  link.setAttribute("href", url)
  link.setAttribute("download", `estoque_${formatarDataParaArquivo(new Date())}.csv`)
  link.style.visibility = "hidden"

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  mostrarToast("Arquivo CSV exportado com sucesso")
}

// Função auxiliar para gerar um novo ID
function gerarId(array) {
  if (array.length === 0) return 1
  const maxId = Math.max(...array.map((item) => item.id))
  return maxId + 1
}

// Função auxiliar para formatar uma data para exibição
function formatarData(dataString) {
  const data = new Date(dataString)
  return data.toLocaleDateString("pt-BR")
}

// Função auxiliar para formatar uma data e hora para exibição
function formatarDataHora(data) {
  return (
    data.toLocaleDateString("pt-BR") + ", " + data.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
  )
}

// Função auxiliar para formatar uma data para armazenamento
function formatarDataParaArmazenamento(data) {
  return data.toISOString().split("T")[0]
}

// Função auxiliar para formatar uma data para nome de arquivo
function formatarDataParaArquivo(data) {
  return data.toISOString().split("T")[0].replace(/-/g, "")
}

// Mostrar uma notificação toast
function mostrarToast(mensagem) {
  const toast = document.getElementById("toast")
  const mensagemToast = document.getElementById("mensagemToast")

  mensagemToast.textContent = mensagem
  toast.style.display = "block"

  // Esconder o toast após 3 segundos
  setTimeout(() => {
    toast.style.display = "none"
  }, 3000)
}
