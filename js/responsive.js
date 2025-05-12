/**
 * Funções para responsividade do sistema
 */

document.addEventListener("DOMContentLoaded", () => {
  // Criar botão de toggle para sidebar em dispositivos móveis
  criarBotaoToggleSidebar()

  // Adicionar classe para tabelas responsivas
  tornarTabelasResponsivas()

  // Verificar tamanho da tela ao redimensionar
  window.addEventListener("resize", verificarTamanhoTela)

  // Verificar tamanho inicial da tela
  verificarTamanhoTela()
})

// Criar botão de toggle para sidebar
function criarBotaoToggleSidebar() {
  const botaoToggle = document.createElement("button")
  botaoToggle.className = "sidebar-toggle"
  botaoToggle.innerHTML = '<i class="fas fa-bars"></i>'
  botaoToggle.setAttribute("aria-label", "Toggle Sidebar")

  botaoToggle.addEventListener("click", () => {
    const sidebar = document.querySelector(".sidebar")
    sidebar.classList.toggle("active")
  })

  document.body.appendChild(botaoToggle)

  // Fechar sidebar ao clicar em um item do menu em telas pequenas
  const itensMenu = document.querySelectorAll(".sidebar-menu a")
  itensMenu.forEach((item) => {
    item.addEventListener("click", () => {
      if (window.innerWidth <= 768) {
        const sidebar = document.querySelector(".sidebar")
        sidebar.classList.remove("active")
      }
    })
  })

  // Fechar sidebar ao clicar fora dela em telas pequenas
  document.addEventListener("click", (e) => {
    const sidebar = document.querySelector(".sidebar")
    const botaoToggle = document.querySelector(".sidebar-toggle")

    if (
      window.innerWidth <= 768 &&
      !sidebar.contains(e.target) &&
      e.target !== botaoToggle &&
      !botaoToggle.contains(e.target)
    ) {
      sidebar.classList.remove("active")
    }
  })
}

// Tornar tabelas responsivas
function tornarTabelasResponsivas() {
  const tabelas = document.querySelectorAll("table")
  tabelas.forEach((tabela) => {
    const wrapper = document.createElement("div")
    wrapper.className = "table-responsive"
    tabela.parentNode.insertBefore(wrapper, tabela)
    wrapper.appendChild(tabela)
  })
}

// Verificar tamanho da tela e ajustar elementos
function verificarTamanhoTela() {
  const larguraTela = window.innerWidth

  // Ajustar visualização de fornecedores com base no tamanho da tela
  if (larguraTela <= 576) {
    const botaoGrid = document.getElementById("botaoVisualizacaoGrid")
    const botaoLista = document.getElementById("botaoVisualizacaoLista")
    const containerFornecedores = document.getElementById("containerFornecedores")

    if (botaoGrid && botaoLista && containerFornecedores) {
      botaoLista.classList.add("active")
      botaoGrid.classList.remove("active")
      containerFornecedores.className = "supplier-list-view"
    }
  }
}
