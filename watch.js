const fs = require('fs');
const chokidar = require('chokidar');
const configPath = 'config.json';
const config = fs.existsSync(configPath) ? JSON.parse(fs.readFileSync(configPath, 'utf8')) : null;
const Shopify = require('shopify-api-node');
const isBinaryFile = require("isbinaryfile");
let shopify;
const watcher = chokidar.watch('.', {
    persistent: true,
    ignoreInitial: true
});

module.exports = function(){
    if(!config) return console.error('no config file found');
    shopify = new Shopify({
        shopName: config.shop.split('.myshopify.com')[0],
        apiKey: config.apiKey,
        password: config.password,
        autoLimit: true
    });

    console.log('Watching for file changes');

    watcher
        .on('add', addFile)
        .on('change', updateFile)
        .on('unlink', removeFile)
}

function addFile(path){
    if(hasSubpath(path) && !isHiddenFile(path)){
        const encoding = isBinaryFile.sync(path) ? 'base64' : 'utf8';

        fs.readFile(path, encoding, (err, data) => {
            if(err) {
                return console.log(err);
            }
            let request = {
                key: path
            }
            if(encoding == 'base64'){
                request.attachment = data.toString('base64')
            }
            else {
                request.value = data;
            }
            shopify.asset.create(config.themeId, request).then(() => {
                console.log(`Successfully performed Create operation for ${ path }`);
            }).catch((error) => {
                console.log(error);
            });
        });
    }
}

function updateFile(path){
    if(hasSubpath(path) && !isHiddenFile(path)){
        const encoding = isBinaryFile.sync(path) ? 'base64' : 'utf8';

        fs.readFile(path, encoding, (err, data) => {
            if(err) {
                return console.log(err);
            }
            let request = {
                key: path
            }
            if(encoding == 'base64'){
                request.attachment = data.toString('base64')
            }
            else {
                request.value = data;
            }
            shopify.asset.update(config.themeId, request).then(() => {
                console.log(`Successfully performed Update operation for ${ path }`);
            }).catch((error) => {
                console.log(error);
            });
        });
    }
}

function removeFile(path){
    if(hasSubpath(path)){
        const query = {
            asset: {
                key: path
            }
        }

        shopify.asset.delete(config.themeId, query).then(() => {
            console.log(`Successfully performed Delete operation for ${ path }`);
        }).catch((error) => {
            console.log(error);
        });
    }
}

function hasSubpath(path){
    return path.split('/').length > 1;
}

function isHiddenFile(path){
    const parts = path.split('/');
    const filename = parts[parts.length-1];
    const firstChar = filename.split('')[0];
    return firstChar == '.';
}