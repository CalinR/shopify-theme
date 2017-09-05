const fs = require('fs');
const configPath = 'config.json';
const defaultConfig = require('../defaultConfig.json');
let configFile = fs.existsSync(configPath) ? JSON.parse(fs.readFileSync(configPath, 'utf8')) : null;

const configHelper = {
    create: function(){
        fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, '\t'));
    },
    get: function(env){
        if(configFile[env]){
            return configFile[env];
        }
        else {
            console.log(`no config found for ${ env }`);
            process.exit();
        }
    },
    update: function(env, options){
        const updatedEnv = Object.assign({}, configFile[env], options);
        configFile[env] = updatedEnv;
        fs.writeFileSync(configPath, JSON.stringify(configFile, null, '\t'));
        return configFile[env];
    }
}

module.exports = configHelper;