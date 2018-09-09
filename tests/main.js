const Base = require('../index').Base;
class Main extends Base {
    constructor(bot) {
        super(bot);
    }

    launch() {
        console.log('Launched');
    }
}

module.exports = Main;