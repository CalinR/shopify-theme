const fs = require('fs');
const configPath = 'config.json';
const config = fs.existsSync(configPath) ? JSON.parse(fs.readFileSync(configPath, 'utf8')) : null;
const Shopify = require('shopify-api-node');
let shopify;

module.exports = function(){
    if(!config) return console.error('no config file found');
    shopify = new Shopify({
        shopName: config.shop.split('.myshopify.com')[0],
        apiKey: config.apiKey,
        password: config.password,
        autoLimit: true
    });

    console.log('Watching for file changes');

    if(fs.existsSync('assets')){
        fs.watch('assets', (eventType, filename) => watchFolder(eventType, filename, 'assets'));
    }
    if(fs.existsSync('config')){
        fs.watch('config', (eventType, filename) => watchFolder(eventType, filename, 'config'));
    }
    if(fs.existsSync('layouts')){
        fs.watch('layouts', (eventType, filename) => watchFolder(eventType, filename, 'layouts'));
    }
    if(fs.existsSync('locales')){
        fs.watch('locales', (eventType, filename) => watchFolder(eventType, filename, 'locales'));
    }
    if(fs.existsSync('snippets')){
        fs.watch('snippets', (eventType, filename) => watchFolder(eventType, filename, 'snippets'));
    }
    if(fs.existsSync('templates')){
        fs.watch('templates', (eventType, filename) => watchFolder(eventType, filename, 'templates'));
    }
}


function watchFolder(eventType, filename, folder){
    switch(eventType){
        case 'rename':
            console.log(`Received Rename event on ${ folder }/${ filename }`);
            break;
        default:
            console.log(`Received Update event on ${ folder }/${ filename }`);
            updateFile(filename, folder);
    }
}

function updateFile(filename, folder){
    fs.readFile(folder + '/' + filename, 'utf8', (err, data) => {
        if(err) {
            return console.log(err);
        }
        const request = {
                "key": folder + '/' + filename,
                "value": data
            }

        shopify.asset.update(config.themeId, request).then(() => {
            console.log(`Successfully performed Update operation for ${ filename }`);
        }).catch((error) => {
            console.log(error);
        });
    });
}