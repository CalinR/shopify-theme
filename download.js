const pad = require('pad');
const fs = require('fs');
const configPath = 'config.json';
const config = fs.existsSync(configPath) ? JSON.parse(fs.readFileSync(configPath, 'utf8')) : null;
const Shopify = require('shopify-api-node');
const prompt = require('prompt-sync')();
const ProgressBar = require('progress');
const configuration = require('./configuration.js');
let themeList = [];
let themeId;
let shopify;

/* ==================================================
    # Download
      * Main function
================================================== */
function download(){
    if(!config) return console.error('no config file found');
    shopify = new Shopify({
        shopName: config.shop.split('.myshopify.com')[0],
        apiKey: config.apiKey,
        password: config.password,
        autoLimit: true
    });

    getTheme()
        .then(fetchAssets)
        .then(downloadAssets)
}

/* ==================================================
    # Get Theme
      * fetches list of themes
================================================== */
function getTheme(){
    return new Promise((resolve, reject) => {
        shopify.theme.list().then((data) => {
            themeList = data;
            resolve(validateTheme());
        }).catch((err) => {
            console.log('Invalid api credentials');
            reject();
        });
    });
}

/* ==================================================
    # Validate Theme
      * checks if themeId exists on shop
      * if themeId isn't set or invalid, prompt user
        to choose a theme.
================================================== */
function validateTheme(){
    
    const characters = String(themeList.length).length;

    const description = themeList.map((theme, index) => {
        return `  ${ pad(`${index}.`, characters+2) }${ theme.name }`;
    });

    if(config.themeId){
        if(themeList.find((theme, index) => theme.id == config.themeId)){
            themeId = config.themeId;
            return config.themeId;
        }
        else {
            console.log('  Invalid themeId in config.json\n');
        } 
    }

    console.log(description.join('\n') + '\n');

    let result;

    while(isNaN(result) || result > themeList.length-1){
        result = prompt('What theme would you like to use? ');
    }

    const theme = themeList.find((theme, index) => index == result);

    themeId = theme.id;
    updateConfig(theme.id);

    return theme.id;
}

/* ==================================================
    # Fetch Assets
      * fetches list of assets
================================================== */
function fetchAssets(theme){
    return new Promise((resolve, reject) => {
        shopify.asset.list(theme).then((data) => {
            resolve(data);
        }).catch((err) => {
            console.log('Invalid api credentials');
            reject();
        });
    })
}

/* ==================================================
    # Download Assets
      * download all theme assets
================================================== */
function downloadAssets(assets){
    const fileSize = assets.reduce((total, asset) => {
        return total + asset.size;
    }, 0);

    const bar = new ProgressBar('[downloading]: :current / :total [:bar] :percent', {
        complete: '=',
        incomplete: '-',
        width: 75,
        total: assets.length
    })

    // Get list of all required folders
    const folders = assets.map((asset, index) => {
        return asset.key.split('/')[0]
    }).filter((folder, index, self) => {
        return self.indexOf(folder) === index;
    });

    // Create all required folders
    folders.forEach((folder) => {
        if(!fs.existsSync(folder)){
            fs.mkdirSync(folder);
        }
    })

    // Fetch each asset's contents and write to disk
    assets.forEach((asset) => {
        const query = {
            asset: { key: asset.key },
            theme_id: themeId
        };
        shopify.asset.get(themeId, query)
            .then(data => {
                fs.writeFile(data.key, data.value, 'utf8', function(err) {
                    // downloaded += asset.size;
                });
                if (bar.complete) {
                    console.log('\ncomplete\n');
                }
                else {

                    bar.tick();
                }
            })
    });
}

/* ==================================================
    # Update Config
      * updates config.json file with new theme id
================================================== */
function updateConfig(id){
    const newConfig = Object.assign({}, config, {themeId: id});

    configuration(newConfig);
}


module.exports = download;
