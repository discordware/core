class Alerts {
    constructor() {
        this.destinations = {};
    }

    init() {
        return Promise.all(Object.keys(this.destinations).map(key => {
            let destination = this.destinations[key];

            if (typeof destination.init === 'function') {
                return destination.init();
            } else {
                return Promise.resolve();
            }  
        }));
    }

    registerDestination(destination) {
        this.destinations[destination.name] = destination;
    }

    alert(data) {
        Object.keys(this.destinations).forEach(key => {
            let destination = this.destinations[key];

            destination.alert(data);
        });
    } 
}

module.exports = Alerts;