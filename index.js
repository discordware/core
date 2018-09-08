const Sharder = require('./src/Sharder');

Object.assign(Sharder, {
    Base: require('./src/structures/Base.js'),
    Modules: {
        Clustering: require('./src/modules/Clustering'),
        Communication: require('./src/modules/Communication'),
        Logger: require('./src/modules/Logger'),
        Notification: require('./src/modules/Alerts'),
        Sharding: require('./src/modules/Sharding'),
        Stats: require('./src/modules/Stats')
    },
    Transports: {
        Console: require('./src/transports/Console')
    },
    Destinations: {

    }
});

module.exports = Sharder;