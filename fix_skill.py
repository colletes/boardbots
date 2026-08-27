import re

with open(".agents/skills/boardbot-creator/SKILL.md", "r") as f:
    text = f.read()

old_tray = """4. **Mecânica de "Dice Tray" Dinâmico (Restrição de Espaço):**
   - O contêiner HTML do dado deve ser `position: absolute; width: 100%; height: 100%; z-index: 10; pointer-events: none;`.
   - Antes de chamar `diceBox.roll()`, aninhe o `#dice-box` no elemento HTML de destino (`targetEl.appendChild(diceBoxEl)`).
   - Defina o `targetEl.style.position = 'relative'` e `targetEl.style.minHeight = '150px'` para abrir espaço na tela para o "tray".
   - Dispare um evento `resize` para forçar o canvas WebGL a adaptar-se ao contêiner (`window.dispatchEvent(new Event('resize'))`).
   - Limpe o `minHeight` quando o dado terminar de rolar."""

new_tray = """4. **Mecânica de "Dice Tray" Estático (Altamente Recomendado):**
   - Não mova o contêiner do dado (`#dice-box`) dinamicamente no DOM com `appendChild`, pois isso pode causar bugs em UIs reativas ou quando combinado com limpezas de `textContent`.
   - Crie um "Tray" fixo e invisível no canto da tela e insira o `#dice-box` permanentemente dentro dele:
     ```html
     <div id="dice-tray" style="position:fixed; bottom:20px; left:20px; width:180px; height:180px; z-index:9999; pointer-events:none;">
       <div id="dice-box" style="position:absolute; top:0; left:0; width:100%; height:100%; pointer-events:none;"></div>
     </div>
     ```
   - Assim o dado rolará sempre no mesmo local, livre de bugs de renderização."""

text = text.replace(old_tray, new_tray)

with open(".agents/skills/boardbot-creator/SKILL.md", "w") as f:
    f.write(text)
