const fs = require('fs');
const configPath = 'config.json';
const configFile = fs.existsSync(configPath) ? JSON.parse(fs.readFileSync(configPath, 'utf8')) : null;

const getConfig = (env = 'developement') => {
    try {
        if(configFile[env]){
            return Object.assign(configFile[env], {environment: env} );
        }
        else {
            return console.log(`${env} not found in config.json`);
        }
    }
    catch(error){
        return console.log('no config file found');
    }
}

module.exports = getConfig;