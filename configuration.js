const fs = require('fs');
const defaultConfig = `{
    "shop": "shop.myshopify.com",
    "apiKey": "apikey-goes-here",
    "password": "password goes here"
}`;

module.exports = function() {
    fs.writeFile("config.json", defaultConfig, function(err) {
        if(err) {
            return console.log(err);
        }

        console.log("Configuration file created");
    });
}