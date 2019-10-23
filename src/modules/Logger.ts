import { IJSON, ILog, ILogger } from '../typings';

export interface ITransport {
    init(): Promise<void>;
    debug(data: IJSON);
    error(data: IJSON);
    info(data: IJSON);
    log(data: IJSON);
    warn(data: IJSON);
}

/**
 *
 *
 * @class Logger
 * @interface
 */
export class Logger implements ILogger {
    private transports: { [name: string]: ITransport };
    private started: boolean;

    /**
     * Creates an instance of Logger.
     * @memberof Logger
     */
    constructor() {
        this.transports = {};
        this.started = false;
    }

    /**
     * Initiate the logger module
     *
     * @returns {Promise<void>} Resolves once the logger and all transports are initiated
     * @memberof Logger
     */
    public init(): Promise<void[]> {
        return Promise.all(Object.keys(this.transports).map(key => {
            let transport = this.transports[key];

            if (typeof transport.init === 'function') {
                return transport.init();
            } else {
                return Promise.resolve();
            }
        }));
    }

    /**
     * Register a new logging transport
     *
     * @param {String} name The unique name of the transport
     * @param {Transport} transport The transport class
     * @returns {void}
     * @memberof Logger
     */
    public async registerTransport(name: string, transport: ITransport): Promise<void> {
        if (!this.started) {
            this.transports[name] = transport;
        } else {
            if (typeof transport.init === 'function') {
                await transport.init();
            }

            this.transports[name] = transport;
        }
    }

    /**
     * Log a debug
     *
     * @param {Object} data The log object
     * @param {String} data.src The source of the log
     * @param {*} data.msg The log message
     * @returns {void}
     * @memberof Logger
     */
    public debug(data: ILog) {
        Object.keys(this.transports).forEach(key => {
            let transport = this.transports[key];

            transport.debug(data);
        });
    }

    /**
     * Log an error
     *
     * @param {Object} data The log object
     * @param {String} data.src The source of the log
     * @param {*} data.msg The log message
     * @returns {void}
     * @memberof Logger
     */
    public error(data: ILog) {
        Object.keys(this.transports).forEach(key => {
            let transport = this.transports[key];

            transport.error(data);
        });
    }

    /**
     * Log some info
     *
     * @param {Object} data The log object
     * @param {String} data.src The source of the log
     * @param {*} data.msg The log message
     * @returns {void}
     * @memberof Logger
     */
    public info(data: ILog) {
        Object.keys(this.transports).forEach(key => {
            let transport = this.transports[key];

            transport.info(data);
        });
    }

    /**
     * Default log
     *
     * @param {Object} data The log object
     * @param {String} data.src The source of the log
     * @param {*} data.msg The log message
     * @returns {void}
     * @memberof Logger
     */
    public log(data: ILog) {
        Object.keys(this.transports).forEach(key => {
            let transport = this.transports[key];

            transport.log(data);
        });
    }

    /**
     * Log a warning
     *
     * @param {Object} data The log object
     * @param {String} data.src The source of the log
     * @param {*} data.msg The log message
     * @returns {void}
     * @memberof Logger
     */
    public warn(data: ILog) {
        Object.keys(this.transports).forEach(key => {
            let transport = this.transports[key];

            transport.warn(data);
        });
    }
}

export default Logger;
