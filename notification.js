const notifier = require('node-notifier');

const notification = {
    error: (title, message) => {
        notifier.notify({
            title,
            message
        })

        console.error(`${ title }. ${ message }`);
    },
    success: (title, message) => {
        notifier.notify({
            title,
            message
        })

        console.log(`${ title }. ${ message }`);
    }
}

module.exports = notification;