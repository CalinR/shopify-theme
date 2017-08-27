const fs = require('fs');
const path = require('path');
const getConfig = require('./getConfig.js');
let config = null;
const Shopify = require('shopify-api-node');
const ProgressBar = require('progress');
const isBinaryFile = require("isbinaryfile");

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

    const files = getFiles('./');

    const bar = new ProgressBar(`[${ config.environment }]: :current / :total [:bar] :percent`, {
        complete: '=',
        incomplete: '-',
        width: 75,
        total: files.length
    })

    files.forEach(path => {
        fs.readFile(path, 'utf8', (err, data) => {
            if(err) {
                return console.log(err);
            }
            if(data.length==0){
                bar.tick();
                return true;
            }
            let request = {
                key: path
            }
            if(isBinaryFile.sync(path)){
                request.attachment = data.toString('base64')
            }
            else {
                request.value = data;
            }

            shopify.asset.update(config.themeId, request).then(() => {
                bar.tick();
                
                if (bar.complete) {
                    console.log('\ncomplete\n');
                    process.exit();
                }
            }).catch((error) => {
                bar.tick();
                
                if (bar.complete) {
                    console.log('\ncomplete\n');
                    process.exit();
                }
                // console.log(error, path);
            });      
        });
    })
}


/* ==================================================
    # Get Files
      * Get all files in current directory
      * Ignore files in root of current directory
================================================== */
function getFiles(dir){
    return fs.readdirSync(dir)
        .reduce((files, file) => {
            const currentPath = path.join(dir, file);
            if(fs.statSync(currentPath).isDirectory()){
                return files.concat(getFiles(currentPath));
            }
            else if(dir !== './') {
                return files.concat(currentPath);
            }
            else {
                return files;
            }
        }, []);
}