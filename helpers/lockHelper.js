const fs = require('fs');
const lockPath = 'shopifytheme.lock';
let lockFile = fs.existsSync(lockPath) ? JSON.parse(fs.readFileSync(lockPath, 'utf8')) : {};

const lockHelper = {
    update: function(env, assets){
        if(!lockFile[env]){
            lockFile[env] = {};
        }

        assets = assets.filter((asset) => {
            if(lockFile[env] && lockFile[env][asset.key]){
                const serverDate = Date.parse(lockFile[env][asset.key]);
                const localDate = Date.parse(asset.updated_at);
                if(localDate > serverDate){
                    return true;
                }
                return false;
            }
            else {
                return true;
            }
        })

        assets.forEach((asset) => {
            lockFile[env][asset.key] = asset.updated_at;
        })

        fs.writeFileSync(lockPath, JSON.stringify(lockFile, null, '\t'));

        return assets;
    }
}

module.exports = lockHelper;