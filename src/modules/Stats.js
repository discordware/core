class Stats {
    constructor(options, communication, logger) {
        this.options = options;
        this.communication = communication;
        this.logger = logger;
        this.metrics = {};
        this.collector = {};
    }

    init() {
        return Promise.resolve();
    }

    addMetric(name, method, type) {
        this.metrics[name] = {
            method,
            type,
            enabled: true
        };
    }

    disableMetric(name) {
        this.metrics[name].enabled = false;
    }
}

module.exports = Stats;