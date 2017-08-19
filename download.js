const pad = require('pad');
const fs = require('fs');
const configPath = 'config.json';
const config = fs.existsSync(configPath) ? JSON.parse(fs.readFileSync(configPath, 'utf8')) : null;
const Shopify = require('shopify-api-node');
const prompt = require('prompt-sync')();
const configuration = require('./configuration.js');
let themeList = [];
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

    getTheme().then((theme) => downloadTheme(theme))
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

    updateConfig(theme.id);

    return theme.id;
}

/* ==================================================
    # Download Theme
      * downloads theme files
================================================== */
function downloadTheme(theme){
    console.log('download', theme);
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
