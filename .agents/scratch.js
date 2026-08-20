const fs = require('fs');
function fixAssetPath(file) {
    let html = fs.readFileSync(file, 'utf8');
    
    // Replace bad asset path with 'assets/'
    html = html.replace(/assetPath:\s*['"]https:\/\/unpkg\.com\/@3d-dice\/dice-box@1\.1\.3\/dist\/assets\/['"]/g, "assetPath: 'assets/'");
    
    fs.writeFileSync(file, html);
    console.log('Fixed assetPath in ' + file);
}

fixAssetPath('bots/space_base_bot_v1.html');
fixAssetPath('bots/burgundy_bot_v1.html');
