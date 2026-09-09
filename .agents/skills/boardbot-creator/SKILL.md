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
Ao criar o HTML do bot, **você DEVE copiar e utilizar os seguintes elementos padrão** presentes nos bots mais recentes (ex: `stone_age_bot.html`):

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
6. **UI Diegética e Imersão Temática:** O bot DEVE parecer um componente físico ou artefato imersivo pertencente ao universo do jogo (in-world prop). Siga rigorosamente os 4 passos detalhados na **Seção 5** (texturas reais CC0, SFX amostrado via ThemeKit, componentes físicos de mesa e voz em personagem).
7. **Widescreen e Layouts Flexíveis:** NUNCA confine a tela inteira em um `max-width: 500px` genérico no centro da tela para desktops. Em telas maiores (`min-width: 900px`), o layout deve se expandir utilizando CSS Grid ou Flexbox (ex: uma coluna lateral para status e uma coluna principal maior), aproveitando todo o espaço horizontal sem deixar enormes áreas pretas nas laterais.
8. **Nomenclatura Sem Sufixos de Versão:** NUNCA crie ou renomeie arquivos com sufixos de versão (`_v1`, `_v2`, `_RC2`). Os arquivos de bots e ferramentas residem diretamente como `bots/<nome_do_jogo>_bot.html` ou `tools/<nome_ferramenta>.html` e são editados in-place. O histórico git e o ambiente de `staging` fornecem a segurança necessária.

## 5. Passo a Passo para Elementos Diegéticos (Sons Reais, Texturas e Visual Temático)

O projeto Boardbots adota o padrão **"Diegetic UI Next Level"**. O bot **NUNCA** deve parecer uma planilha eletrônica, formulário web comum ou aplicativo genérico com tema escuro. Ele DEVE se comportar como um artefato físico ou assistente imersivo pertencente ao próprio universo da ficção do jogo (in-world prop).

Siga rigorosamente os 4 pilares a seguir ao criar ou atualizar qualquer bot:

### 5.1 Texturas Reais CC0 (`assets/textures/`)
- **Regra Fundamental:** NUNCA utilize apenas cores sólidas ou gradientes CSS planos no fundo. Todo bot DEVE utilizar uma textura seamless física real (512x512, JPG qualidade 72, CC0 obtidas no ambientCG) no stack de fundo do `body` ou contêiner de backdrop.
- **Inventário de Texturas Disponíveis em `assets/textures/`:**
  - `old-parchment.jpg` — pergaminho antigo (jogos medievais, fantasia, exploração: Wingspan, UTEK, Lost Cities).
  - `dark-walnut.jpg` — madeira nogueira escura (tabuleiros clássicos, fazendas, tavernas: Café Baras, Burgundy, bandejas de dados).
  - `light-oak.jpg` — carvalho claro (mesas escandinavas / madeira clara).
  - `stone-slab.jpg` — laje de pedra talhada (ruínas antigas, masmorras: Heroscape, LOTR Duel).
  - `cave-ground.jpg` — terra batida e caverna pré-histórica (Stone Age, Tiny Epic Dinosaurs).
  - `forest-floor.jpg` — solo de floresta com folhagem (Sanctuary, Wingspan).
  - `ancient-marble.jpg` — mármore clássico grego/romano (7 Wonders Duel).
  - `rusted-metal.jpg` — blindagem gasta e metal enferrujado (Thunder Road Vendetta, Mistborn, Air Land & Sea).
  - `hull-panel.jpg` — placas de casco espacial/sci-fi (Space Base, UTEG).
  - `frost-ice.jpg` — gelo e neve fofa (Hoth / Star Wars).
  - `stadium-grass.jpg` — gramado de estádio de futebol (Eleven).
  - `stage-asphalt.jpg` — asfalto de palco de show (Mick).
  - `cork-board.jpg` — cortiça de mural de laboratório/pesquisa (Ark Nova).
  - `aged-bulletin.jpg` — papel jornal de guerra envelhecido (Memoir '44).
  - `mossy-vine.jpg` — musgo e hera mística (Mystic Vale).
  - `felt-weave.jpg` — feltro verde de bandeja de jogos (Dice Roller).
- **Como Aplicar no CSS (`body` ou backdrop container):**
  Combine a textura com um gradiente escuro de cobertura (wash de 85% a 92% de opacidade) e `background-blend-mode`:
  ```css
  body {
    background-color: var(--bg-0);
    background-image:
      radial-gradient(circle at 50% 10%, rgba(229, 169, 59, 0.08) 0%, transparent 65%),
      linear-gradient(rgba(18, 22, 20, 0.90), rgba(18, 22, 20, 0.90)),
      url('../assets/textures/forest-floor.jpg');
    background-size: auto, auto, 512px 512px;
    background-repeat: no-repeat, no-repeat, repeat;
    background-blend-mode: normal, normal, multiply;
    background-attachment: fixed;
  }
  ```
- **Contraste e Legibilidade:** A textura deve ser sutil e táctil, conferindo peso físico sem competir visualmente com os dados e botões do jogo.
- **Novas Texturas:** Se precisar de material inédito, baixe de [ambientCG.com](https://ambientcg.com) (100% CC0), redimensione para 512x512 em JPG qualidade 72 (~30-60KB) e salve em `assets/textures/`.

### 5.2 Efeitos Sonoros Amostrados Reais (Sampled SFX via ThemeKit)
- **Regra Fundamental:** NUNCA utilize beeps de oscilador Web Audio ("som Atari") para feedback de ações do usuário (comprar cartas, rolar dados, alocar meeples, cliques de botões). Osciladores só são aceitos como zumbido/vento contínuo de fundo se estritamente necessário. O feedback táctil de ações DEVE usar amostras reais de som (sampled audio) em formato `.mp3`.
- **Biblioteca Compartilhada (`assets/sfx/shared/`):**
  - `card-flip`: virar/revelar carta ou token.
  - `card-draw`: puxar carta do deck.
  - `card-shuffle`: embaralhar baralho ou descarte.
  - `token-place`: alocar marcador, peão, meeple ou recurso no tabuleiro.
  - `dice-roll`: rolagem de dados sobre a mesa.
  - `dice-tray`: impacto de dados na bandeja de feltro/madeira.
  - `turn-notify`: aviso sonoro de início ou troca de turno.
  - `ui-click`: clique tátil e seco em botões ou abas.
- **Sons Específicos por Jogo (`assets/sfx/{jogo}/`):**
  - Ex: `stoneage:mammoth-step`, `stoneage:tribal-drum`, `hoth:blaster`, `wingspan:bird-chirp`, `eleven:whistle`.
- **Como Invocar via `ThemeKit` (`assets/theme-kit.js`):**
  1. No `<head>` do bot, inclua a tag do script antes do script inline:
     ```html
     <script src="../assets/theme-kit.js"></script>
     ```
  2. No início da partida / setup, faça preload dos sons mais comuns:
     ```javascript
     if (window.ThemeKit) {
       ThemeKit.preloadSfx(['card-draw', 'card-flip', 'token-place', 'ui-click']);
     }
     ```
  3. No disparo das ações:
     ```javascript
     // Som compartilhado
     if (window.ThemeKit) ThemeKit.playSfx('card-draw', { volume: 0.5 });

     // Som específico do jogo
     if (window.ThemeKit) ThemeKit.playSfx('stoneage:mammoth-step', { volume: 0.6 });
     ```
  4. O helper `ThemeKit` gerencia pool de instâncias de áudio (evitando cortes), ignora silenciosamente bloqueios de autoplay do navegador (`.catch()`) e respeita o estado global de mudo salvo em `localStorage` (`boardbots_sfx_muted`).
- **Haptics no Mobile:**
  - Complemente impactos críticos (rolagem de dados, batalha, fim de rodada) com feedback tátil sutil:
    ```javascript
    if ('vibrate' in navigator) navigator.vibrate(25);
    ```
- **Sourcing de Novos Áudios:** Somente utilize áudios CC0 ([Kenney.nl](https://kenney.nl/assets) áudio packs, [OpenGameArt.org](https://opengameart.org) filtrado por CC0, [Freesound.org](https://freesound.org) com filtro restrito a CC0). Caso utilize excepcionalmente um arquivo CC-BY, a linha de crédito correspondente deve ser adicionada em `credits.html`.

### 5.3 Componentes Temáticos e Ambiência Visual
- **Design de Componentes da Mesa Real (In-World Props):**
  - O bot deve espelhar componentes físicos do jogo:
    - **Tabuleiros e Racks:** Molduras de madeira chanfradas, esteiras de pergaminho com bordas gastas, placas de metal com parafusos/rebites ou recortes de jornais de época.
    - **Diais Físicos (Dual-Wheel Dials):** Marcadores de recursos, vida ou reputação desenhados como mostradores circulares de papelão prensado com duas janelas recortadas (dezenas e unidades) e rebite central.
    - **Bússolas, Roletas e Astrolábios:** Para seleções polares (ex: UTEK, Heroscape), utilize coordenadas polares ancoradas no centro (`rotate(θ) translateY(-R) rotate(-θ)`) com agulhas ou ponteiros que giram visualmente até o resultado sorteado.
    - **Cartas com Espessura e Sombra 3D:** Bordas chanfradas, relevo e sombras projetadas (`box-shadow: 0 8px 24px rgba(0,0,0,0.5)`).
- **Dados 3D com Física Real (`assets/dice-roller.js`):**
  - Só inclua o rolador 3D quando o bot realmente rolar dados no app (NUNCA em jogos onde os dados são rolados fisicamente na mesa pelo jogador ou onde a mecânica é de cartas/decisões).
  - Escolha sempre um tema bespoke alinhado à arte do jogo (`wooden`, `rust`, `gemstone`, `blueGreenMetal`, `smooth`, `stellar`).
  - **Inicialização Lazy Obrigatória:** Se o `#dice-box` estiver em modal/overlay inicialmente oculto (`display: none`), inicialize de forma lazy somente após o container ser exibido para evitar colapso do WebGL em 0x0.
- **Camada Atmosférica e Partículas Leves:**
  - Adicione partículas temáticas sutis via CSS puro (ex: brasas subindo, poeira de masmorra, flocos de neve, vaga-lumes, wisps de vapor).
  - **Regras Obrigatórias:**
    1. Sempre defina `pointer-events: none;` e `z-index: -1;` no contêiner de partículas para não interceptar cliques.
    2. Sempre envolva as animações em `@media (prefers-reduced-motion: no-preference)`.
- **Iconografia Diegética vs Emojis:**
  - NUNCA utilize emojis padrão de sistema operacional em botões ou no UI chrome principal (variam de cor/formato em cada OS).
  - Use SVGs inline vetoriais com a classe `.icon-inline` e regras explícitas de contenção (`width="22" height="22"`, `max-width: 24px`).
  - Fontes recomendadas: [game-icons.net](https://game-icons.net) (CC-BY 3.0, com crédito em `credits.html`) ou caminhos SVG artesanais.

### 5.4 Voz Narrativa em Personagem no Log Tático
- É OBRIGATÓRIO incluir um painel de histórico (`#logPanel` / `#actionHistory`).
- **Narrador Temático (In-Character Persona):** Redija as mensagens do bot sob a ótica de um personagem do universo do jogo (crônica tribal em Stone Age, conselheiro real em Tiny Epic Kingdoms, relatório de rádio militar em Memoir '44, diário de campo do diretor em Ark Nova, barista atencioso em Café Baras).
- **Preservação Integral de Dados Mecânicos:** A imersão NUNCA deve obscurecer as regras. Mantenha valores de dados, custos pagos, recursos obtidos, posições e nomes de cartas perfeitamente claros e auditáveis para que o jogador acompanhe com precisão o estado do jogo de mesa.

## 6. Internacionalização (i18n)

- Todo texto visível via atributos `data-i18n`, `data-i18n-html`, `data-i18n-aria`.
- Objeto local `const I18N = { pt: {…}, en: {…} }`.
- Idioma: `localStorage.getItem('boardbots_lang') || 'pt'`.
- Floating language switch (top-right, fixed): botões PT / EN.

## 7. Ajuda e Tutoriais (Modal de Regras)

- Modal acessível via botão `?` (bottom-right, fixed).
- Deve incluir: visão geral das regras, como ler cartas/tokens, condições de vitória, lembrete de setup.
- Use `<details>` colapsáveis dentro da modal para organizar seções.

## 8. Modificações na Página Inicial (`index.html`)

- Adicione o card com arte + título + like/dislike.
- **Status Alpha:** Todo novo bot deve ser adicionado na seção "Em Teste (Alpha)" (o segundo `<div class="games-grid">`).
- **Badge Alpha:** Inclua sempre a tag `<span class="badge-alpha">ALPHA</span>` logo após a tag `<img>` dentro do `<div class="game-art">`.
- **Organização:** Insira o card do novo bot mantendo a ordem alfabética dentro da seção Alpha.
- Adicione chaves de i18n em `assets/site.js` (pt e en): `game_{key}_title`, `game_{key}_desc`, `credit_{key}`.
- Adicione `<li data-i18n-html="credit_{key}">` em `credits.html`.

## 9. Prompt de Geração de Código (para modelos de menor capacidade)

Ao finalizar o `implementation_plan.md`, inclua sempre uma seção **"Code Generation Prompt"** com um prompt detalhado para delegar a implementação. O prompt deve conter:

- Convenções da plataforma (HTML auto-contido, sem build, dark theme, i18n local, localStorage)
- Variáveis CSS do padrão do Stone Age bot (copiadas integralmente)
- Estrutura de cada tela (setup screen, game screen, help modal, footer)
- **Dados do jogo codificados como constantes JS verificadas** (nunca placeholder)
- Referências a paths de imagens reais (ex: `../assets/art/7wd/leaders/{nome}.webp`)
- Lista de chaves i18n a implementar (pt e en)
- Textos de crédito para embutir
- Instrução de output: "Produza o arquivo HTML completo e auto-contido"

## 10. Auditoria de Tarefas

Ao atualizar um plano existente, sempre inclua uma seção **"Task Status Audit"** com:

- ✅ Já feito (com o arquivo/artefato correspondente)
- ❌ Ainda pendente
- 🚫 Removido do plano (não faz mais sentido) com justificativa
- 🆕 Novo / adicionado ao plano

## 11. Conhecimento Específico: 7 Wonders Duel Solo Mode

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

## 12. Conhecimento Específico: 3D Dice Box via Módulo Centralizado (`assets/dice-roller.js`)

Ao integrar rolagem física 3D de dados em qualquer bot:

1. **Utilize SEMPRE o Módulo Centralizado:** NUNCA copie código de inicialização do CDN `@3d-dice/dice-box` no inline script do bot. Use o helper compartilhado `assets/dice-roller.js`:
   ```javascript
   const { loadDiceBox, rollDiceSafe, sanitizeDie } = await import('../assets/dice-roller.js');
   ```
2. **Temas Customizados (Bespoke Themes):** Escolha um tema diegético do pacote `@3d-dice/dice-themes` condizente com a arte do jogo em vez do cinza padrão:
   - Temas disponíveis: `wooden` (madeira), `rust` (ferrugem pós-apocalíptica/militar), `gemstone` / `gemstoneMarble` (fantasia/joia), `blueGreenMetal` (fantasia medieval/alquimia), `smooth` (moderno clean, aceita `themeColor`), etc.
   - Exemplo de setup:
     ```javascript
     diceBox = await loadDiceBox({
       container: '#dice-box',
       theme: 'wooden',
       scale: 27,
       timeoutMs: 5000
     });
     ```
3. **Execução Segura com `rollDiceSafe` + `sanitizeDie`:**
   ```javascript
   try {
     const rollResult = await rollDiceSafe(diceBox, '1d6');
     const dieVal = sanitizeDie(rollResult[0].value, 6);
     // continuar lógica com dieVal...
   } catch (err) {
     console.warn("DiceBox timeout/falha, usando fallback:", err);
     const dieVal = Math.floor(Math.random() * 6) + 1;
   }
   ```
4. **Regra Crítica: Inicialização Lazy em Modais / Overlays (Bug Post-Ship Previsto):**
   - Se o `#dice-box` residir dentro de um contêiner inicialmente oculto (`display: none`, classe `.hidden` ou modal fechada), **NUNCA inicialize o DiceBox no carregamento da página**.
   - O WebGL colapsa para uma caixa `0x0`, resultando em tela preta sólida.
   - A inicialização DEVE ser lazy e memoizada por Promise, chamada **imediatamente após** a remoção da classe de ocultação (`overlay.classList.remove('hidden')`), quando o elemento já tiver dimensões de layout reais.
5. **Validação Obrigatória com Screenshot dos Dados Renderizados:**
   - Ao testar ou validar bots com dados 3D via scripts Playwright, **não valide apenas flags booleanas ou variáveis de estado**. É mandatório capturar um screenshot dos dados efetivamente renderizados na tela durante a rolagem para confirmar ausência de bugs visuais (como o bug da tela preta).

## 13. Lições Críticas de Implementação e Boas Práticas (Aprendizados Recentes)

### 13.1 Regra de Estilo Único (Anti-Duplicate Stylesheet Trap)
- **NUNCA** adicione blocos `<style>` secundários ou duplicados no final do arquivo HTML (próximo ao `</body>`).
- O CSS no final do arquivo tem maior especificidade e sobrescreve todas as variáveis do `<head>`, reativando acidentalmente temas legados (como o tema neon ou regras antigas de layout).
- Todas as regras de componentes (incluindo `.btn-home`, `.bmc-float`, modais e botões flutuantes) devem residir exclusivamente dentro do bloco `<style>` principal no `<head>`.

### 13.2 Contenção Universal de SVGs (Prevenção de Ícones Gigantes)
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

### 13.3 Dials, Bússolas e Mostradores Circulares (Transformações Polares)
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

### 13.4 Chips de Ação (Separação de Textos e Cores por Jogador)
- Em jogos onde o jogador e o bot compartilham ou disputam fichas de ação na tela (ex: Tiny Epic Kingdoms), diferencie as cores dos chips ativados:
  - Jogador: Bordô / Carmesim (`.by-you`).
  - Bot: Verde Floresta / Musgo (`.by-ai`).
- O nome da ação e o nome de quem executou **devem** ser renderizados em tags de bloco separadas (`.chip-name` e `.chip-tag`), impedindo que textos concatenados se unam (ex: `"COMERCIARO JOGADOR BOT"`).

### 13.5 Layouts de Mão e Grid de Jogo
- Nunca aplique `display: grid; grid-template-columns: 1fr 1fr;` no contêiner raiz de jogo (`#view-game`) caso ele contenha a mão de cartas (`.hand-container`), pois isso esmaga as cartas em uma coluna única.
- O `#view-game` deve manter fluxo vertical flexível com `overflow-y: auto`, deixando a grade interna de cartas se autoajustar via `repeat(auto-fit, minmax(240px, 1fr))`.

## 14. Regra de Ambientes e Git Workflow Obrigatório (Staging-First)

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

## 15. Kit de Tema Compartilhado e Regressão Visual (Obrigatório)

Para evitar os bugs recorrentes de "o redesign quebrou o layout de novo" (botões gigantes, ícones estourados, CSS duplicado sobrescrevendo o tema), qualquer agente de IA que crie ou atualize um bot **DEVE**:

1. **Usar o kit de tema compartilhado em vez de duplicar CSS/JS por bot:**
   - `assets/theme-kit.css` — contém apenas o que é genuinamente idêntico entre bots hoje: keyframes `fadeSlideUp`/`popIn`, a classe utilitária `.icon-inline` (ícone dimensionado em `em`, relativo ao texto ao redor), e o componente "credits row" (`.credits`/`.credits img`/`.credits-text`, miniatura da capa + texto de créditos). Cores/tamanhos são ajustáveis via variáveis CSS (`--tk-credits-*`) definidas no `:root` do próprio bot — nunca reescreva essas regras localmente uma vez que o bot já linka o arquivo.
   - `assets/theme-kit.js` — expõe `window.ThemeKit.setAmbientIcon(active, labelText)`, o helper de troca de ícone/label do botão de som ambiente (a lógica de áudio em si — osciladores, frequências — continua no próprio bot, pois varia por tema).
   - **Nota importante**: `.hero`, `.lang-switch` e `.btn-help-float` NÃO foram unificados — o catálogo hoje usa pelo menos 3 famílias de layout de navegação diferentes e deliberadas (barra superior fixa com lang-switch inline, botões flutuantes circulares, botões de topo simples). Não force um bot a mudar de família de layout só para "usar o kit" — isso é um redesign visual, não uma extração de CSS duplicado, e deve ser tratado (e validado) como tal.
   - Link no `<head>`, **antes** do `<style>` inline do bot: `<link rel="stylesheet" href="../assets/theme-kit.css">` e, se for usar o helper de ambiente, `<script src="../assets/theme-kit.js"></script>` antes do `<script>` inline do bot.
   - O `<style>` de cada bot deve conter **apenas** o tema específico daquele jogo — nunca recopie `.credits`/`.icon-inline`/os keyframes acima uma vez que o bot já linka o kit.
   - Bots já shipados **não precisam ser migrados de uma vez** — a migração é incremental, feita a cada pass de redesign daquele bot específico (ver `bots/mick_bot.html` como exemplo de migração já validada).
2. **Rodar o script de regressão visual antes de qualquer deploy para staging:**
   - `npm run visual-check [arquivo1.html arquivo2.html ...]` — compara screenshots atuais (desktop 1440px e mobile 390px) contra as baselines commitadas em `tools/visual-baselines/`; sem argumentos, roda em todos os bots. Diferenças acima do limiar (~0.2% dos pixels, ou mudança de altura de página) geram imagens em `tools/visual-diffs/` (não commitadas) para inspeção.
   - Após confirmar visualmente que uma mudança é intencional, atualize a baseline: `npm run visual-update [arquivo.html ...]` e commit as novas imagens em `tools/visual-baselines/`.
   - Script: `tools/visual-regression.mjs` (Playwright + pixelmatch, depende de `npm install` prévio — já configurado em `package.json`).
   - **Falsos positivos conhecidos**: `arknova_arno_bot.html` e `sanctuary_bot.html` sorteiam aleatoriamente a ordem das cartas de ação já na tela inicial (antes de qualquer clique) — um `CHANGED` nesses dois bots, sem relação com o arquivo que você editou, é normal; confirme visualmente via o `.diff.png` gerado (se o conteúdo aleatório é o único diferente, ignore/atualize a baseline mesmo assim).
   - Isso substitui o ciclo manual de "usuário reporta botão quebrado → corrige → usuário reporta de novo" observado em passes anteriores (Tiny Epic Kingdoms, Hoth).



