import re

with open('bots/lostcities.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Let's extract the entire script section to rewrite the I18N blocks cleanly.
# We will wipe out ALL Object.assign(I18N.pt) and Object.assign(I18N.en) calls.
# And replace them with a single clean block at the end.

# Regex to match all Object.assign blocks
content = re.sub(r'Object\.assign\(I18N\.pt, \{.*?\}\);', '', content, flags=re.DOTALL)
content = re.sub(r'Object\.assign\(I18N\.en, \{.*?\}\);', '', content, flags=re.DOTALL)

# Now we inject the complete, clean dictionaries right after window.I18N initialization
clean_i18n = """
Object.assign(I18N.pt, {
  lc_title: "The Rival Explorer",
  lc_subtitle: "Lost Cities — Automa",
  lc_setup_head: "Preparação",
  lc_setup_1: "Embaralhe as 60 cartas. Dê 8 para você.",
  lc_setup_2: "O bot NÃO tem mão. Ele compra direto do baralho.",
  lc_setup_3: "Quando o bot comprar uma carta (ou pegar do descarte), informe a carta aqui para ver o que ele faz!",
  lc_diff_head: "Dificuldade",
  
  lc_diff_easy: "Fácil",
  lc_diff_easy_desc: "Joga de forma inteligente, mas sem regra de substituir/adicionar.",
  lc_diff_medium: "Médio",
  lc_diff_medium_desc: "Substitui a carta se a nova for exatamente 1 valor menor (Regra Variante).",
  lc_diff_hard: "Difícil",
  lc_diff_hard_desc: "Mantém a carta e adiciona se for até 2 valores menor (Sem substituir).",
  lc_diff_gods: "Desafio dos Deuses",
  lc_diff_gods_desc: "Trapaceia: joga toda carta recebida fora de ordem.",
  
  lc_start: "Iniciar Partida",
  lc_mode_title: "Modo de Jogo",
  lc_mode_automa: "Solo vs Automa",
  lc_mode_calc: "Apenas Calculadora (Multiplayer)",
  lc_rounds_title: "Duração da Partida",
  lc_rounds_1: "1 Rodada",
  lc_rounds_3: "Melhor de 3",
  lc_end_round: "Terminar Rodada",
  lc_calc_title: "Calculadora",
  lc_round: "Rodada",
  lc_confirm: "Confirmar Pontuação",
  lc_summary_title: "Resumo da Partida",
  lc_total_label: "Total",
  lc_next_round: "Próxima Rodada",
  lc_final_btn: "Voltar à Tela Inicial",
  lc_p1_wins_automa: "Você Venceu o Automa! 🎉",
  lc_p2_wins_automa: "O Automa Venceu! 🤖",
  lc_p1_wins_multi: "Jogador 1 Venceu! 🏆",
  lc_p2_wins_multi: "Jogador 2 Venceu! 🏆",
  lc_tie: "Empate! 🤝",
  lc_player: "Jogador",
  lc_log_title: "Histórico de Ações:",
  
  lc_res_play_title: "JOGAR NA EXPEDIÇÃO",
  lc_res_play_desc: "Coloque a carta na expedição do bot.",
  lc_res_discard_title: "DESCARTAR",
  lc_res_discard_desc: "O bot não quer essa carta. Coloque-a no descarte.",
  lc_res_replace_title: "SUBSTITUIR CARTA",
  lc_res_replace_desc: "Descarte a carta mais alta e coloque a nova na expedição no lugar dela!",
  lc_ok: "Entendido",
  
  wantedPanelText: "O Automa compra do <strong>BARALHO</strong>, exceto se o <strong>DESCARTE</strong> tiver:",
  wantedNone: "Nenhuma (Sempre baralho)",
  resetBtn: "🔄 Nova Partida",
  resetConfirm: "Apagar progresso e iniciar nova partida?",
  bmcBtn: "Me pague um café",
  homeBtn: "← Home",
  
  heroTitle: "The Rival Explorer",
  heroSubtitle: "Lost Cities — Automa",
  helpRulesTitle: "Regras do Automa",
  helpRulesIntro: "Na vez do automa, ele recebe uma carta. Você deve comprá-la e apresentá-la ao app usando os botões abaixo.",
  helpDrawTitle: "Compra (Deck vs Descarte)",
  helpDrawText: "O automa sempre compra do <strong>baralho</strong>, EXCETO se o <strong>descarte</strong> tiver uma das cartas indicadas no painel abaixo do tabuleiro. No nível Difícil ou Deuses, ele também tentará pegar cartas menores para preencher buracos em suas expedições!",
  helpDecisionsTitle: "Decisões (Jogar, Substituir, Descartar)",
  helpDecisionsList: "<li><strong>Fácil:</strong> Joga de forma inteligente, mas não utiliza regras avançadas.</li><li><strong>Médio:</strong> Utiliza a regra variante: substitui a carta mais alta se a comprada for exatamente 1 valor menor.</li><li><strong>Difícil:</strong> Mantém a carta mais alta e adiciona a nova se for até 2 valores menor.</li><li><strong>Deuses Antigos:</strong> O Automa trapaceia! Ele joga todas as cartas que recebe, inserindo-as fora de ordem na expedição.</li>",
  creditsText: "Criado por <strong>Thiago Colletes de Carvalho</strong> (<a href='mailto:colletes@gmail.com'>colletes@gmail.com</a>) — regras da variante originais. Lost Cities criado por Reiner Knizia, © KOSMOS. Uso pessoal e não comercial.",
  c_yellow: "Amarelo", c_blue: "Azul", c_white: "Branco", c_green: "Verde", c_red: "Vermelho"
});

Object.assign(I18N.en, {
  lc_title: "The Rival Explorer",
  lc_subtitle: "Lost Cities — Automa",
  lc_setup_head: "Setup",
  lc_setup_1: "Shuffle the 60 cards. Deal 8 cards to yourself.",
  lc_setup_2: "The bot has NO physical hand. It draws from the deck.",
  lc_setup_3: "When the bot draws a card (or snatches one from the discard), input it here to see what the bot does!",
  lc_diff_head: "Difficulty",
  
  lc_diff_easy: "Easy",
  lc_diff_easy_desc: "Plays smartly, without replacing cards.",
  lc_diff_medium: "Medium",
  lc_diff_medium_desc: "Replaces if the card is exactly 1 value lower (Variant Rule).",
  lc_diff_hard: "Hard",
  lc_diff_hard_desc: "Adds card to expedition if up to 2 values lower (Does not replace).",
  lc_diff_gods: "Challenge of the Gods",
  lc_diff_gods_desc: "The Automa cheats and magically sorts all cards.",
  
  lc_start: "Start Game",
  lc_mode_title: "Game Mode",
  lc_mode_automa: "Solo vs Automa",
  lc_mode_calc: "Calculator Only (Multiplayer)",
  lc_rounds_title: "Match Length",
  lc_rounds_1: "1 Round",
  lc_rounds_3: "Best of 3",
  lc_end_round: "End Round",
  lc_calc_title: "Calculator",
  lc_round: "Round",
  lc_confirm: "Confirm Score",
  lc_summary_title: "Match Summary",
  lc_total_label: "Total",
  lc_next_round: "Next Round",
  lc_final_btn: "Back to Home",
  lc_p1_wins_automa: "You beat the Automa! 🎉",
  lc_p2_wins_automa: "The Automa Wins! 🤖",
  lc_p1_wins_multi: "Player 1 Wins! 🏆",
  lc_p2_wins_multi: "Player 2 Wins! 🏆",
  lc_tie: "It's a Tie! 🤝",
  lc_player: "Player",
  lc_log_title: "Action History:",
  
  lc_res_play_title: "PLAY ON EXPEDITION",
  lc_res_play_desc: "Place the card on the bot's expedition.",
  lc_res_discard_title: "DISCARD",
  lc_res_discard_desc: "The bot doesn't want this card. Discard it.",
  lc_res_replace_title: "REPLACE CARD",
  lc_res_replace_desc: "Discard the highest card and play this new one in its place!",
  lc_ok: "Got it",
  
  wantedPanelText: "The Automa draws from the <strong>DECK</strong>, unless the <strong>DISCARD</strong> pile has:",
  wantedNone: "None (Always deck)",
  resetBtn: "🔄 New Game",
  resetConfirm: "Erase progress and start new game?",
  bmcBtn: "Buy me a coffee",
  homeBtn: "← Home",
  
  heroTitle: "The Rival Explorer",
  heroSubtitle: "Lost Cities — Automa",
  helpRulesTitle: "Automa Rules",
  helpRulesIntro: "On the automa's turn, it receives a card. You must draw it and present it to the app using the buttons below.",
  helpDrawTitle: "Drawing (Deck vs Discard)",
  helpDrawText: "The automa always draws from the <strong>deck</strong>, UNLESS the <strong>discard pile</strong> has one of the specific cards listed in the panel below the board. On Hard or Gods difficulty, it will also try to snipe slightly lower cards to fill gaps in its expeditions!",
  helpDecisionsTitle: "Decisions (Play, Replace, Discard)",
  helpDecisionsList: "<li><strong>Easy:</strong> Plays smartly but does not use advanced rules.</li><li><strong>Medium:</strong> Uses the variant rule: replaces the highest card if the drawn one is exactly 1 value lower.</li><li><strong>Hard:</strong> Keeps the highest card and adds the new one if it is up to 2 values lower.</li><li><strong>Ancient Gods:</strong> The Automa cheats! It plays every card it receives, magically sorting them out of order into its expedition!</li>",
  creditsText: "Made by <strong>Thiago Colletes de Carvalho</strong> (<a href='mailto:colletes@gmail.com'>colletes@gmail.com</a>) — original variant rules. Lost Cities designed by Reiner Knizia, © KOSMOS. Personal, non-commercial use.",
  c_yellow: "Yellow", c_blue: "Blue", c_white: "White", c_green: "Green", c_red: "Red"
});
"""

content = content.replace("window.I18N = window.I18N || { pt: {}, en: {} };", "window.I18N = window.I18N || { pt: {}, en: {} };\n" + clean_i18n)

with open('bots/lostcities.html', 'w', encoding='utf-8') as f:
    f.write(content)

