/**
 * Sistema de Controle de Estoque para Restaurante
 * Versão com tema azul e funcionalidade de relatórios
 */

// Dados de exemplo para demonstração
let dadosEstoque = [
    {
      id: 1,
      nome: "Tomates",
      categoria: "hortifruti",
      quantidade: 25.5,
      unidade: "kg",
      preco: 5.99,
      estoqueMin: 10,
      ultimaAtualizacao: "2023-05-06",
      observacoes: "Tomates orgânicos",
    },
    {
      id: 2,
      nome: "Peito de Frango",
      categoria: "carnes",
      quantidade: 15,
      unidade: "kg",
      preco: 18.5,
      estoqueMin: 5,
      ultimaAtualizacao: "2023-05-05",
      observacoes: "Sem osso, sem pele",
    },
    {
      id: 3,
      nome: "Leite",
      categoria: "laticinios",
      quantidade: 20,
      unidade: "l",
      preco: 4.25,
      estoqueMin: 8,
      ultimaAtualizacao: "2023-05-06",
      observacoes: "Leite integral",
    },
    {
      id: 4,
      nome: "Arroz",
      categoria: "secos",
      quantidade: 50,
      unidade: "kg",
      preco: 5.75,
      estoqueMin: 15,
      ultimaAtualizacao: "2023-04-28",
      observacoes: "Arroz tipo 1",
    },
    {
      id: 5,
      nome: "Azeite de Oliva",
      categoria: "secos",
      quantidade: 8,
      unidade: "l",
      preco: 28.99,
      estoqueMin: 3,
      ultimaAtualizacao: "2023-05-01",
      observacoes: "Extra virgem",
    },
    {
      id: 6,
      nome: "Refrigerante Cola",
      categoria: "bebidas",
      quantidade: 48,
      unidade: "unidades",
      preco: 6.25,
      estoqueMin: 24,
      ultimaAtualizacao: "2023-05-04",
      observacoes: "Latas de 350ml",
    },
    {
      id: 7,
      nome: "Cebolas",
      categoria: "hortifruti",
      quantidade: 18,
      unidade: "kg",
      preco: 3.5,
      estoqueMin: 10,
      ultimaAtualizacao: "2023-05-03",
      observacoes: "Cebolas amarelas",
    },
    {
      id: 8,
      nome: "Farinha de Trigo",
      categoria: "secos",
      quantidade: 25,
      unidade: "kg",
      preco: 4.25,
      estoqueMin: 10,
      ultimaAtualizacao: "2023-04-25",
      observacoes: "Farinha tipo 1",
    },
  ]
  
  // Elementos do DOM
  const corpoTabelaEstoque = document.getElementById("corpoTabelaEstoque")
  const botaoAdicionarItem = document.getElementById("botaoAdicionarItem")
  const modalItem = document.getElementById("modalItem")
  const modalExcluir = document.getElementById("modalExcluir")
  const botoesFecharModal = document.querySelectorAll(".close-modal")
  const formItem = document.getElementById("formItem")
  const botaoCancelarItem = document.getElementById("botaoCancelarItem")
  const campoBusca = document.getElementById("campoBusca")
  const botaoBusca = document.getElementById("botaoBusca")
  const filtroCategoria = document.getElementById("filtroCategoria")
  const filtroEstoque = document.getElementById("filtroEstoque")
  const botaoLimparFiltros = document.getElementById("botaoLimparFiltros")
  const botaoAtualizar = document.getElementById("botaoAtualizar")
  const botaoConfirmarExclusao = document.getElementById("botaoConfirmarExclusao")
  const botaoCancelarExclusao = document.getElementById("botaoCancelarExclusao")
  const nomeItemExcluir = document.getElementById("nomeItemExcluir")
  const toast = document.getElementById("toast")
  const mensagemToast = document.getElementById("mensagemToast")
  
  // Elementos de estatísticas
  const totalItensEl = document.getElementById("totalItens")
  const estoqueBaixoEl = document.getElementById("estoqueBaixo")
  const categoriasEl = document.getElementById("categorias")
  const valorTotalEl = document.getElementById("valorTotal")
  
  // Elementos de navegação
  const menuEstoque = document.getElementById("menu-estoque")
  const menuRelatorios = document.getElementById("menu-relatorios")
  const secaoEstoque = document.getElementById("secao-estoque")
  const secaoRelatorios = document.getElementById("secao-relatorios")
  
  // Elementos de relatório
  const filtroRelatorio = document.getElementById("filtroRelatorio")
  const corpoTabelaEstoqueBaixo = document.getElementById("corpoTabelaEstoqueBaixo")
  const corpoTabelaValorCategoria = document.getElementById("corpoTabelaValorCategoria")
  const relatorioTotalItens = document.getElementById("relatorioTotalItens")
  const relatorioValorTotal = document.getElementById("relatorioValorTotal")
  const relatorioEstoqueBaixo = document.getElementById("relatorioEstoqueBaixo")
  const relatorioCategorias = document.getElementById("relatorioCategorias")
  const relatorioData = document.getElementById("relatorioData")
  const botaoGerarPDF = document.getElementById("botaoGerarPDF")
  const botaoGerarCSV = document.getElementById("botaoGerarCSV")
  
  // Inicializar a aplicação
  document.addEventListener("DOMContentLoaded", () => {
    // Carregar dados do localStorage se disponíveis
    const dadosSalvos = localStorage.getItem("dadosEstoque")
    if (dadosSalvos) {
      dadosEstoque = JSON.parse(dadosSalvos)
    }
  
    renderizarTabelaEstoque()
    atualizarEstatisticas()
  
    // Configurar event listeners
    configurarEventListeners()
  })
  
  // Configurar todos os event listeners
  function configurarEventListeners() {
    // Navegação
    menuEstoque.addEventListener("click", (e) => {
      e.preventDefault()
      mostrarSecao("estoque")
    })
  
    menuRelatorios.addEventListener("click", (e) => {
      e.preventDefault()
      mostrarSecao("relatorios")
      atualizarRelatorios()
    })
  
    // Botão adicionar item
    botaoAdicionarItem.addEventListener("click", () => {
      abrirModalAdicionarItem()
    })
  
    // Botões fechar modal
    botoesFecharModal.forEach((btn) => {
      btn.addEventListener("click", () => {
        modalItem.style.display = "none"
        modalExcluir.style.display = "none"
      })
    })
  
    // Botão cancelar item
    botaoCancelarItem.addEventListener("click", () => {
      modalItem.style.display = "none"
    })
  
    // Submissão do formulário de item
    formItem.addEventListener("submit", (e) => {
      e.preventDefault()
      salvarItem()
    })
  
    // Funcionalidade de busca
    botaoBusca.addEventListener("click", () => {
      renderizarTabelaEstoque()
    })
  
    campoBusca.addEventListener("keyup", () => {
      renderizarTabelaEstoque()
    })
  
    campoBusca.addEventListener("keyup", (e) => {
      if (e.key === "Enter") {
        renderizarTabelaEstoque()
      }
    })
  
    // Filtros
    filtroCategoria.addEventListener("change", renderizarTabelaEstoque)
    filtroEstoque.addEventListener("change", renderizarTabelaEstoque)
  
    // Limpar filtros
    botaoLimparFiltros.addEventListener("click", () => {
      filtroCategoria.value = "all"
      filtroEstoque.value = "all"
      campoBusca.value = ""
      renderizarTabelaEstoque()
    })
  
    // Botão atualizar
    botaoAtualizar.addEventListener("click", () => {
      renderizarTabelaEstoque()
      atualizarEstatisticas()
      mostrarToast("Dados atualizados com sucesso")
    })
  
    // Confirmação de exclusão
    botaoConfirmarExclusao.addEventListener("click", confirmarExclusao)
    botaoCancelarExclusao.addEventListener("click", () => {
      modalExcluir.style.display = "none"
    })
  
    // Fechar modais ao clicar fora
    window.addEventListener("click", (e) => {
      if (e.target === modalItem) {
        modalItem.style.display = "none"
      }
      if (e.target === modalExcluir) {
        modalExcluir.style.display = "none"
      }
    })
  
    // Filtro de relatório
    filtroRelatorio.addEventListener("change", atualizarRelatorios)
  
    // Botões de exportação
    botaoGerarPDF.addEventListener("click", () => {
      mostrarToast("Exportação para PDF iniciada")
      // Implementação futura: exportar para PDF
    })
  
    botaoGerarCSV.addEventListener("click", () => {
      exportarCSV()
    })
  }
  
  // Mostrar seção específica
  function mostrarSecao(secao) {
    // Atualizar menu
    document.querySelectorAll(".sidebar-menu li").forEach((item) => {
      item.classList.remove("active")
    })
  
    if (secao === "estoque") {
      secaoEstoque.style.display = "block"
      secaoRelatorios.style.display = "none"
      menuEstoque.parentElement.classList.add("active")
    } else if (secao === "relatorios") {
      secaoEstoque.style.display = "none"
      secaoRelatorios.style.display = "block"
      menuRelatorios.parentElement.classList.add("active")
    }
  }
  
  // Renderizar a tabela de estoque com filtros aplicados
  function renderizarTabelaEstoque() {
    // Limpar a tabela
    corpoTabelaEstoque.innerHTML = ""
  
    // Obter valores dos filtros
    const termoBusca = campoBusca.value.toLowerCase()
    const valorCategoria = filtroCategoria.value
    const valorEstoque = filtroEstoque.value
  
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
        abrirModalExcluir(itemId)
      })
    })
  
    // Atualizar a hora da última atualização
    document.getElementById("ultimaAtualizacao").textContent = formatarDataHora(new Date())
  }
  
  // Abrir o modal para adicionar item
  function abrirModalAdicionarItem() {
    // Resetar o formulário
    formItem.reset()
    document.getElementById("itemId").value = ""
    document.getElementById("tituloModal").textContent = "Adicionar Novo Item"
  
    // Mostrar o modal
    modalItem.style.display = "flex"
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
    modalItem.style.display = "flex"
  }
  
  // Abrir o modal de confirmação de exclusão
  function abrirModalExcluir(itemId) {
    // Encontrar o item
    const item = dadosEstoque.find((item) => item.id === itemId)
    if (!item) return
  
    // Definir o nome do item na mensagem de confirmação
    nomeItemExcluir.textContent = item.nome
  
    // Armazenar o ID do item para exclusão
    botaoConfirmarExclusao.setAttribute("data-id", itemId)
  
    // Mostrar o modal
    modalExcluir.style.display = "flex"
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
      item.id = gerarIdItem()
      dadosEstoque.push(item)
      mostrarToast("Item adicionado com sucesso")
    }
  
    // Salvar no localStorage
    salvarNoLocalStorage()
  
    // Fechar o modal
    modalItem.style.display = "none"
  
    // Atualizar a tabela e estatísticas
    renderizarTabelaEstoque()
    atualizarEstatisticas()
  }
  
  // Confirmar exclusão de um item
  function confirmarExclusao() {
    const itemId = Number.parseInt(botaoConfirmarExclusao.getAttribute("data-id"))
  
    // Remover o item do array
    dadosEstoque = dadosEstoque.filter((item) => item.id !== itemId)
  
    // Salvar no localStorage
    salvarNoLocalStorage()
  
    // Fechar o modal
    modalExcluir.style.display = "none"
  
    // Atualizar a tabela e estatísticas
    renderizarTabelaEstoque()
    atualizarEstatisticas()
  
    mostrarToast("Item excluído com sucesso")
  }
  
  // Atualizar as estatísticas do dashboard
  function atualizarEstatisticas() {
    // Contagem total de itens
    totalItensEl.textContent = dadosEstoque.length
  
    // Contagem de estoque baixo
    const contagemEstoqueBaixo = dadosEstoque.filter((item) => item.quantidade <= item.estoqueMin).length
    estoqueBaixoEl.textContent = contagemEstoqueBaixo
  
    // Contagem de categorias
    const categoriasUnicas = new Set(dadosEstoque.map((item) => item.categoria))
    categoriasEl.textContent = categoriasUnicas.size
  
    // Valor total do estoque
    const valorTotal = dadosEstoque.reduce((soma, item) => soma + item.quantidade * item.preco, 0)
    valorTotalEl.textContent = `R$${valorTotal.toFixed(2)}`
  }
  
  // Atualizar relatórios
  function atualizarRelatorios() {
    const tipoRelatorio = filtroRelatorio.value
  
    // Atualizar tabela de estoque baixo
    atualizarTabelaEstoqueBaixo()
  
    // Atualizar tabela de valor por categoria
    atualizarTabelaValorCategoria()
  
    // Atualizar resumo geral
    atualizarResumoGeral()
  }
  
  // Atualizar tabela de estoque baixo
  function atualizarTabelaEstoqueBaixo() {
    corpoTabelaEstoqueBaixo.innerHTML = ""
  
    const itensEstoqueBaixo = dadosEstoque.filter((item) => item.quantidade <= item.estoqueMin)
  
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
  
    // Se não houver itens com estoque baixo
    if (itensEstoqueBaixo.length === 0) {
      const linha = document.createElement("tr")
      linha.innerHTML = '<td colspan="5" style="text-align: center;">Não há itens com estoque baixo</td>'
      corpoTabelaEstoqueBaixo.appendChild(linha)
    }
  }
  
  // Atualizar tabela de valor por categoria
  function atualizarTabelaValorCategoria() {
    corpoTabelaValorCategoria.innerHTML = ""
  
    // Obter categorias únicas
    const categorias = [...new Set(dadosEstoque.map((item) => item.categoria))]
  
    // Calcular valor total do estoque
    const valorTotalEstoque = dadosEstoque.reduce((soma, item) => soma + item.quantidade * item.preco, 0)
  
    // Para cada categoria, calcular estatísticas
    categorias.forEach((categoria) => {
      const itensDaCategoria = dadosEstoque.filter((item) => item.categoria === categoria)
      const quantidadeItens = itensDaCategoria.length
      const valorCategoria = itensDaCategoria.reduce((soma, item) => soma + item.quantidade * item.preco, 0)
      const percentual = (valorCategoria / valorTotalEstoque) * 100
  
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
    relatorioTotalItens.textContent = dadosEstoque.length
  
    // Valor total do estoque
    const valorTotal = dadosEstoque.reduce((soma, item) => soma + item.quantidade * item.preco, 0)
    relatorioValorTotal.textContent = `R$${valorTotal.toFixed(2)}`
  
    // Itens com estoque baixo
    const contagemEstoqueBaixo = dadosEstoque.filter((item) => item.quantidade <= item.estoqueMin).length
    relatorioEstoqueBaixo.textContent = contagemEstoqueBaixo
  
    // Categorias
    const categoriasUnicas = new Set(dadosEstoque.map((item) => item.categoria))
    relatorioCategorias.textContent = categoriasUnicas.size
  
    // Data do relatório
    relatorioData.textContent = formatarData(new Date().toISOString().split("T")[0])
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
  
  // Função auxiliar para gerar um novo ID de item
  function gerarIdItem() {
    if (dadosEstoque.length === 0) return 1
    const maxId = Math.max(...dadosEstoque.map((item) => item.id))
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
  
  // Salvar dados no localStorage
  function salvarNoLocalStorage() {
    localStorage.setItem("dadosEstoque", JSON.stringify(dadosEstoque))
  }
  
  // Mostrar uma notificação toast
  function mostrarToast(mensagem) {
    mensagemToast.textContent = mensagem
    toast.style.display = "block"
  
    // Esconder o toast após 3 segundos
    setTimeout(() => {
      toast.style.display = "none"
    }, 3000)
  }
  