const colors = require('colors');
colors.setTheme({
    silly: 'rainbow',
    log: 'grey',
    verbose: 'cyan',
    prompt: 'grey',
    info: 'green',
    data: 'grey',
    help: 'cyan',
    warn: 'yellow',
    debug: 'cyan',
    error: 'red'
});

let log = require('fancy-log');

class Logger {
    constructor() {

    }

    log(source, msg) {
        let message = colors.log(msg);
        log(`${source} | ${message}`);
    }

    info(source, msg) {
        let message = colors.info(msg);
        log(`${source} | ${message}`);
    }

    warn(source, msg) {
        let message = colors.warn(msg);
        log(`${source} | ${message}`);
    }

    error(source, msg) {
        let message = colors.error(msg);
        log(`${source} | ${message}`);
    }

    data(source, msg) {
        let message = colors.data(msg);
        log(`${source} | ${message}`);
    }

    debug(source, msg) {
        let message = colors.debug(msg);
        log(`${source} | ${message}`);
    }
}

module.exports = new Logger();