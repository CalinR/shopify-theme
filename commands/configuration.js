const configHelper = require('../helpers/configHelper.js');

module.exports = () => {
    try {
        configHelper.create();
        console.log('config.json created');
    }
    catch(error){
        console.log(`An error occurred while creating config file\n${ error }`);
    }
    process.exit();
}