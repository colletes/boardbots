#!/usr/bin/env python3
"""
generate_review_gallery.py
Gera uma galeria visual em HTML para acompanhar a planilha Excel de revisão.
Permite visualizar a imagem de cada carta, cada tile e cada raça lado a lado com suas ações.
"""

import os
import json

BOTS_DIR = "/Users/thiagocarvalho/Documents/Board games/boardbots"
CARDS_JSON = os.path.join(BOTS_DIR, "assets/art/seti/cards_data.json")
OUTPUT_HTML = os.path.join(BOTS_DIR, "tools/seti_review_gallery.html")

def main():
    with open(CARDS_JSON, "r", encoding="utf-8") as f:
        cards_data = json.load(f)

    html_content = """<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SETI — Galeria Visual de Apoio à Revisão</title>
  <link rel="stylesheet" href="../assets/theme-kit.css">
  <style>
    :root {
      --bg: #070b14;
      --card-bg: #121927;
      --border: #23324d;
      --cyan: #00e5ff;
      --amber: #ffb703;
      --text: #f1f5f9;
      --muted: #94a3b8;
    }
    body {
      background: var(--bg);
      color: var(--text);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      margin: 0;
      padding: 24px;
    }
    .header {
      max-width: 1400px;
      margin: 0 auto 24px;
      padding-bottom: 16px;
      border-bottom: 1px solid var(--border);
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 16px;
    }
    .header h1 {
      font-size: 1.5rem;
      margin: 0;
      color: var(--cyan);
      letter-spacing: 0.05em;
    }
    .header p {
      margin: 4px 0 0;
      color: var(--muted);
      font-size: 0.9rem;
    }
    .tab-bar {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      margin-bottom: 24px;
      max-width: 1400px;
      margin-left: auto;
      margin-right: auto;
    }
    .tab-btn {
      background: var(--card-bg);
      border: 1px solid var(--border);
      color: var(--text);
      padding: 8px 16px;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 600;
      font-size: 0.9rem;
      transition: all 0.2s;
    }
    .tab-btn.active, .tab-btn:hover {
      background: rgba(0, 229, 255, 0.15);
      border-color: var(--cyan);
      color: var(--cyan);
    }
    .gallery-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(420px, 1fr));
      gap: 20px;
      max-width: 1400px;
      margin: 0 auto;
    }
    .item-card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 10px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      box-shadow: 0 4px 12px rgba(0,0,0,0.4);
    }
    .item-header {
      background: #182235;
      padding: 10px 16px;
      font-weight: 700;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid var(--border);
    }
    .item-header .tag {
      font-size: 0.75rem;
      padding: 2px 8px;
      border-radius: 4px;
      background: rgba(255, 183, 3, 0.2);
      color: var(--amber);
    }
    .item-body {
      padding: 16px;
      display: flex;
      gap: 16px;
      align-items: flex-start;
      flex: 1;
    }
    .item-img {
      width: 130px;
      flex-shrink: 0;
      border-radius: 6px;
      border: 1px solid rgba(255,255,255,0.1);
      background: #000;
    }
    .item-details {
      flex: 1;
      font-size: 0.85rem;
    }
    .action-row {
      margin-bottom: 8px;
      padding-bottom: 8px;
      border-bottom: 1px dashed rgba(255,255,255,0.1);
    }
    .action-row:last-child {
      margin-bottom: 0;
      padding-bottom: 0;
      border-bottom: none;
    }
    .action-num {
      display: inline-block;
      width: 20px;
      height: 20px;
      line-height: 20px;
      text-align: center;
      border-radius: 50%;
      background: var(--cyan);
      color: #070b14;
      font-weight: 800;
      font-size: 0.75rem;
      margin-right: 6px;
    }
    .action-title {
      font-weight: 700;
      color: #e2e8f0;
    }
    .action-desc {
      color: #cbd5e1;
      margin-top: 3px;
      line-height: 1.35;
    }
    .tab-content {
      display: none;
    }
    .tab-content.active {
      display: block;
    }
  </style>
</head>
<body>

  <div class="header">
    <div>
      <h1>SETI — Galeria Visual de Apoio à Revisão</h1>
      <p>Use esta galeria ao lado da planilha Excel <code>SETI_Revisao_Rival_Cartas_Tiles_Racas.xlsx</code> para conferir as artes reais e validar as ações.</p>
    </div>
  </div>

  <div class="tab-bar">
    <button class="tab-btn active" onclick="showTab('tab-cards')">Cartas de Ação (15)</button>
    <button class="tab-btn" onclick="showTab('tab-tiles-1')">Tiles Nível I (4)</button>
    <button class="tab-btn" onclick="showTab('tab-tiles-2')">Tiles Nível II (11)</button>
    <button class="tab-btn" onclick="showTab('tab-tiles-3')">Tiles Nível III (9)</button>
    <button class="tab-btn" onclick="showTab('tab-tiles-lt')">Tiles Longo Prazo (3)</button>
    <button class="tab-btn" onclick="showTab('tab-species')">Efeitos de Raça (8)</button>
  </div>
"""

    # Tab 1: Cards
    html_content += '\n<div id="tab-cards" class="tab-content active"><div class="gallery-grid">\n'
    card_order = [f"S.{i:02d}" for i in range(1, 15)] + ["S.EXP1"]
    for c_id in card_order:
        c = cards_data.get(c_id, {})
        arrow = "Esquerda (←)" if c.get("arrow") == "left" else "Direita (→)"
        img_src = f"../assets/art/seti/cards/{c_id}.webp"
        c_type = "Básica" if c.get("type") == "basic" else ("Avançada" if c.get("type") == "advanced" else "Expansão")
        
        actions_html = ""
        for a in c.get("actions", []):
            actions_html += f"""
            <div class="action-row">
              <span class="action-num">{a.get('num')}</span>
              <span class="action-title">{a.get('titlePt')}</span>
              <div class="action-desc">{a.get('descPt')}</div>
            </div>"""

        html_content += f"""
        <div class="item-card">
          <div class="item-header">
            <span>{c_id} — {c_type}</span>
            <span class="tag">{arrow}</span>
          </div>
          <div class="item-body">
            <img class="item-img" src="{img_src}" alt="{c_id}">
            <div class="item-details">{actions_html}</div>
          </div>
        </div>"""
    html_content += "</div></div>\n"

    # Tab 2: Tiles Nivel I
    html_content += '\n<div id="tab-tiles-1" class="tab-content"><div class="gallery-grid">\n'
    for i in range(1, 5):
        t_id = f"OBJ-I-{i:02d}"
        img_src = f"../assets/art/seti/objectives/obj_I_{i:02d}.webp"
        html_content += f"""
        <div class="item-card">
          <div class="item-header">
            <span>{t_id} (Nível I)</span>
            <span class="tag">Jogo Base</span>
          </div>
          <div class="item-body">
            <img class="item-img" style="width: 140px; height: 140px; object-fit: contain;" src="{img_src}" alt="{t_id}">
            <div class="item-details">
              <p><strong>Arquivo:</strong> obj_I_{i:02d}.webp</p>
              <p><strong>Penalidade R1-R4:</strong> +3 progresso por tile faltante.</p>
              <p><strong>Fim de Jogo (R5):</strong> +5 PV por tile não concluído.</p>
              <p style="color:var(--amber);"><em>Revise os símbolos na planilha Excel.</em></p>
            </div>
          </div>
        </div>"""
    html_content += "</div></div>\n"

    # Tab 3: Tiles Nivel II
    html_content += '\n<div id="tab-tiles-2" class="tab-content"><div class="gallery-grid">\n'
    for i in range(1, 12):
        t_id = f"OBJ-II-{i:02d}"
        img_src = f"../assets/art/seti/objectives/obj_II_{i:02d}.webp"
        html_content += f"""
        <div class="item-card">
          <div class="item-header">
            <span>{t_id} (Nível II)</span>
            <span class="tag">Intermediário</span>
          </div>
          <div class="item-body">
            <img class="item-img" style="width: 140px; height: 140px; object-fit: contain;" src="{img_src}" alt="{t_id}">
            <div class="item-details">
              <p><strong>Arquivo:</strong> obj_II_{i:02d}.webp</p>
              <p><strong>Penalidade R1-R4:</strong> +3 progresso por tile faltante.</p>
              <p><strong>Fim de Jogo (R5):</strong> +5 PV por tile não concluído.</p>
              <p style="color:var(--amber);"><em>Revise os símbolos na planilha Excel.</em></p>
            </div>
          </div>
        </div>"""
    html_content += "</div></div>\n"

    # Tab 4: Tiles Nivel III
    html_content += '\n<div id="tab-tiles-3" class="tab-content"><div class="gallery-grid">\n'
    for i in range(1, 10):
        t_id = f"OBJ-III-{i:02d}"
        img_src = f"../assets/art/seti/objectives/obj_III_{i:02d}.webp"
        html_content += f"""
        <div class="item-card">
          <div class="item-header">
            <span>{t_id} (Nível III)</span>
            <span class="tag">Avançado</span>
          </div>
          <div class="item-body">
            <img class="item-img" style="width: 140px; height: 140px; object-fit: contain;" src="{img_src}" alt="{t_id}">
            <div class="item-details">
              <p><strong>Arquivo:</strong> obj_III_{i:02d}.webp</p>
              <p><strong>Penalidade R1-R4:</strong> +3 progresso por tile faltante.</p>
              <p><strong>Fim de Jogo (R5):</strong> +5 PV por tile não concluído.</p>
              <p style="color:var(--amber);"><em>Revise os símbolos na planilha Excel.</em></p>
            </div>
          </div>
        </div>"""
    html_content += "</div></div>\n"

    # Tab 5: Long Term
    html_content += '\n<div id="tab-tiles-lt" class="tab-content"><div class="gallery-grid">\n'
    for i in range(1, 4):
        t_id = f"OBJ-LT-{i:02d}"
        img_src = f"../assets/art/seti/objectives/long_term_{i:02d}.webp"
        html_content += f"""
        <div class="item-card">
          <div class="item-header">
            <span>{t_id} (Longo Prazo)</span>
            <span class="tag">Expansão</span>
          </div>
          <div class="item-body">
            <img class="item-img" style="width: 160px; height: 110px; object-fit: contain;" src="{img_src}" alt="{t_id}">
            <div class="item-details">
              <p><strong>Arquivo:</strong> long_term_{i:02d}.webp</p>
              <p><strong>Regra:</strong> 3 tarefas no total. Removido sem reposição quando completo.</p>
              <p><strong>Penalidade R2-R4:</strong> +1 progresso por tarefa não concluída visível.</p>
              <p><strong>Fim de Jogo:</strong> NÃO pontua PV no final da partida.</p>
            </div>
          </div>
        </div>"""
    html_content += "</div></div>\n"

    # Tab 6: Species
    html_content += '\n<div id="tab-species" class="tab-content"><div class="gallery-grid">\n'
    species_list = [
        ("Mascamitas", "species_mascamitas", "Jogo Base"),
        ("Anomalias", "species_anomalias", "Jogo Base"),
        ("'Oumuamua", "species_oumuamua", "Jogo Base"),
        ("Centaurianos", "species_centaurianos", "Jogo Base"),
        ("Exertianos", "species_exertianos", "Jogo Base"),
        ("Ameba", "species_amoeba", "Expansão Agências Espaciais"),
        ("Arkhos", "species_arkhos", "Expansão Agências Espaciais"),
        ("Glifídios", "species_glyphids", "Expansão Agências Espaciais")
    ]
    for s_name, s_id, s_origin in species_list:
        c = cards_data.get(s_id, {})
        arrow = "Esquerda (←)" if c.get("arrow") == "left" else "Direita (→)"
        img_src = f"../assets/art/seti/cards/{s_id}.webp"
        
        actions_html = ""
        for a in c.get("actions", []):
            actions_html += f"""
            <div class="action-row">
              <span class="action-num">{a.get('num')}</span>
              <span class="action-title">{a.get('titlePt')}</span>
              <div class="action-desc">{a.get('descPt')}</div>
            </div>"""

        html_content += f"""
        <div class="item-card">
          <div class="item-header">
            <span>{s_name} ({s_origin})</span>
            <span class="tag">{arrow}</span>
          </div>
          <div class="item-body">
            <img class="item-img" src="{img_src}" alt="{s_name}">
            <div class="item-details">{actions_html}</div>
          </div>
        </div>"""
    html_content += "</div></div>\n"

    html_content += """
  <script>
    function showTab(tabId) {
      document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
      document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
      document.getElementById(tabId).classList.add('active');
      event.target.classList.add('active');
    }
  </script>
</body>
</html>
"""

    with open(OUTPUT_HTML, "w", encoding="utf-8") as f:
        f.write(html_content)
    print("Galeria HTML gerada com sucesso em:", OUTPUT_HTML)

if __name__ == "__main__":
    main()
