const fs = require('fs');
const defaultConfig = require('../defaultConfig.json');

module.exports = (config) => {
    config = config || defaultConfig;

    fs.writeFile("config.json", JSON.stringify(config, null, '\t'), function(err) {
        if(err) {
            return console.log(err);
        }

        if(config != defaultConfig){
            console.log('config.json updated');
        }
        else {
            console.log('config.json created');
            process.exit();
        }
    });
}