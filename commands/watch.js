const fs = require('fs');
const chokidar = require('chokidar');
const getConfig = require('../helpers/getConfig.js');
let config = null;
const Shopify = require('shopify-api-node');
const isBinaryFile = require("isbinaryfile");
const notification = require('../helpers/notification.js');
let shopify;
const watcher = chokidar.watch('.', {
    persistent: true,
    ignoreInitial: true
});

module.exports = function(env){
    config = getConfig(env);
    if(!config){
        process.exit();
    }
    shopify = new Shopify({
        shopName: config.shop.split('.myshopify.com')[0],
        apiKey: config.apiKey,
        password: config.password,
        autoLimit: true
    });

    console.log(`[${ config.environment }] Watching for file changes`);

    watcher
        .on('add', addFile)
        .on('change', updateFile)
        .on('unlink', removeFile)
}

function convertToMilliseconds(seconds){
    return seconds * 1000;
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
                const jsonResponse = error.response.body.errors;
                notification.error(`Error uploading ${path}`, jsonResponse.asset[0])
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
                const jsonResponse = error.response.body.errors;
                notification.error(`Error uploading ${path}`, jsonResponse.asset[0])
            })
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