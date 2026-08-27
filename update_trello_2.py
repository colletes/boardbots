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
  - Contadores de Capítulo, Moedas, Fortalezas e Símbolos de Raça. A ordem de prioridade das cartas destaca apenas as cores ativas/aplicáveis (resolvido bug de CSS).
  - Zoom fluído nas cartas e nos retratos do líder via Hover.
  - Modal de ajuda corrigido (exibindo os líderes de LotR: Duel, não do 7WD).
- **Dado 3D Responsivo:** Implementação robusta do `@3d-dice/dice-box` com "Dice Tray" fixo e invisível no canto inferior esquerdo (evitando bugs de manipulação do DOM e sumiço do canvas). Web Worker CORS corrigido, `assetPath` sincronizado via unpkg, dados massivos (escala 12) e Failsafe Global de 3 segundos para modo off-line/erros.
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
