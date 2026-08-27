import urllib.parse
import urllib.request
import os

api_key = os.popen("sed -n '2p' tools/trello.env").read().strip()
token = os.popen("sed -n '8p' tools/trello.env").read().strip()
card_id = "6a8f310e583732ffdc0d5486"

desc = """**Lord of the Rings: Duel for Middle-earth - Bot Solo (Automa)**

**Visão Geral:**
Implementação da variante solo para o jogo The Lord of the Rings: Duel for Middle-earth. O bot atua como um companheiro digital completo que substitui o baralho físico de decisões e gerencia as regras do adversário (Líder).

**Funcionalidades Implementadas e Otimizadas:**
- **Seleção de Líderes:** Os 9 líderes disponíveis (incluindo promo *Eowyn's Stew*). Habilidades integradas na interface, cor prioritária (visualização correta da ordem de prioridade), símbolos de turno extra e dificuldades.
- **Baralho de Decisão Virtual:** As 12 cartas simuladas com acionamento perfeito de turnos extras e recarga automática do baralho (reshuffle).
- **Painel de Controle e Trackers Otimizados:** 
  - Contadores de Capítulo, Moedas e Fortalezas. A ordem de prioridade das cartas destaca apenas as cores ativas/aplicáveis.
  - Zoom fluído nas cartas e nos retratos do líder via Hover.
  - Modal de ajuda corrigido.
- **Rastreamento de Supremacia e Fichas de Aliança:** 
  - **Supremacia (Apoio das Raças):** Tracker dedicado para os 7 símbolos de raça (incluindo **Águias**). Contagem em tempo real (X/6) que aciona um alerta automático de derrota instantânea ao atingir a condição de vitória.
  - **Fichas de Aliança (Lembretes):** Guia de referência estilo *accordion*. Cada Ficha exibe perfeitamente suas regras passivas através de **Ícones Customizados em HTML/CSS** (réplicas fiéis dos ícones do manual original), eliminando a dependência do manual físico para traduzir textos.
- **Dado 3D Responsivo:** Implementação robusta do `@3d-dice/dice-box` com "Dice Tray" fixo e invisível no canto inferior esquerdo. Feedback visual de texto ("🎲 Rolando...") adicionado para evitar sensação de travamento. Web Worker CORS corrigido, escala massiva 12, e Failsafe Global de 3 segundos para modo off-line/erros.
- **Save State Robusto:** Garantida compatibilidade retroativa ao recarregar partidas salvas e tradução PT/EN persistente.
- **Assets Visuais:** Retratos e cartas devidamente croppados."""

data = urllib.parse.urlencode({'desc': desc}).encode('utf-8')
url = f"https://api.trello.com/1/cards/{card_id}?key={api_key}&token={token}"

req = urllib.request.Request(url, data=data, method='PUT')
try:
    with urllib.request.urlopen(req) as response:
        print(response.read().decode('utf-8'))
except urllib.error.HTTPError as e:
    print(e.read().decode('utf-8'))
