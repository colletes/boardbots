with open('bots/lostcities.html', 'r', encoding='utf-8') as f:
    content = f.read()

i18n_code = """
function i18n(key) {
  const lang = localStorage.getItem('boardbots_lang') || 'pt';
  return I18N[lang][key] || key;
}

function applyI18n() {
  const lang = localStorage.getItem('boardbots_lang') || 'pt';
  document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en';
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const k = el.getAttribute('data-i18n');
    if (I18N[lang][k] !== undefined) el.textContent = I18N[lang][k];
  });
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const k = el.getAttribute('data-i18n-html');
    if (I18N[lang][k] !== undefined) el.innerHTML = I18N[lang][k];
  });
}

window.addEventListener('boardbots:langchange', applyI18n);

setTimeout(applyI18n, 100);
"""

# replace the setTimeout at the bottom
import re
content = re.sub(r'setTimeout\(\(\) => \{ if\(typeof applyI18n === \'function\'\) applyI18n\(\); \}, 100\);', i18n_code, content)

with open('bots/lostcities.html', 'w', encoding='utf-8') as f:
    f.write(content)
