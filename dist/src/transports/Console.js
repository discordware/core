"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = require("chalk");
const jethro_1 = require("jethro");
class Console {
    constructor(options) {
        this.name = 'console';
        this.options = {
            debug: false,
            error: true,
            info: true,
            log: true,
            warn: true,
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
        return `[${chalk_1.default.yellow(day.toString())}${chalk_1.default.cyan('/')}${chalk_1.default.yellow(month.toString())}${chalk_1.default.cyan('/')}${chalk_1.default.yellow(year.toString())} ${chalk_1.default.yellow(hours)}${chalk_1.default.cyan(':')}${chalk_1.default.yellow(minutes)}${chalk_1.default.cyan(':')}${chalk_1.default.yellow(seconds)}]`;
    }
    format(text, color) {
        return color(text);
    }
    init() {
        jethro_1.default.transports.console.getTimestamp = this.getTime.bind(this);
        return Promise.resolve();
    }
    debug(data) {
        if (this.options.debug) {
            let message = this.format(data.msg, chalk_1.default.blueBright);
            let source = this.format(data.src, chalk_1.default.cyanBright);
            jethro_1.default.debug(source, message);
        }
    }
    error(data) {
        if (this.options.error) {
            let message = this.format(data.msg, chalk_1.default.redBright);
            let source = this.format(data.src, chalk_1.default.cyanBright);
            jethro_1.default.error(source, message);
        }
    }
    info(data) {
        if (this.options.info) {
            let message = this.format(data.msg, chalk_1.default.magentaBright);
            let source = this.format(data.src, chalk_1.default.cyanBright);
            jethro_1.default.info(source, message);
        }
    }
    log(data) {
        this.info(data);
    }
    warn(data) {
        if (this.options.warn) {
            let message = this.format(data.msg, chalk_1.default.yellowBright);
            let source = this.format(data.src, chalk_1.default.cyanBright);
            jethro_1.default.warn(source, message);
        }
    }
}
exports.default = Console;
