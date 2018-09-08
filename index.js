const Sharder = require('./src/Sharder');

Object.assign(Sharder, {
    Base: require('./src/structures/Base.js'),
    Modules: {
        Alerts: require('./src/modules/Alerts'),
        Clustering: require('./src/modules/Clustering'),
        Communication: require('./src/modules/Communication'),
        Logger: require('./src/modules/Logger'),
        Notification: require('./src/modules/Alerts'),
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