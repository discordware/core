const Eris = require('eris');

class DiscordDestination {
    constructor(token, instanceID, options) {
        this.token = token;
        this.instanceID = instanceID;
        this.options = options;
    }

    init() {
        this.eris = new Eris(this.token);
    }

    alert(data) {
        let { title, msg, date, type } = data;
        let { id, token } = this.options[type];

        this.eris.executeWebhook(id, token, {
            embeds: [
                {
                    title,
                    description: msg,
                    footer: { text: this.instanceID },
                    timestamp: date
                }
            ]
        });
    }
}

module.exports = DiscordDestination;