
/**
 *
 *
 * @class Logger
 * @interface
 */
class Logger {

    
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
    init() {
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
    async registerTransport(name, transport) {
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
    debug(data) {
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
    error(data) {
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
    info(data) {
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
    log(data) {
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
    warn(data) {
        Object.keys(this.transports).forEach(key => {
            let transport = this.transports[key];

            transport.warn(data);
        });
    }
}

module.exports = Logger;