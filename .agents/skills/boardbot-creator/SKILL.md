---
name: boardbot-creator
description: >-
  Use this skill when the user asks to create a new bot for a board game or update an existing bot. This skill guides the agent on how to structure the HTML, maintain UI/UX coherence, implement i18n, and handle game documentation and assets.
---

# Boardbot Creator

Siga este passo-a-passo rigorosamente ao criar novos bots para a plataforma "Boardbots".

## 1. Coleta de Informações e Assets

Antes de começar a codificar, você deve:

- **Solicitar Manuais:** Pedir ao usuário a documentação do jogo e o manual do automa (se disponível).
- **Solicitar Imagens:** Pedir as imagens de capa: uma para o "hero banner" do bot e outra (webp) para o card na `index.html`.
- **PDFs de regras:** Se o PDF for baseado em imagens (sem camada de texto), use `pdfplumber` + `page.to_image(resolution=150)` para renderizá-lo como PNG e leia visualmente. Se as imagens estiverem de cabeça para baixo, peça ao usuário para rotacioná-las. Extraia crops de cartas/líderes para uso direto como assets no repo.

## 2. Extração de Assets de PDFs (novo conhecimento)

Quando o jogo tem P&P (Print & Play) com imagens de cartas:

1. Renderize cada página do PDF como imagem: `page.to_image(resolution=150).save(path)`
2. Identifique separadores de linhas usando luminosidade média por linha (numpy): `row_means = np.array(img.convert('RGB')).mean(axis=(1,2))`; picos = separadores.
3. Recorte cada carta individualmente e salve como `.webp` (qualidade 88).
4. Para cartas rotacionadas: use `img.rotate(270, expand=True)` (Bilkis no 7WD estava de lado).
5. Salve na estrutura: `assets/art/{jogo}/leaders/{nome}.webp` e `assets/art/{jogo}/decision_cards/dc_{nn}.webp`.
6. Use as imagens reais no HTML do bot em vez de CSS puro.

**Exemplo (7 Wonders Duel):**
- `assets/art/7wd/leaders/` — 5 líderes extraídos da página 1 do PDF de cartas
- `assets/art/7wd/decision_cards/dc_01..12.webp` — 12 cartas de decisão extraídas da página 3

## 3. Estrutura e Navegação (UI/UX Coerente)

- Mantenha o padrão de cores, fontes e estilo global (usando `assets/site.css`).
- **Responsividade:** Desktop e mobile.
- **Tela Inicial Separada:** Setup screen obrigatória antes da tela de jogo.
  - Inclui seleção de modo/dificuldade
  - Inclui checklist de setup físico do jogo
- **Rodapé Obrigatório:** Créditos + botão Ko-fi ("Buy me a coffee").


## 4. UI/UX e Estrutura Comum (Padrão Boardbots)

O projeto Boardbots mantém um padrão visual rigoroso para garantir que todos os bots pareçam fazer parte do mesmo app.
Ao criar o HTML do bot, **você DEVE copiar e utilizar os seguintes elementos padrão** presentes nos bots mais recentes (ex: `stone_age_bot_v2.html`):

1. **Botões Flutuantes e Idioma (Início do body):**
   Inclua o botão de ajuda (`btn-help-float`), botão de reiniciar partida (`btn-reset-float`) e o seletor de idioma (`lang-switch`) fixos na tela.
2. **Hero Banner (Topo da página):**
   Sempre inclua uma div `.hero` contendo a imagem da caixa do jogo (`<img src="../assets/art/nome.webp">`). Ela deve ser estilizada para cortar (crop) e mostrar o título do jogo de forma legível.
3. **Setup Físico (Na tela de Setup):**
   É OBRIGATÓRIO incluir um checklist de setup físico (ex: usando tags `<details>` ou painel colapsável) detalhando os componentes do jogo e como o jogador deve preparar a mesa.
4. **Modal de Ajuda (Fim do body):**
   É OBRIGATÓRIO incluir o Modal de Regras (`#helpModal`) para explicar como o automa toma decisões, condições de vitória, e regras de desempate. Nunca assuma que as regras são simples demais para dispensar o modal.
5. **Footer (Fim do body):**
   Sempre inclua os créditos do autor (`.credits`), o botão Buy Me a Coffee (`.bmc-inline`) e o botão Home para voltar (`.btn-home`).
6. **Theming, Personalidade e UI Diegética (Padrão V2):**
   O bot DEVE ter uma interface altamente imersiva e diegética (in-world). A interface deve se parecer com um componente físico ou um elemento dentro do universo do jogo (ex: interface de jornais de guerra da 2ª Guerra Mundial, um mapa de pergaminho de fantasia, blocos de mármore esculpidos ou marcadores de papelão/vitral estilo dial).
   - Use texturas densas (noise SVG, degradês complexos), e pseudo-elementos (`::before`, `::after`) para compor cenários de fundo 3D (como mesas de madeira, ardósia, feltro ou pilares de pedra).
   - **Componentes Diegéticos Físicos:** Prefira sempre componentes diegéticos estilizados como objetos reais de mesa:
     - **Diais Físicos de Rodízio Duplo (Dual-Wheel Dials):** Marcadores de vida/pontos em formato de disco de papelão prensado com duas janelas recortadas (dezenas e unidades), rebites metálicos e acabamento temático (ex: Vitral/Obsidiana ou Ouro/Bronze).
     - **Tokens de Escudo/Marcadores:** Tokens de resina, metal ou madeira com feedback tátil de toque.
     - **Cartas com Espessura e Sombra 3D:** Bordas com bisel chanfrado e sombras profundas que dão a sensação de cartas reais sobre a mesa.
   - **Exibição Condicional de Componentes:** NUNCA polua a tela com componentes genéricos desnecessários:
     - **Rolador de Dados 3D:** Só deve ser exibido quando o vilão/líder/cenário selecionado realmente utilizar dados.
     - **Diais Secundários:** Diais especiais (ex: vida de cidades reféns, defesas dinâmicas) só devem ser renderizados quando a facção ativa exigir.
   - **Papel do Companion (Mesa Física vs Simulação Virtual):**
     - Quando o jogo físico possui cartas na caixa que o jogador compra na mesa, o bot NÃO deve simular a compra aleatória de cartas fictícias. O bot serve como assistente de estado de jogo (gerenciando escudos, dominância, dano, retaliações e gatilhos da mesa).
   - **Widescreen Layouts:** NUNCA confine a tela inteira em um `max-width: 500px` genérico no centro da tela para desktops. Em telas maiores (`min-width: 900px`), o layout deve se expandir utilizando CSS Grid ou Flexbox (ex: uma coluna lateral para status e uma coluna principal maior), aproveitando todo o espaço horizontal sem deixar enormes áreas pretas nas laterais.
7. **Painel de Histórico (Log):**
   É OBRIGATÓRIO incluir um painel de histórico de ações (log) na tela do jogo. O log deve registrar todas as ações e decisões do bot, para que o jogador possa auditar o que aconteceu caso clique rápido demais. O HTML deve conter um container (ex: `<div id="logPanel" class="log-panel"></div>`) e o JS deve alimentar esse painel com mensagens descritivas a cada jogada.
## 4.1 Internacionalização (i18n)


- Todo texto visível via atributos `data-i18n`, `data-i18n-html`, `data-i18n-aria`.
- Objeto local `const I18N = { pt: {…}, en: {…} }`.
- Idioma: `localStorage.getItem('boardbots_lang') || 'pt'`.
- Floating language switch (top-right, fixed): botões PT / EN.

## 5. Ajuda e Tutoriais (Modal de Regras)

- Modal acessível via botão `?` (bottom-right, fixed).
- Deve incluir: visão geral das regras, como ler cartas/tokens, condições de vitória, lembrete de setup.
- Use `<details>` colapsáveis dentro da modal para organizar seções.

## 6. Modificações na Página Inicial (`index.html`)

- Adicione o card com arte + título + like/dislike.
- **Status Alpha:** Todo novo bot deve ser adicionado na seção "Em Teste (Alpha)" (o segundo `<div class="games-grid">`).
- **Badge Alpha:** Inclua sempre a tag `<span class="badge-alpha">ALPHA</span>` logo após a tag `<img>` dentro do `<div class="game-art">`.
- **Organização:** Insira o card do novo bot mantendo a ordem alfabética dentro da seção Alpha.
- Adicione chaves de i18n em `assets/site.js` (pt e en): `game_{key}_title`, `game_{key}_desc`, `credit_{key}`.
- Adicione `<li data-i18n-html="credit_{key}">` em `credits.html`.

## 7. Trello — Gestão de Tarefas

O projeto usa Trello: https://trello.com/b/98ErrGT4/boardbots

- **Credenciais:** `tools/trello.env` no repositório (gitignored via `*.env`). Também em `/Users/thiagocarvalho/Documents/Board games/tools/trello.env`.
- **Formato do arquivo `trello.env`:**
  ```
  # trello API key
  7c36db0487fb2e6d9727a2965d73b33c
  # trello token
  ATTAd11813f38743311d8d636adbd241cd6f25fcf8e1481403b0da49be22ac76f5ffB70D18DC
  ```
- **Colunas do quadro (list IDs):**
  | Coluna | ID |
  |--------|-----|
  | Backlog | `6a8f03d44d7de4aad6f8b2e8` |
  | Design | `6a8f03d44d7de4aad6f8b2e9` |
  | A Fazer | `6a8f03d44d7de4aad6f8b2ea` |
  | Em andamento | `6a8f03d44d7de4aad6f8b2eb` |
  | Revisão e QA | `6a8f03d44d7de4aad6f8b2ec` |
  | Fase de teste | `6a8f03d44d7de4aad6f8b2ed` |
  | Concluído 🎉 | `6a8f03d44d7de4aad6f8b2ee` |

- **Mover card para Design:**
  ```bash
  curl -X PUT "https://api.trello.com/1/cards/{CARD_ID}?key={API_KEY}&token={TOKEN}&idList=6a8f03d44d7de4aad6f8b2e9"
  ```
- **Atualizar descrição:**
  ```bash
  curl -X PUT "https://api.trello.com/1/cards/{CARD_ID}?key={API_KEY}&token={TOKEN}" \
    --data-urlencode "desc=Texto aqui"
  ```
- Card ID = parte da URL do card: `https://trello.com/c/{CARD_ID}/...`
- Ao criar/atualizar plano de implementação: **sempre** atualizar o card Trello correspondente + mover para a coluna correta.

## 8. Prompt de Geração de Código (para modelos de menor capacidade)

Ao finalizar o `implementation_plan.md`, inclua sempre uma seção **"Code Generation Prompt"** com um prompt detalhado para delegar a implementação. O prompt deve conter:

- Convenções da plataforma (HTML auto-contido, sem build, dark theme, i18n local, localStorage)
- Variáveis CSS do padrão do Stone Age bot (copiadas integralmente)
- Estrutura de cada tela (setup screen, game screen, help modal, footer)
- **Dados do jogo codificados como constantes JS verificadas** (nunca placeholder)
- Referências a paths de imagens reais (ex: `../assets/art/7wd/leaders/{nome}.webp`)
- Lista de chaves i18n a implementar (pt e en)
- Textos de crédito para embutir
- Instrução de output: "Produza o arquivo HTML completo e auto-contido"

## 9. Auditoria de Tarefas

Ao atualizar um plano existente, sempre inclua uma seção **"Task Status Audit"** com:

- ✅ Já feito (com o arquivo/artefato correspondente)
- ❌ Ainda pendente
- 🚫 Removido do plano (não faz mais sentido) com justificativa
- 🆕 Novo / adicionado ao plano

## 10. Conhecimento Específico: 7 Wonders Duel Solo Mode

### Mecânica de Cartas de Decisão (verificado no PDF)

Cada carta mostra **3 retângulos de tamanhos decrescentes** na direção da seta:
- **1ª escolha:** Retângulo **Maior/Mais alto** (mais próximo da base da seta)
- **2ª escolha:** Retângulo **Médio** (no centro)
- **3ª escolha:** Retângulo **Menor** (na ponta oposta)

Cores das prioridades: verde (Ciência), vermelho (Militar), e a **cor do Líder** (silhueta do busto).
- Em cartas com seta `→`: a leitura é da Esquerda para a Direita.
- Em cartas com seta `←`: a leitura é da Direita para a Esquerda.
- Extra turn = cartas 11 e 12 (universal para todos os Líderes, símbolo ↺).
- Quando o baralho esgota → **embaralha novamente** (o baralho sempre é reembaralhado).
- Fallback = se nenhuma cor estiver acessível, pega a 1ª carta no sentido da seta.

### Líderes (verificado no PDF)
| Líder | Tokens iniciais | Cor da carta | Dificuldade | Especial |
|-------|----------------|--------------|-------------|---------|
| Caesar | Strategy | Purple | ⭐ | — |
| Aristotle | Law + Mathematics | Grey | ⭐⭐⭐ | — |
| Hammurabi | Economy | Yellow | ⭐⭐ | +5 VP no final |
| Bilkis | Economy | Brown (também grey) | ⭐⭐⭐⭐⭐ | — |
| Cleopatra | Philosophy + Agriculture | Blue | ⭐⭐⭐⭐ | — |

### Assets
```
assets/art/7wondersduel.webp            ← capa
assets/art/7wd/leaders/caesar.webp      ← portrait do líder
assets/art/7wd/leaders/aristotle.webp
assets/art/7wd/leaders/hammurabi.webp
assets/art/7wd/leaders/cleopatra.webp
assets/art/7wd/leaders/bilkis.webp
assets/art/7wd/decision_cards/dc_01.webp … dc_12.webp
```

## 11. Conhecimento Específico: 3D Dice Box

Ao integrar o `@3d-dice/dice-box` para rolagem física de dados:

1. **Evite Bugs de CORS/Web Worker:** Sempre use CDN com configuração exata para `assetPath` e `origin`. O worker precisa ser carregado do root do `dist/`.
2. **Setup do Objeto:**
   ```javascript
   const { default: DiceBox } = await import('https://unpkg.com/@3d-dice/dice-box@1.1.3/dist/dice-box.es.min.js');
   diceBox = new DiceBox({
     container: '#dice-box',
     assetPath: 'assets/', 
     origin: 'https://unpkg.com/@3d-dice/dice-box@1.1.3/dist/',
     theme: 'default', themeColor: '#475569', scale: 9
   });
   ```
3. **Failsafe Global Rigoroso:** Para evitar congelamento infinito da UI caso o CDN caia ou o CSP bloqueie o import, enrole o `initDiceBox()` inteiro em um `Promise.race` de 3 segundos dentro de um bloco `try/catch`. Se falhar, ative um fallback imediato para `Math.random()`.
4. **Mecânica de "Dice Tray" Estático (Altamente Recomendado):**
   - Não mova o contêiner do dado (`#dice-box`) dinamicamente no DOM com `appendChild`, pois isso pode causar bugs em UIs reativas ou quando combinado com limpezas de `textContent`.
   - Crie um "Tray" fixo e invisível no canto da tela e insira o `#dice-box` permanentemente dentro dele:
     ```html
     <div id="dice-tray" style="position:fixed; bottom:20px; left:20px; width:180px; height:180px; z-index:9999; pointer-events:none;">
       <div id="dice-box" style="position:absolute; top:0; left:0; width:100%; height:100%; pointer-events:none;"></div>
     </div>
     ```
   - Assim o dado rolará sempre no mesmo local, livre de bugs de renderização.

## 12. Lições Críticas de Implementação e Boas Práticas (Aprendizados Recentes)

### 12.1 Regra de Estilo Único (Anti-Duplicate Stylesheet Trap)
- **NUNCA** adicione blocos `<style>` secundários ou duplicados no final do arquivo HTML (próximo ao `</body>`).
- O CSS no final do arquivo tem maior especificidade e sobrescreve todas as variáveis do `<head>`, reativando acidentalmente temas legados (como o tema neon ou regras antigas de layout).
- Todas as regras de componentes (incluindo `.btn-home`, `.bmc-float`, modais e botões flutuantes) devem residir exclusivamente dentro do bloco `<style>` principal no `<head>`.

### 12.2 Contenção Universal de SVGs (Prevenção de Ícones Gigantes)
- Ícones SVG inline sem dimensões explícitas se expandem para 100% da largura do contêiner flex/block no WebKit/Blink (como aconteceu em modais e cabeçalhos).
- Todo SVG deve ter atributos explícitos (ex: `width="22" height="22"`) e classes padrão (`class="icon-inline"`, `class="btn-icon"`, `class="icon-h1"`).
- Inclua sempre a regra global de contenção no CSS:
  ```css
  svg { max-width: 100%; }
  .icon-inline, .btn-icon, .icon-h1, h1 svg, h2 svg, h3 svg, button svg, .modal-content svg {
    display: inline-block !important;
    width: 1.2em !important;
    height: 1.2em !important;
    max-width: 24px !important;
    max-height: 24px !important;
    flex-shrink: 0 !important;
    vertical-align: -0.2em !important;
  }
  ```

### 12.3 Dials, Bússolas e Mostradores Circulares (Transformações Polares)
- Ao construir seletores circulares, roletas ou bússolas (ex: 12 posições de Tiny Epic Kingdoms ou mostradores de movimento em Heroscape), **evite** aninhar rotações em elementos com `inset: 0` ou `width: 100%`, pois o cálculo da caixa delimitadora colapsa para `0x0` em navegadores mobile/WebKit, agrupando todos os rótulos no topo (12 horas).
- Use o padrão de **Coordenadas Polares** ancorado no centro do mostrador:
  ```html
  <!-- Posição a 30° com raio de 114px -->
  <div class="compass-tick" style="transform: rotate(30deg) translateY(-114px) rotate(-30deg);">
    <span class="tick-num">1</span>
    <span>Ação</span>
  </div>
  ```
  ```css
  .compass-tick {
    position: absolute; top: 50%; left: 50%; width: 68px; height: 38px;
    margin-top: -19px; margin-left: -34px;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    pointer-events: none;
  }
  ```
  A rotação `rotate(θ) translateY(-R) rotate(-θ)` garante que o item viaje ao raio $R$ no ângulo exato $\theta$ e mantenha o texto perfeitamente horizontal e legível.

### 12.4 Chips de Ação (Separação de Textos e Cores por Jogador)
- Em jogos onde o jogador e o bot compartilham ou disputam fichas de ação na tela (ex: Tiny Epic Kingdoms), diferencie as cores dos chips ativados:
  - Jogador: Bordô / Carmesim (`.by-you`).
  - Bot: Verde Floresta / Musgo (`.by-ai`).
- O nome da ação e o nome de quem executou **devem** ser renderizados em tags de bloco separadas (`.chip-name` e `.chip-tag`), impedindo que textos concatenados se unam (ex: `"COMERCIARO JOGADOR BOT"`).

### 12.5 Layouts de Mão e Grid de Jogo
- Nunca aplique `display: grid; grid-template-columns: 1fr 1fr;` no contêiner raiz de jogo (`#view-game`) caso ele contenha a mão de cartas (`.hand-container`), pois isso esmaga as cartas em uma coluna única.
- O `#view-game` deve manter fluxo vertical flexível com `overflow-y: auto`, deixando a grade interna de cartas se autoajustar via `repeat(auto-fit, minmax(240px, 1fr))`.

## 13. Regra de Ambientes e Git Workflow Obrigatório (Staging-First)

Para evitar incidentes em produção, o projeto adota um fluxo estrito de dois ambientes:

| Ambiente | Branch | URL Pública | Finalidade |
|---|---|---|---|
| **Staging** | `staging` | `https://colletes.github.io/boardbots/staging/` | Testes de novos bots, correções, refatorações de UI. |
| **Produção** | `main` | `https://colletes.github.io/boardbots/` | Versão pública e estável acessada pelos usuários. |

### ⚠️ Regras Obrigatórias para o Agente:
1. **Todo Push DEVE ser feito exclusivamente em `staging`**:
   - Durante o desenvolvimento de um bot ou correção de bugs, **SEMPRE** trabalhe na branch `staging` e faça push para `origin staging`:
     ```bash
     git checkout staging
     git add .
     git commit -m "feat/fix: descrição da alteração"
     git push origin staging
     ```
   - **NUNCA** faça commits ou pushes diretos na branch `main`.
2. **Validação no Link de Staging**:
   - Após o push em `staging`, forneça imediatamente ao usuário o link de staging para testes em dispositivos reais: `https://colletes.github.io/boardbots/staging/` (ou caminho direto do bot em staging).
3. **Deploy em Produção (Somente com a skill `deploy-to-prod`)**:
   - Apenas promova código para `main` quando o usuário testar e autorizar expressamente a publicação em produção, utilizando a skill dedicada `deploy-to-prod`.

