const fs = require('fs');
const html = fs.readFileSync('bots/space_base_bot_v1.html', 'utf8');
const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
if (scriptMatch) {
    fs.writeFileSync('.agents/test.js', scriptMatch[1]);
}
