const Sharder = require('./src/sharding/clustermanager.js');
const Base = require('./src/structures/Base.js');

module.exports = {
    Master: Sharder,
    Base: Base
};