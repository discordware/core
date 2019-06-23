import { ILog, ITransport, ITransportOptions } from '../typings';

import chalk from 'chalk';
import * as jethro from 'jethro';

export class Console implements ITransport {
    public name: string;
    private options: ITransportOptions;

    constructor(options: ITransportOptions) {
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

    public fixTime(time) {
        return time < 10 ? `0${time}` : `${time}`;
    }

    public getTime() {
        let time = new Date();
        let day = time.getDate();
        let month = time.getMonth() + 1;
        let year = time.getFullYear();
        let seconds = this.fixTime(time.getSeconds());
        let minutes = this.fixTime(time.getMinutes());
        let hours = this.fixTime(time.getHours());

        return `[${chalk.yellow(day.toString())}${chalk.cyan('/')}${chalk.yellow(month.toString())}${chalk.cyan('/')}${chalk.yellow(year.toString())} ${chalk.yellow(hours)}${chalk.cyan(':')}${chalk.yellow(minutes)}${chalk.cyan(':')}${chalk.yellow(seconds)}]`;
    }

    public format(text, color) {
        return color(text);
    }

    public init() {
        jethro.transports.console.getTimestamp = this.getTime.bind(this);
        return Promise.resolve();
    }

    public debug(data: ILog) {
        if (this.options.debug) {
            let message = this.format(data.msg, chalk.blueBright);
            let source = this.format(data.src, chalk.cyanBright);
            jethro.debug(source, message);
        }
    }

    public error(data: ILog) {
        if (this.options.error) {
            let message = this.format(data.msg, chalk.redBright);
            let source = this.format(data.src, chalk.cyanBright);
            jethro.error(source, message);
        }
    }

    public info(data: ILog) {
        if (this.options.info) {
            let message = this.format(data.msg, chalk.magentaBright);
            let source = this.format(data.src, chalk.cyanBright);
            jethro.info(source, message);
        }
    }

    public log(data: ILog) {
        this.info(data);
    }

    public warn(data: ILog) {
        if (this.options.warn) {
            let message = this.format(data.msg, chalk.yellowBright);
            let source = this.format(data.src, chalk.cyanBright);
            jethro.warn(source, message);
        }
    }
}

export default Console;
