
/**
 *
 *
 * @class Logger
 * @interface
 */
class Logger {

    /**
     *Creates an instance of Logger.
     * @memberof Logger
     */
    constructor() {
        this.transports = {};
        this.started = false;
    }

    /**
     *
     *
     * @returns
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
     *
     *
     * @param {*} name
     * @param {*} transport
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
     *
     *
     * @param {*} data
     * @memberof Logger
     */
    debug(data) {
        Object.keys(this.transports).forEach(key => {
            let transport = this.transports[key];

            transport.debug(data);
        });
    }

    /**
     *
     *
     * @param {*} data
     * @memberof Logger
     */
    error(data) {
        Object.keys(this.transports).forEach(key => {
            let transport = this.transports[key];

            transport.error(data);
        });
    }

    /**
     *
     *
     * @param {*} data
     * @memberof Logger
     */
    info(data) {
        Object.keys(this.transports).forEach(key => {
            let transport = this.transports[key];

            transport.info(data);
        });
    }

    /**
     *
     *
     * @param {*} data
     * @memberof Logger
     */
    log(data) {
        Object.keys(this.transports).forEach(key => {
            let transport = this.transports[key];

            transport.log(data);
        });
    }

    /**
     *
     *
     * @param {*} data
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