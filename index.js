const Sharder = require('./src/Sharder');

Object.assign(Sharder, {
    // Base: require('./src/cluster/Base.js'),
    Modules: {
        Alerts: require('./src/modules/Alerts'),
        Clustering: require('./src/modules/Clustering'),
        Communication: require('./src/modules/Communication'),
        Configuration: require('./src/modules/Configuration'),
        Logger: require('./src/modules/Logger'),
        Queue: require('./src/modules/Queue'),
        Registry: require('./src/modules/Registry'),
        Sharding: require('./src/modules/Sharding'),
        Stats: require('./src/modules/Stats')
    },
    Transports: {
        Console: require('./src/transports/Console')
    },
    Destinations: {
        Discord: require('./src/destinations/Discord')
    }
});

module.exports = Sharder;