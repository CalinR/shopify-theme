const fs = require('fs');
const path = require('path');
const configPath = 'config.json';
const config = fs.existsSync(configPath) ? JSON.parse(fs.readFileSync(configPath, 'utf8')) : null;
const Shopify = require('shopify-api-node');
const ProgressBar = require('progress');

module.exports = function(){
    if(!config) return console.error('no config file found');
    shopify = new Shopify({
        shopName: config.shop.split('.myshopify.com')[0],
        apiKey: config.apiKey,
        password: config.password,
        autoLimit: true
    });

    const files = getFiles('./');

    const bar = new ProgressBar('[uploading]: :current / :total [:bar] :percent', {
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

            const request = {
                key: path,
                value: data
            }

            // console.log(request);

            shopify.asset.update(config.themeId, request).then(() => {
                if (bar.complete) {
                    console.log('\ncomplete\n');
                }
                else {
                    bar.tick();
                }
            }).catch((error) => {
                if (bar.complete) {
                    return console.log('\ncomplete\n');
                }
                else {
                    bar.tick();
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