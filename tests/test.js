const Sharder = require('../index');
const path = require('path');

let sharder = new Sharder('test', path.join(__dirname, 'main.js'), {
    name: 'Travis CLI',
    stats: true,
    shards: 8,
    clusters: 4,
    debug: true
});