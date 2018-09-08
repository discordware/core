const chalk = require('chalk');
const Jethro = require('jethro');

class Console extends Jethro {
    constructor(options) {
        super();
        this.options = options;
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
        return Promise.resolve();
    }

    debug(data) {
        if (this.options.debug) {
            let message = this.format(data.msg, chalk.blueBright);
            let source = this.format(data.src, chalk.cyanBright);
            super.debug(source, message);
        }
    }

    error(data) {
        if (this.options.error) {
            let message = this.format(data.msg, chalk.redBright);
            let source = this.format(data.src, chalk.cyanBright);
            super.error(source, message);
        }
    }

    info(data) {
        if (this.options.info) {
            let message = this.format(data.msg, chalk.magentaBright);
            let source = this.format(data.src, chalk.cyanBright);
            super.info(source, message);
        }
    }

    log(data) {
        this.info(data);
    }

    warn(data) {
        if (this.options.warn) {
            let message = this.format(data.msg, chalk.yellowBright);
            let source = this.format(data.src, chalk.cyanBright);
            super.warn(source, message);
        }
    }
}

module.exports = Console;