class Registry {
    constructor() {
        this._store = {};
    }

    set(key, value) {
        this._store[key] = value;
    }

    delete(key) {
        delete this._store[key];
    }

    get(key) {
        return this._store[key];
    }
}

module.exports = Registry;