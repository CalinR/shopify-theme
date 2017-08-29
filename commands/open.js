const fs = require('fs');
const opn = require('opn');
const getConfig = require('../helpers/getConfig.js');
let config = null;

module.exports = function(env){
    config = getConfig(env);
    if(!config){
        process.exit();
    }
    opn(`http://${ config.shop }?preview_theme_id=${ config.themeId }`);
    process.exit();
}