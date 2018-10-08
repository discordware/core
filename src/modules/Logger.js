class Logger {
    constructor() {
        this.transports = {};
        this.started = false;
    }

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

    debug(data) {
        Object.keys(this.transports).forEach(key => {
            let transport = this.transports[key];

            transport.debug(data);
        });
    }

    error(data) {
        Object.keys(this.transports).forEach(key => {
            let transport = this.transports[key];

            transport.error(data);
        });
    }

    info(data) {
        Object.keys(this.transports).forEach(key => {
            let transport = this.transports[key];

            transport.info(data);
        });
    }

    log(data) {
        Object.keys(this.transports).forEach(key => {
            let transport = this.transports[key];

            transport.log(data);
        });
    }

    warn(data) {
        Object.keys(this.transports).forEach(key => {
            let transport = this.transports[key];

            transport.warn(data);
        });
    }
}

module.exports = Logger;