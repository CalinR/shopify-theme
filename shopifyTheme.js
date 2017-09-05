const Shopify = require('shopify-api-node');
const prompt = require('prompt-sync')();
const pad = require('pad');
const configHelper = require('./helpers/configHelper.js');
const lockHelper = require('./helpers/lockHelper.js');

class ShopifyTheme {
    constructor(){
        this.env = 'development';
        this.config = {};
        this.shopify = null;
    }

    setEnv(env = 'development'){
        this.env = env;
        try {
            this.config = configHelper.get(env);
        }
        catch(error){
            console.log('no config file found');
            process.exit();
        }
    }

    getAssets(){
        return new Promise((resolve, reject) => {
            try {
                this.shopify = new Shopify({
                    shopName: this.config.shop.split('.myshopify.com')[0],
                    apiKey: this.config.apiKey,
                    password: this.config.password,
                    autoLimit: true
                });
        
                this.shopify.theme.list()
                    .then((data) => this.findActiveTheme(data))
                    .then((theme) => {
                        const updatedEnv = {
                            themeId: theme.id
                        }
                        this.config = configHelper.update(this.env, updatedEnv);
                        return this.shopify.asset.list(this.config.themeId)
                    })
                    .then((assets) => {
                        const newAssets = lockHelper.update(this.env, assets);
                        resolve(newAssets);
                    })
            }
            catch(error){
                console.log('an error occurred while fetching assets.', error);
                reject(error);
                process.exit();
            }
        })
    }

    findActiveTheme(themeList){
        let theme = null;
        
        themeList.forEach((t) => {
            if(t.id == this.config.themeId){
                return theme = t;
            }
        })
    
        return theme ? theme : this.selectTheme(themeList);
    }

    selectTheme(themeList){
        const characters = String(themeList.length).length;
        
        const description = themeList.map((theme, index) => {
            return `  ${ pad(`${index}.`, characters+2) }${ theme.name }${ theme.role == 'main' ? ' (published)' : '' }`;
        });
    
        console.log(description.join('\n') + '\n');
    
        let result;
    
        while(isNaN(result) || result > themeList.length-1){
            result = prompt('What theme would you like to use? ');
        }
    
        const theme = themeList.find((theme, index) => index == result);
    
        return theme;
    }
}

module.exports = ShopifyTheme;