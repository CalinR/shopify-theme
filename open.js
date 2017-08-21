const fs = require('fs');
const opn = require('opn');
const configPath = 'config.json';
const config = fs.existsSync(configPath) ? JSON.parse(fs.readFileSync(configPath, 'utf8')) : null;

module.exports = function(){
    if(!config) return console.error('no config file found');
    opn(`http://${ config.shop }?preview_theme_id=${ config.themeId }`);
    process.exit();
}