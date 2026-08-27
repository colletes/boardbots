import re

with open('bots/lostcities.html', 'r', encoding='utf-8') as f:
    content = f.read()

footer_html = """
    <div class="credits">
        <img src="../assets/art/lostcities.webp" alt="Lost Cities">
        <div class="credits-text" data-i18n-html="creditsText"></div>
    </div>
    
    <div class="bmc-inline">
        <a href="https://www.buymeacoffee.com/colletes" target="_blank" rel="noopener" aria-label="Buy me a coffee">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h13a2 2 0 0 1 2 2v1a3 3 0 0 1-3 3h-1"/><path d="M4 8h13v6a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V8Z"/><path d="M8 3c-.6 1 .5 1.6 0 3M12 3c-.6 1 .5 1.6 0 3"/></svg>
            <span data-i18n="bmcBtn">Me pague um café</span>
        </a>
    </div>

    <div style="text-align: center; margin: 20px auto 40px auto; width: 100%;">
        <a href="../index.html" class="btn-home">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M9 21v-6h6v6"/></svg>
            <span data-i18n="homeBtn">Home</span>
        </a>
    </div>
"""

# Replace the first <script> block at the end (the one for the game logic)
content = content.replace("<script>\n// --- I18N DICTIONARY ---", footer_html + "\n<script>\n// --- I18N DICTIONARY ---")

with open('bots/lostcities.html', 'w', encoding='utf-8') as f:
    f.write(content)

