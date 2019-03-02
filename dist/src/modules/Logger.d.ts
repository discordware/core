import { IJSON, ILog, ILogger } from '../typings';
export interface ITransport {
    init(): Promise<void>;
    debug(data: IJSON): any;
    error(data: IJSON): any;
    info(data: IJSON): any;
    log(data: IJSON): any;
    warn(data: IJSON): any;
}
/**
 *
 *
 * @class Logger
 * @interface
 */
export default class Logger implements ILogger {
    private transports;
    private started;
    /**
     * Creates an instance of Logger.
     * @memberof Logger
     */
    constructor();
    /**
     * Initiate the logger module
     *
     * @returns {Promise<void>} Resolves once the logger and all transports are initiated
     * @memberof Logger
     */
    init(): Promise<void[]>;
    /**
     * Register a new logging transport
     *
     * @param {String} name The unique name of the transport
     * @param {Transport} transport The transport class
     * @returns {void}
     * @memberof Logger
     */
    registerTransport(name: string, transport: ITransport): Promise<void>;
    /**
     * Log a debug
     *
     * @param {Object} data The log object
     * @param {String} data.src The source of the log
     * @param {*} data.msg The log message
     * @returns {void}
     * @memberof Logger
     */
    debug(data: ILog): void;
    /**
     * Log an error
     *
     * @param {Object} data The log object
     * @param {String} data.src The source of the log
     * @param {*} data.msg The log message
     * @returns {void}
     * @memberof Logger
     */
    error(data: ILog): void;
    /**
     * Log some info
     *
     * @param {Object} data The log object
     * @param {String} data.src The source of the log
     * @param {*} data.msg The log message
     * @returns {void}
     * @memberof Logger
     */
    info(data: ILog): void;
    /**
     * Default log
     *
     * @param {Object} data The log object
     * @param {String} data.src The source of the log
     * @param {*} data.msg The log message
     * @returns {void}
     * @memberof Logger
     */
    log(data: ILog): void;
    /**
     * Log a warning
     *
     * @param {Object} data The log object
     * @param {String} data.src The source of the log
     * @param {*} data.msg The log message
     * @returns {void}
     * @memberof Logger
     */
    warn(data: ILog): void;
}
