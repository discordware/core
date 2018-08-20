const Sharder = require('../src/index').Master;
const path = require('path');

let sharder = new Sharder('test', path.join(__dirname, 'main.js'), {
    name: 'Travis CLI',
    stats: true,
    clusters: 2,
    shards: 4,
    debug: true
});

sharder.on('stats', stats => {
    console.log(stats)
});

setTimeout(() => {
    process.exit();
}, 1000 * 30);
