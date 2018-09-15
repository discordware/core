class Alerts {
    constructor() {
        this.destinations = {};
        this.started = false;
    }

    init() {
        this.started = true;

        return Promise.all(Object.keys(this.destinations).map(key => {
            let destination = this.destinations[key];

            if (typeof destination.init === 'function') {
                return destination.init();
            } else {
                return Promise.resolve();
            }
        }));
    }

    async registerDestination(destination) {
        if (!this.started) {
            this.destinations[destination.name] = destination;
        } else {
            if (typeof destination.init === 'function') {
                await destination.init();
            }
            
            this.destinations[destination.name] = destination;
        }
    }

    alert(data) {
        Object.keys(this.destinations).forEach(key => {
            let destination = this.destinations[key];

            destination.alert(data);
        });
    }
}

module.exports = Alerts;