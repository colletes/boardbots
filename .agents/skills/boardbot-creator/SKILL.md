---
name: boardbot-creator
description: >-
  Use this skill when the user asks to create a new bot for a board game or update an existing bot. This skill guides the agent on how to structure the HTML, maintain UI/UX coherence, implement i18n, and handle game documentation and assets.
---

# Boardbot Creator

Siga este passo-a-passo rigorosamente ao criar novos bots para a plataforma "Boardbots".

## 1. Coleta de Informações e Assets
Antes de começar a codificar, você deve:
*   **Solicitar Manuais:** Pedir ao usuário a documentação do jogo e o manual do automa (se disponível). Isso garante que as regras implementadas sejam precisas e usem a terminologia oficial.
*   **Solicitar Imagens:** Pedir as imagens de capa: uma para o "hero banner" do bot e outra menor (webp) para o card na página inicial (`index.html`).

## 2. Estrutura e Navegação (UI/UX Coerente)
A UI deve ser coerente com os demais bots da página:
*   Mantenha o padrão de cores, fontes e estilo global (usando `assets/site.css`).
*   **Responsividade:** Leve em conta telas grandes (desktops) e dispositivos móveis, utilizando design responsivo.
*   **Tela Inicial Separada:** O bot DEVE ter uma tela/modal inicial dedicada apenas para as **Opções do Bot** e para o **Setup Físico do Jogo**, antes do usuário acessar a tela principal de jogo.
*   **Rodapé Obrigatório:** Inclua no final da página do bot:
    *   A seção de Créditos (mencionando designers originais e adaptações).
    *   O botão de "Buy me a coffee" (Ko-fi).

## 3. Internacionalização (i18n)
O bot deve suportar os idiomas `pt-BR` e `en-US`:
*   Todo texto visível deve usar uma arquitetura de internacionalização (ex: atributos `data-i18n`).
*   **NÃO** deixe textos fixos no HTML que o usuário final verá. Crie dicionários JS locais para o bot, ou integre as lógicas compatíveis com a variável `localStorage.getItem('boardbots_lang')`.

## 4. Ajuda e Tutoriais (Modal de Regras)
Uma boa documentação in-app é fundamental:
*   **Modal Compreensiva:** Crie uma modal de regras/ajuda detalhada acessível via botão `?`.
*   **Setup:** Inclua as instruções do setup físico do jogo e o setup do bot na tela inicial e também disponíveis na ajuda.
*   **Exemplos Práticos:** Sempre que possível, inclua exemplos visuais/didáticos na ajuda (ex: mostrando como o bot escolhe um alvo numa carta marcada).

## 5. Modificações na Página Inicial (`index.html`)
Ao integrar o bot novo na home:
*   Adicione o card dele com a arte e o título.
*   **Likes/Dislikes:** Certifique-se de adicionar botões de like/dislike no card da página inicial.
*   Traduza o card na página principal através da estrutura existente no `assets/site.js`.
