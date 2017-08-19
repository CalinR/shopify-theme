const fs = require('fs');

const defaultConfig = {
    "shop": "shop.myshopify.com",
    "themeId": "123456789",
    "apiKey": "apikey",
    "password": "password",
    "checkFrequency": 60
};

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
        }
    });
}