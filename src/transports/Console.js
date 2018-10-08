const chalk = require('chalk');
const Jethro = require('jethro');

class Console {
    constructor(options) {
        this.options = {
            debug: false,
            error: true,
            info: true,
            warn: true
        };

        Object.assign(this.options, options);
    }

    fixTime(time) {
        return time < 10 ? `0${time}` : `${time}`;
    }

    getTime() {
        let time = new Date();
        let day = time.getDate();
        let month = time.getMonth() + 1;
        let year = time.getFullYear();
        let seconds = this.fixTime(time.getSeconds());
        let minutes = this.fixTime(time.getMinutes());
        let hours = this.fixTime(time.getHours());

        return `[${chalk.yellow(day)}${chalk.cyan('/')}${chalk.yellow(month)}${chalk.cyan('/')}${chalk.yellow(year)} ${chalk.yellow(hours)}${chalk.cyan(':')}${chalk.yellow(minutes)}${chalk.cyan(':')}${chalk.yellow(seconds)}]`;
    }

    format(text, color) {
        return color(text);
    }

    init() {
        Jethro.transports.console.getTimestamp = this.getTime.bind(this);
        return Promise.resolve();
    }

    debug(data) {
        if (this.options.debug) {
            let message = this.format(data.msg, chalk.blueBright);
            let source = this.format(data.src, chalk.cyanBright);
            Jethro.debug(source, message);
        }
    }

    error(data) {
        if (this.options.error) {
            let message = this.format(data.msg, chalk.redBright);
            let source = this.format(data.src, chalk.cyanBright);
            Jethro.error(source, message);
        }
    }

    info(data) {
        if (this.options.info) {
            let message = this.format(data.msg, chalk.magentaBright);
            let source = this.format(data.src, chalk.cyanBright);
            Jethro.info(source, message);
        }
    }

    log(data) {
        this.info(data);
    }

    warn(data) {
        if (this.options.warn) {
            let message = this.format(data.msg, chalk.yellowBright);
            let source = this.format(data.src, chalk.cyanBright);
            Jethro.warn(source, message);
        }
    }
}

module.exports = Console;