> 🇧🇷 [Português](#-português) | 🇺🇸 [English](#-english)

---

## 🇧🇷 Português

# Board Bots

Uma coleção de **companheiros de jogo solo** ("bots") para diversos jogos de tabuleiro — apps de página única em HTML/CSS/JavaScript, sem instalação, sem dependências e sem necessidade de servidor.

Cada bot simula um adversário automático ("Automa"), aplica variantes de modo solo oficiais/comunitárias ou oferece uma ferramenta de apoio para jogar sozinho, seguindo o fluxo de decisão do próprio jogo (ao estilo dos automas de David Turczi/Undaunted).

### 🎲 Como usar

**Forma recomendada — direto pelo navegador, sem instalar nada:**

1. Acesse **[colletes.github.io/boardbots](https://colletes.github.io/boardbots/)**.
2. Escolha o jogo desejado na tela inicial e toque em "Jogar".
3. Cada app tem uma tela inicial com o **preparo físico** do jogo (o que fazer no tabuleiro real) antes de iniciar a partida no app.
4. Use o botão de idioma (PT/EN) para alternar o idioma da interface a qualquer momento.
5. Use o botão de ajuda ("?") dentro de cada app para consultar as regras do modo solo a qualquer momento durante a partida.
6. O progresso da partida é salvo automaticamente no seu navegador (`localStorage`) — você pode fechar e reabrir o app (ou a aba) sem perder o andamento da partida.

Nenhum dado é enviado para a internet — tudo roda localmente, no seu navegador, mesmo usando o site.

**Alternativa — baixar e usar offline:**

Se preferir não depender de internet durante o jogo (ex: mesa sem Wi-Fi), baixe (ou clone) este repositório e abra o arquivo `.html` do jogo desejado, na pasta [`bots/`](bots/), diretamente no seu navegador (duplo clique no arquivo, ou arraste para uma aba). O funcionamento é idêntico ao do site.

### 📋 Jogos disponíveis

| Jogo | Arquivo | Descrição |
|---|---|---|
| **Stone Age** | [`stone_age_bot_v2.html`](bots/stone_age_bot_v2.html) | Automa com dois modos: variante solo comunitária (César Augusto Borja) e Modo Solo Oficial (sobrevivência). |
| **Star Wars: Legion — Battle of Hoth** | [`Colletes-hoth_bot_RC3.html`](bots/Colletes-hoth_bot_RC3.html) | Assistente de decisão tática ("Holocron Commander") para conduzir um oponente automático nos cenários da Batalha de Hoth. |
| **Heroscape** | [`Heroscape_bot_v2.html`](bots/Heroscape_bot_v2.html) | Implementação do Automated Battle Analyzer (sistema solo criado por Scott Campbell) para batalhas solo. |
| **Mystic Vale** | [`Mystic_Vale_bot_v02.html`](bots/Mystic_Vale_bot_v02.html) | Modo solo oficial "Nemesis" (criado por John D. Clair / AEG). |
| **Rock Hard: 1977** | [`mick_bot_RC2.html`](bots/mick_bot_RC2.html) | Adaptação da variante solo não-oficial de Mick "baseballbuzz" para o modo de uma pessoa. |
| **Thunder Road: Vendetta** (+ expansões Big Rig e Final Five) | [`Colletes-bot-trv-RC2.html`](bots/Colletes-bot-trv-RC2.html) | Bot para os veículos adversários controlados por IA na corrida, incluindo as expansões SDBR e SDFF. |
| **Ultra Tiny Epic Kingdoms** | [`utek_bot_v2.html`](bots/utek_bot_v2.html) | Dois modos: variante solo comunitária e Modo Solo Oficial do manual (com a "Bússola" de ações). |
| **Café Baras** | [`cafe_baras_bot_v1.html`](bots/cafe_baras_bot_v1.html) | "Capybot" — adversário automático com árvore de decisão própria, mais estratégico que a variante solo comunitária simples ("Capybot" original). |

### ⚖️ Direitos autorais e uso

- Estes apps são **ferramentas de apoio não-oficiais**, feitas por fãs para uso pessoal, sem fins comerciais.
- Cada jogo mencionado é propriedade de seus respectivos criadores/editoras — os apps não incluem regras completas, textos de cartas ou qualquer material protegido dos jogos originais, apenas a lógica necessária para conduzir um oponente automático.
- Manuais, PDFs e artes de capa (box art) usados durante o desenvolvimento **não fazem parte deste repositório**, por respeito aos direitos autorais dos editores.
- Créditos aos criadores de cada variante solo/automa estão descritos dentro de cada app, na seção "Créditos".

### 👤 Autor

Feito por **Thiago Colletes de Carvalho** ([colletes@gmail.com](mailto:colletes@gmail.com)), com apoio de IA (Gemini / GitHub Copilot) para implementação.

---

## 🇺🇸 English

# Board Bots

A collection of **solo-play companion apps** ("bots") for various board games — single-file HTML/CSS/JavaScript apps, no installation, no dependencies, no server required.

Each bot simulates an automated opponent ("Automa"), applies official/community solo-mode variants, or provides a decision-support tool for solo play, following the game's own logic flow (in the style of David Turczi/Undaunted-style automas).

### 🎲 How to use

**Recommended — right in your browser, nothing to install:**

1. Go to **[colletes.github.io/boardbots](https://colletes.github.io/boardbots/)**.
2. Pick the game you want on the landing screen and tap "Play".
3. Every app has a landing screen with the **physical setup** for the real board/table before starting the match in the app.
4. Use the language toggle (PT/EN) to switch the interface language at any time.
5. Use the help button ("?") inside each app to check the solo-mode rules at any time during the match.
6. Match progress is saved automatically in your browser (`localStorage`) — you can close and reopen the app (or tab) without losing your progress.

No data is ever sent over the internet — everything runs locally in your browser, even when using the site.

**Alternative — download and use offline:**

If you'd rather not depend on internet access while playing (e.g. a table with no Wi-Fi), download (or clone) this repository and open the `.html` file for the game you want, in the [`bots/`](bots/) folder, directly in your browser (double-click the file, or drag it into a tab). It works identically to the site.

### 📋 Available games

| Game | File | Description |
|---|---|---|
| **Stone Age** | [`stone_age_bot_v2.html`](bots/stone_age_bot_v2.html) | Automa with two modes: community solo variant (César Augusto Borja) and Official Solo Mode (survival). |
| **Star Wars: Legion — Battle of Hoth** | [`Colletes-hoth_bot_RC3.html`](bots/Colletes-hoth_bot_RC3.html) | Tactical decision assistant ("Holocron Commander") to run an automated opponent in Battle of Hoth scenarios. |
| **Heroscape** | [`Heroscape_bot_v2.html`](bots/Heroscape_bot_v2.html) | Implementation of the Automated Battle Analyzer (solo system created by Scott Campbell) for solo battles. |
| **Mystic Vale** | [`Mystic_Vale_bot_v02.html`](bots/Mystic_Vale_bot_v02.html) | Official "Nemesis" solo mode (created by John D. Clair / AEG). |
| **Rock Hard: 1977** | [`mick_bot_RC2.html`](bots/mick_bot_RC2.html) | Adaptation of Mick "baseballbuzz"'s unofficial solo variant for one-player mode. |
| **Thunder Road: Vendetta** (+ Big Rig and Final Five expansions) | [`Colletes-bot-trv-RC2.html`](bots/Colletes-bot-trv-RC2.html) | Bot for AI-controlled rival vehicles in the race, including the SDBR and SDFF expansions. |
| **Ultra Tiny Epic Kingdoms** | [`utek_bot_v2.html`](bots/utek_bot_v2.html) | Two modes: community solo variant and the rulebook's Official Solo Mode (with the action "Compass"). |
| **Café Baras** | [`cafe_baras_bot_v1.html`](bots/cafe_baras_bot_v1.html) | "Capybot" — automated opponent with its own decision tree, more strategic than the simple community "Capybot" solo variant. |

### ⚖️ Copyright and usage

- These apps are **unofficial companion tools**, made by a fan for personal, non-commercial use.
- Each game mentioned is the property of its respective creators/publishers — the apps do not include full rules, card text, or any protected material from the original games, only the logic needed to run an automated opponent.
- Rulebooks, PDFs, and box art used during development are **not included in this repository**, out of respect for publishers' copyrights.
- Credits to the creators of each solo/automa variant are listed inside each app, in the "Credits" section.

### 👤 Author

Made by **Thiago Colletes de Carvalho** ([colletes@gmail.com](mailto:colletes@gmail.com)), with AI assistance (Gemini / GitHub Copilot) for implementation.
Bots for various boardgames.
