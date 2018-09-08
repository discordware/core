class Registry {
    constructor() {
        this._store = {};
    }

    register(key, value) {
        this._store[key] = value;
    }

    deregister(key) {
        delete this._store[key];
    }

    get(key) {
        return this._store[key];
    }
}

module.exports = Registry;