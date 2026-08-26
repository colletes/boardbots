// Board Bots — shared site i18n (index.html + credits.html)
const LANG_KEY = 'boardbots_lang';

const SITE_I18N = {
  pt: {
    site_title: 'Board Bots',
    site_tagline: 'Companheiros de jogo solo para os seus jogos de tabuleiro favoritos',
    intro_html: 'Escolha um jogo abaixo para abrir o app do bot. Cada um roda <strong>direto no navegador</strong>, sem instalação — e o progresso da partida fica salvo automaticamente no seu aparelho.',
    play_btn: 'Jogar',
    footer_credits: 'Créditos',
    footer_github: 'Ver no GitHub',
    footer_note: 'Ferramentas de apoio não-oficiais, feitas por fã, sem fins comerciais.',

    visits_label: 'Visitas',
    vote_like_aria: 'Gostei',
    vote_dislike_aria: 'Não gostei',
    feedback_title: 'Problema? Sugestão? Fale comigo!',
    feedback_desc: 'Encontrou um bug, um dado errado, ou tem uma ideia para um novo bot? Adoraria ouvir.',
    feedback_btn: 'Mandar e-mail',
    feedback_mailto: 'mailto:colletes@gmail.com?subject=[Boardbots]%20%20Feedback,%20sugestão,%20crítica',
    bmc_btn: 'Me pague um café',
    search_placeholder: 'Buscar jogo...',
    supporters_title: 'Últimos apoiadores',
    supporters_empty: 'Seja o primeiro a apoiar este projeto!',
    alpha_title: 'Em Teste (Alpha)',
    alpha_desc: 'Apps ainda em desenvolvimento ou com regras experimentais.',
    supporter_coffee_one: '{name} pagou um café ☕',
    supporter_coffee_many: '{name} pagou {count} cafés ☕',
    supporter_commission: '{name} encomendou algo especial',
    supporter_membership: '{name} virou associado {level}',
    supporter_recurring: '{name} passou a apoiar mensalmente',
    social_title: 'Me siga',
    social_x_aria: 'X (Twitter)',
    social_instagram_aria: 'Instagram',

    game_stoneage_title: 'Stone Age',
    game_stoneage_desc: 'Automa com dois modos: variante solo comunitária (César Augusto Borja) e Modo Solo Oficial de sobrevivência.',
    game_hoth_title: 'Star Wars: Legion — Battle of Hoth',
    game_hoth_desc: '"Holocron Commander" — assistente de decisão tática para conduzir o oponente automático nos cenários de Hoth.',
    game_heroscape_title: 'Heroscape',
    game_heroscape_desc: 'Automated Battle Analyzer (sistema solo de Scott Campbell) para batalhas solo.',
    game_mysticvale_title: 'Mystic Vale',
    game_mysticvale_desc: 'Modo solo oficial "Nemesis", criado por John D. Clair.',
    game_mick_title: 'Rock Hard: 1977',
    game_mick_desc: 'Adaptação da variante solo de Mick "baseballbuzz" para o modo de um jogador.',
    game_trv_title: 'Thunder Road: Vendetta',
    game_trv_desc: 'Bot para os veículos rivais controlados por IA, incluindo as expansões Big Rig (SDBR) e Final Five (SDFF).',
    game_utek_title: 'Ultra Tiny Epic Kingdoms',
    game_utek_desc: 'Dois modos: variante solo comunitária e o Modo Solo Oficial do manual, com a "Bússola" de ações.',
    game_cafebaras_title: 'Café Baras',
    game_cafebaras_desc: '"Capybot" — oponente automático com árvore de decisão própria, mais estratégico que a variante fã simples.',
    game_arknova_title: 'Ark Nova',
    game_arknova_desc: 'Automa "ARNO" — oponente por dado com cartas de ação, criado por Andre K.',
    game_sanctuary_title: 'Sanctuary',
    game_sanctuary_desc: 'Automa solo com mecânicas adaptadas do ARNO de Ark Nova.',
    game_eleven_title: 'Eleven',
    game_eleven_desc: 'Gerador de campanhas procedurais e resolvedor de partidas para times de futebol de mesa.',
    game_memoir44_title: "Memoir '44",
    game_memoir44_desc: '"Command HQ" — assistente de decisão tática para os 17 cenários da 2ª Guerra, incluindo o Dia D e a Batalha das Ardenas.',
    game_burgundy_title: 'AutoDuque',
    game_burgundy_desc: 'Automa para Castles of Burgundy — oponente automático com controle de prioridades de construção.',
    game_airlandsea_title: 'Air, Land & Sea',
    game_airlandsea_desc: 'Automa não-oficial com os modos Autônomo e Semiautônomo, e referência de prioridades de cartas.',
    game_7wd_title: '7 Wonders Duel',
    game_7wd_desc: 'Automa Duelist — enfrente 5 Líderes históricos com o baralho de decisão oficial.',

    credits_title: 'Créditos',
    back_link: 'Voltar aos bots',
    credits_author_heading: 'Autor',
    credits_author_html: 'Feito por <strong>Thiago Colletes de Carvalho</strong>, com apoio de IA (Gemini / GitHub Copilot) para implementação. Dúvidas, sugestões ou correções são muito bem-vindas por e-mail.',
    credits_games_heading: 'Créditos por jogo',
    credits_legal_heading: 'Direitos autorais e uso',
    credits_legal_html: 'Estes apps são <strong>ferramentas de apoio não-oficiais</strong>, feitas por fã para uso pessoal, sem fins comerciais. Cada jogo mencionado é propriedade de seus respectivos criadores/editoras — os apps não incluem regras completas, textos de cartas ou qualquer material protegido dos jogos originais, apenas a lógica necessária para conduzir um oponente automático. Manuais e PDFs usados durante o desenvolvimento não fazem parte deste repositório, por respeito aos direitos autorais dos editores. Pequenas imagens de capa (box art) de cada jogo são usadas apenas para identificação. Código-fonte disponível sob a licença MIT.',

    credit_stoneage: '<strong>Stone Age</strong> — variante solo com Automa criada por César Augusto Borja (<a href="https://ludopedia.com.br/usuario/caborja" target="_blank" rel="noopener">Ludopedia</a>); Modo Solo Oficial traduzido por Raphael Gurian. Stone Age © Hans im Glück / Z-Man Games.',
    credit_hoth: '<strong>Star Wars: Legion — Battle of Hoth</strong> — 100% conteúdo, táticas e app originais do autor. Star Wars: Battle of Hoth © Days of Wonder / Lucasfilm Ltd.',
    credit_heroscape: '<strong>Heroscape</strong> — baseado no "Automated Battle Analyzer", sistema solo criado por Scott Campbell. Heroscape © Hasbro / Milton Bradley.',
    credit_mysticvale: '<strong>Mystic Vale</strong> — baseado nas regras oficiais do modo "Nemesis", criado por John D. Clair. Mystic Vale © Alderac Entertainment Group (AEG).',
    credit_mick: '<strong>Rock Hard: 1977</strong> — baseado no mod criado por <a href="https://boardgamegeek.com/profile/baseballbuzz" target="_blank" rel="noopener">baseballbuzz</a>.',
    credit_trv: '<strong>Thunder Road: Vendetta</strong> — baseado no jogo oficial (e expansões Big Rig/Final Five) da Restoration Games, e no sistema de bot criado por <a href="https://boardgamegeek.com/profile/mayrik" target="_blank" rel="noopener">Padey Mayrik</a>.',
    credit_utek: '<strong>Ultra Tiny Epic Kingdoms</strong> — baseado na variante solo fã da <a href="https://gjjgames.blogspot.com/" target="_blank" rel="noopener">GJJ Games</a> para Tiny Epic Kingdoms. Ultra Tiny Epic Kingdoms © Gamelyn Games.',
    credit_cafebaras: '<strong>Café Baras</strong> — árvore de decisão original do autor, inspirada no conceito comunitário do "Capybot" e no estilo de automas de David Turczi. Café Baras design de Roberta Taylor, © 2024 KTBG (Kids Table Board Gaming), versão brasileira Ludofun.',
    credit_arknova: '<strong>Ark Nova</strong> — baseado no automa "ARNO", criado por Andre K. Ark Nova © Feuerland Spiele / Capstone Games.',
    credit_sanctuary: '<strong>Sanctuary</strong> — automa adaptado a partir do "ARNO" de Ark Nova. Sanctuary © Capstone Games.',
    credit_eleven: '<strong>Eleven</strong> — 100% conteúdo e app originais do autor. Eleven © Portal Games.',
    credit_memoir44: '<strong>Memoir \'44</strong> — 100% conteúdo, táticas e app originais do autor. Conteúdo de cenários também consultou o compêndio não-oficial "Western Front Scenario Compilation" de Derek "Whaleyland" Whaley. Memoir \'44 criado por Richard Borg, © Days of Wonder (edição em português por Galápagos Jogos).',
    credit_burgundy: '<strong>Castles of Burgundy</strong> — variante solo "AutoDuque" criada por um fã (LENS). Castles of Burgundy © Ravensburger.',
    credit_spacebase: '<strong>Space Base</strong> — Automa "Joanna" é uma variante solo não-oficial de fã do BGG. Assistente de Ataque à Base inspirado nas regras solo. Space Base © AEG.',
    credit_airlandsea: '<strong>Air, Land & Sea</strong> — Automa baseado nas regras solo originais criadas por <a href="https://boardgamegeek.com/profile/I_2orLess_I" target="_blank" rel="noopener">I_2orLess_I</a>. Air, Land & Sea © Arcane Wonders.',
    credit_7wd: '<strong>7 Wonders Duel</strong> — baseado no modo solo oficial (expansão gratuita P&P). 7 Wonders Duel © Repos Production, design de Antoine Bauza e Bruno Cathala.',

    tools_title: 'Ferramentas',
    tools_desc: 'Utilitários genéricos para qualquer jogo de tabuleiro, sem regras específicas.',
    tool_dice_title: 'Rolador de Dados',
    tool_dice_desc: 'Role múltiplos dados (d4 a d100) de uma vez.',
    tool_pointcounter_title: 'Contador de Pontos',
    tool_pointcounter_desc: 'Jogadores, critérios de pontuação, cronômetro de partida e sorteio do primeiro jogador.',
  },
  en: {
    site_title: 'Board Bots',
    site_tagline: 'Solo-play companions for your favorite board games',
    intro_html: 'Pick a game below to open its bot app. Each one runs <strong>right in the browser</strong>, no install needed — and match progress is saved automatically on your device.',
    play_btn: 'Play',
    footer_credits: 'Credits',
    footer_github: 'View on GitHub',
    footer_note: 'Unofficial fan-made companion tools, for personal, non-commercial use.',

    visits_label: 'Visits',
    vote_like_aria: 'Like',
    vote_dislike_aria: 'Dislike',
    feedback_title: 'Trouble? Feedback? Get in touch!',
    feedback_desc: 'Found a bug, a wrong stat, or have an idea for a new bot? I\'d love to hear it.',
    feedback_btn: 'Send an e-mail',
    feedback_mailto: 'mailto:colletes@gmail.com?subject=[Boardbots]%20%20Feedback,%20suggestion,%20bug',
    bmc_btn: 'Buy me a coffee',
    search_placeholder: 'Search game...',
    supporters_title: 'Latest supporters',
    supporters_empty: 'Be the first to support this project!',
    alpha_title: 'In Testing (Alpha)',
    alpha_desc: 'Apps still in development or with experimental rules.',
    supporter_coffee_one: '{name} bought a coffee ☕',
    supporter_coffee_many: '{name} bought {count} coffees ☕',
    supporter_commission: '{name} ordered something special',
    supporter_membership: '{name} became a {level} member',
    supporter_recurring: '{name} started monthly support',
    social_title: 'Follow me',
    social_x_aria: 'X (Twitter)',
    social_instagram_aria: 'Instagram',

    game_stoneage_title: 'Stone Age',
    game_stoneage_desc: 'Automa with two modes: community solo variant (César Augusto Borja) and Official survival Solo Mode.',
    game_hoth_title: 'Star Wars: Legion — Battle of Hoth',
    game_hoth_desc: '"Holocron Commander" — a tactical decision assistant to run the automated opponent in Battle of Hoth scenarios.',
    game_heroscape_title: 'Heroscape',
    game_heroscape_desc: 'Automated Battle Analyzer (solo system by Scott Campbell) for solo battles.',
    game_mysticvale_title: 'Mystic Vale',
    game_mysticvale_desc: 'Official "Nemesis" solo mode, created by John D. Clair.',
    game_mick_title: 'Rock Hard: 1977',
    game_mick_desc: 'Adaptation of Mick "baseballbuzz"\'s solo variant for one-player mode.',
    game_trv_title: 'Thunder Road: Vendetta',
    game_trv_desc: 'Bot for AI-controlled rival vehicles, including the Big Rig (SDBR) and Final Five (SDFF) expansions.',
    game_utek_title: 'Ultra Tiny Epic Kingdoms',
    game_utek_desc: 'Two modes: community solo variant and the rulebook\'s Official Solo Mode, with the action "Compass".',
    game_cafebaras_title: 'Café Baras',
    game_cafebaras_desc: '"Capybot" — an automated opponent with its own decision tree, more strategic than the simple fan variant.',
    game_arknova_title: 'Ark Nova',
    game_arknova_desc: '"ARNO" Automa — a dice-driven opponent with action cards, created by Andre K.',
    game_sanctuary_title: 'Sanctuary',
    game_sanctuary_desc: 'Solo Automa with mechanics adapted from Ark Nova\'s ARNO.',
    game_eleven_title: 'Eleven',
    game_eleven_desc: 'Procedural campaign generator and match solver for tabletop football teams.',
    game_memoir44_title: "Memoir '44",
    game_memoir44_desc: '"Command HQ" — tactical decision assistant for the 17 WWII scenarios, including D-Day and the Battle of the Bulge.',
    game_burgundy_title: 'Castles of Burgundy',
    game_burgundy_desc: '"AutoDuque" Automa — automated opponent with building priority control.',
    game_airlandsea_title: 'Air, Land & Sea',
    game_airlandsea_desc: 'Unofficial Automa with Autonomous and Semiautonomous modes, and card priority references.',
    game_7wd_title: '7 Wonders Duel',
    game_7wd_desc: 'Automa Duelist — face 5 historical Leaders driven by the official decision card deck.',

    credits_title: 'Credits',
    back_link: 'Back to bots',
    credits_author_heading: 'Author',
    credits_author_html: 'Made by <strong>Thiago Colletes de Carvalho</strong>, with AI assistance (Gemini / GitHub Copilot) for implementation. Questions, suggestions or fixes are very welcome by e-mail.',
    credits_games_heading: 'Per-game credits',
    credits_legal_heading: 'Copyright and usage',
    credits_legal_html: 'These apps are <strong>unofficial companion tools</strong>, made by a fan for personal, non-commercial use. Each game mentioned is the property of its respective creators/publishers — the apps do not include full rules, card text, or any protected material from the original games, only the logic needed to run an automated opponent. Rulebooks and PDFs used during development are not included in this repository, out of respect for publishers\' copyrights. Small box-art images for each game are used only for identification purposes. Source code available under the MIT license.',

    credit_stoneage: '<strong>Stone Age</strong> — scoring Automa solo variant created by César Augusto Borja (<a href="https://ludopedia.com.br/usuario/caborja" target="_blank" rel="noopener">Ludopedia</a>); Official Solo Mode translated by Raphael Gurian. Stone Age © Hans im Glück / Z-Man Games.',
    credit_hoth: '<strong>Star Wars: Legion — Battle of Hoth</strong> — 100% original content, tactics and app by the author. Star Wars: Battle of Hoth © Days of Wonder / Lucasfilm Ltd.',
    credit_heroscape: '<strong>Heroscape</strong> — based on the "Automated Battle Analyzer", a solo system created by Scott Campbell. Heroscape © Hasbro / Milton Bradley.',
    credit_mysticvale: '<strong>Mystic Vale</strong> — based on the official "Nemesis" mode rules, designed by John D. Clair. Mystic Vale © Alderac Entertainment Group (AEG).',
    credit_mick: '<strong>Rock Hard: 1977</strong> — based on the mod created by <a href="https://boardgamegeek.com/profile/baseballbuzz" target="_blank" rel="noopener">baseballbuzz</a>.',
    credit_trv: '<strong>Thunder Road: Vendetta</strong> — based on the official game (and Big Rig/Final Five expansions) by Restoration Games, and on the bot system created by <a href="https://boardgamegeek.com/profile/mayrik" target="_blank" rel="noopener">Padey Mayrik</a>.',
    credit_utek: '<strong>Ultra Tiny Epic Kingdoms</strong> — based on the <a href="https://gjjgames.blogspot.com/" target="_blank" rel="noopener">GJJ Games</a> fan solo variant for Tiny Epic Kingdoms. Ultra Tiny Epic Kingdoms © Gamelyn Games.',
    credit_cafebaras: '<strong>Café Baras</strong> — original decision tree by the author, inspired by the community\'s "Capybot" concept and David Turczi\'s automa design style. Café Baras designed by Roberta Taylor, © 2024 KTBG (Kids Table Board Gaming), Brazilian version by Ludofun.',
    credit_arknova: '<strong>Ark Nova</strong> — based on the "ARNO" automa, created by Andre K. Ark Nova © Feuerland Spiele / Capstone Games.',
    credit_sanctuary: '<strong>Sanctuary</strong> — automa adapted from Ark Nova\'s "ARNO". Sanctuary © Capstone Games.',
    credit_eleven: '<strong>Eleven</strong> — 100% original content and app by the author. Eleven © Portal Games.',
    credit_memoir44: '<strong>Memoir \'44</strong> — 100% original content, tactics and app by the author. Scenario content also referenced the unofficial "Western Front Scenario Compilation" by Derek "Whaleyland" Whaley. Memoir \'44 designed by Richard Borg, © Days of Wonder.',
    credit_burgundy: '<strong>Castles of Burgundy</strong> — "AutoDuque" fan solo variant by LENS. Castles of Burgundy © Ravensburger.',
    credit_spacebase: '<strong>Space Base</strong> — "Joanna" Automa is an unofficial fan solo variant from BGG. Base Attack assistant inspired by solo rules. Space Base © AEG.',
    credit_airlandsea: '<strong>Air, Land & Sea</strong> — Automa based on the original solo rules designed by <a href="https://boardgamegeek.com/profile/I_2orLess_I" target="_blank" rel="noopener">I_2orLess_I</a>. Air, Land & Sea © Arcane Wonders.',
    credit_7wd: '<strong>7 Wonders Duel</strong> — based on the official solo mode (free P&P expansion). 7 Wonders Duel © Repos Production, designed by Antoine Bauza and Bruno Cathala.',

    tools_title: 'Tools',
    tools_desc: 'Generic utilities for any board game, with no game-specific rules.',
    tool_dice_title: 'Dice Roller',
    tool_dice_desc: 'Roll multiple dice (d4 to d100) at once.',
    tool_pointcounter_title: 'Point Counter',
    tool_pointcounter_desc: 'Players, scoring criteria, a play timer and a first-player picker.',
  }
};

function S(){ return SITE_I18N[localStorage.getItem(LANG_KEY) || 'pt']; }

function applySiteI18n(){
  const lang = localStorage.getItem(LANG_KEY) || 'pt';
  document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en';
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (S()[key] !== undefined) el.textContent = S()[key];
  });
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const key = el.getAttribute('data-i18n-html');
    if (S()[key] !== undefined) el.innerHTML = S()[key];
  });
  document.querySelectorAll('[data-i18n-aria]').forEach(el => {
    const key = el.getAttribute('data-i18n-aria');
    if (S()[key] !== undefined) el.setAttribute('aria-label', S()[key]);
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (S()[key] !== undefined) el.setAttribute('placeholder', S()[key]);
  });
  document.querySelectorAll('[data-i18n-href]').forEach(el => {
    const key = el.getAttribute('data-i18n-href');
    if (S()[key] !== undefined) el.setAttribute('href', S()[key]);
  });
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
}

function setSiteLang(lang){
  localStorage.setItem(LANG_KEY, lang);
  applySiteI18n();
  window.dispatchEvent(new CustomEvent('boardbots:langchange', { detail: { lang } }));
}

document.addEventListener('DOMContentLoaded', applySiteI18n);
