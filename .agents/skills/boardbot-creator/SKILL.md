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

## 4. Internacionalização (i18n)

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
4. **Mecânica de "Dice Tray" Dinâmico (Restrição de Espaço):**
   - O contêiner HTML do dado deve ser `position: absolute; width: 100%; height: 100%; z-index: 10; pointer-events: none;`.
   - Antes de chamar `diceBox.roll()`, aninhe o `#dice-box` no elemento HTML de destino (`targetEl.appendChild(diceBoxEl)`).
   - Defina o `targetEl.style.position = 'relative'` e `targetEl.style.minHeight = '150px'` para abrir espaço na tela para o "tray".
   - Dispare um evento `resize` para forçar o canvas WebGL a adaptar-se ao contêiner (`window.dispatchEvent(new Event('resize'))`).
   - Limpe o `minHeight` quando o dado terminar de rolar.
