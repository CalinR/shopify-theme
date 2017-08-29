const fs = require('fs');
const lockfilePath = 'shopifytheme.lock';

const updateLockfile = (assets, environment) => {
    let lockfile = getLockfile(environment);
    // console.log('lockfile', assets);
}

const getLockfile = (environment) => {
    if(fs.existsSync(lockfilePath)){
        return JSON.parse(fs.readFileSync(lockfilePath, 'utf8'))
    }
    else {
        return {
            [environment]: []
        }
    }
}

module.exports = updateLockfile;