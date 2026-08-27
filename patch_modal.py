import re

with open('bots/lostcities.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add CSS
modal_css = """
/* --- Help Modal --- */
.modal-overlay {
    display:none; position:fixed; inset:0; background:rgba(15,23,42,0.85); z-index:200;
    padding:20px 14px; overflow-y:auto; -webkit-overflow-scrolling:touch;
    align-items:center; justify-content:center;
}
.modal-content {
    background:var(--panel-bg); border:1px solid rgba(255,255,255,0.1); border-radius:12px;
    max-width:600px; margin:auto; padding:24px; position:relative; color:var(--text-muted); line-height: 1.6;
}
.modal-close {
    position:absolute; top:14px; right:14px; width:36px; height:36px;
    border-radius:50%; background:rgba(255,255,255,0.1); border:none; color:#fff;
    font-size:1.2em; cursor:pointer;
}
.modal-content h3 { color:var(--text-main); margin-top:20px; margin-bottom:10px; }
.modal-content h3:first-of-type { margin-top:0; }
.modal-content p { margin: 0 0 12px 0; }
.modal-content ul { margin: 0 0 12px 0; padding-left: 20px; }
.modal-content li { margin-bottom: 6px; }
"""

content = content.replace("</style>", modal_css + "\n</style>")

# 2. Add HTML
modal_html = """
    <!-- Help Modal -->
    <div id="helpModal" class="modal-overlay">
        <div class="modal-content">
            <button class="modal-close" onclick="document.getElementById('helpModal').style.display='none'">✕</button>
            <h3 data-i18n="helpRulesTitle">Regras do Automa</h3>
            <p data-i18n-html="helpRulesIntro">Na vez do automa, ele precisa receber uma carta. Você deve comprá-la e apresentá-la ao app usando os botões.</p>
            
            <h3 data-i18n="helpDrawTitle">Compra (Deck vs Descarte)</h3>
            <p data-i18n-html="helpDrawText">O automa sempre compra a carta do topo do <strong>baralho</strong>, com UMA exceção: se o <strong>descarte</strong> de alguma cor tiver uma carta que seja exatamente <strong>um valor acima</strong> da maior carta do automa naquela cor (ou um Aperto de Mão, se ele não tiver nenhum número), o automa <strong>comprará do descarte</strong>.</p>
            
            <h3 data-i18n="helpDecisionsTitle">Decisões</h3>
            <ul data-i18n-html="helpDecisionsList">
                <li><strong>Jogar:</strong> Se a carta for maior que o topo da coluna, ele joga.</li>
                <li><strong>Substituir:</strong> Se não puder jogar normalmente, mas a carta for pouca coisa menor que o topo da coluna, ele descarta o topo atual e joga a nova no lugar.</li>
                <li><strong>Descartar:</strong> Se não servir para a coluna, a carta vai para o descarte.</li>
            </ul>
        </div>
    </div>
"""

content = content.replace("<script>\n// --- I18N DICTIONARY ---", modal_html + "\n<script>\n// --- I18N DICTIONARY ---")

# 3. Update I18N strings
pt_strings = """
    helpRulesTitle: "Regras do Automa",
    helpRulesIntro: "Na vez do automa, ele recebe uma carta. Você deve comprá-la e apresentá-la ao app usando os botões abaixo.",
    helpDrawTitle: "Compra (Deck vs Descarte)",
    helpDrawText: "O automa sempre compra a carta do topo do <strong>baralho</strong>, com UMA exceção:<br>Se o <strong>descarte</strong> de alguma cor tiver uma carta que seja <strong>exatamente um valor acima</strong> da maior carta do automa naquela cor (ou um Aperto de Mão se ele não tiver números e menos de 3 apertos), o automa <strong>comprará do descarte</strong>.",
    helpDecisionsTitle: "Decisões (Jogar, Substituir, Descartar)",
    helpDecisionsList: "<li><strong>Jogar:</strong> Se a carta for maior que a do topo da expedição, ele joga.</li><li><strong>Substituir:</strong> Dependendo da dificuldade, ele pode descartar a carta do topo e jogar a recém-comprada no lugar (se for apenas 1 ou 2 valores menor que o topo, mas maior que a penúltima carta).</li><li><strong>Descartar:</strong> Se a carta não for útil, ele a descarta.</li>"
"""

en_strings = """
    helpRulesTitle: "Automa Rules",
    helpRulesIntro: "On the automa's turn, it receives a card. You must draw it and present it to the app using the buttons below.",
    helpDrawTitle: "Drawing (Deck vs Discard)",
    helpDrawText: "The automa always draws from the top of the <strong>deck</strong>, with ONE exception:<br>If the <strong>discard pile</strong> of any color has a card that is <strong>exactly one value higher</strong> than the automa's highest card in that color (or a Handshake if it has no numbers and less than 3 handshakes), the automa will <strong>draw from the discard pile</strong> instead.",
    helpDecisionsTitle: "Decisions (Play, Replace, Discard)",
    helpDecisionsList: "<li><strong>Play:</strong> If the card is higher than the top of its expedition, it plays it.</li><li><strong>Replace:</strong> Depending on difficulty, it may discard its top card and play the newly drawn one in its place (if it's only 1 or 2 values lower than the top, but higher than the second-to-top card).</li><li><strong>Discard:</strong> If the card isn't useful, it discards it.</li>"
"""

content = content.replace('creditsText: "Criado por <strong>Thiago Colletes de Carvalho</strong>', pt_strings + ',\n    creditsText: "Criado por <strong>Thiago Colletes de Carvalho</strong>')
content = content.replace('creditsText: "Made by <strong>Thiago Colletes de Carvalho</strong>', en_strings + ',\n    creditsText: "Made by <strong>Thiago Colletes de Carvalho</strong>')

with open('bots/lostcities.html', 'w', encoding='utf-8') as f:
    f.write(content)

