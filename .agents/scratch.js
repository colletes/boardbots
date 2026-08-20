const fs = require('fs');

const activeBots = [
    "bots/space_base_bot_v1.html",
    "bots/burgundy_bot_v1.html",
    "bots/stone_age_bot_v2.html",
    "bots/Colletes-hoth_bot_RC8.html",
    "bots/Heroscape_bot_v2.html",
    "bots/Mystic_Vale_bot_v03.html",
    "bots/mick_bot_RC3.html",
    "bots/Colletes-bot-trv-RC2.html",
    "bots/utek_bot_v2.html",
    "bots/cafe_baras_bot_v1.html",
    "bots/arknova_arno_bot_v1.html",
    "bots/sanctuary_bot_v2.html",
    "bots/eleven_bot_v1.html",
    "bots/memoir44_bot_v3.html"
];

for (const file of activeBots) {
    if (!fs.existsSync(file)) continue;
    let html = fs.readFileSync(file, 'utf8');

    // Remove old inline logger if present
    const inlineLoggerRegex = /<!-- DEBUG LOGGER -->[\s\S]*?<button onclick="showLogs\(\)"[^>]*>🐛 LOGS<\/button>/;
    html = html.replace(inlineLoggerRegex, '');

    // Inject new logger script just before </head> or at top of <body>
    if (!html.includes('assets/logger.js')) {
        if (html.includes('<head>')) {
            html = html.replace('</head>', '    <script src="../assets/logger.js"></script>\n</head>');
        } else {
            html = html.replace('<body', '<script src="../assets/logger.js"></script>\n<body');
        }
    }
    
    fs.writeFileSync(file, html);
    console.log('Injected logger into ' + file);
}
