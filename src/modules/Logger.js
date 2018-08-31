class Logger {
    constructor() {
        this.transports = [];
    }

    init() {
        return Promise.all(this.transports.map(async transport => {
            if (typeof transport.init === 'function') {
                await transport.init();
            }
        }));
    }

    registerTransport(transport) {
        this.transports.push(transport);
    }

    debug(data) {
        this.transports.forEach(transport => {
            transport.debug(data);
        });
    }

    error(data) {
        this.transports.forEach(transport => {
            transport.error(data);
        });
    }

    info(data) {
        this.transports.forEach(transport => {
            transport.info(data);
        });
    }

    log(data) {
        this.transports.forEach(transport => {
            transport.log(data);
        });
    }

    warn(data) {
        this.transports.forEach(transport => {
            transport.warn(data);
        });
    }
}

module.exports = Logger;