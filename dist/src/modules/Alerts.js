"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 *
 *
 * @class Alerts
 * @interface
 */
class Alerts {
    /**
     * Creates an instance of Alerts.
     *
     * @memberof Alerts
     */
    constructor() {
        this.destinations = {};
        this.started = false;
    }
    /**
     * Initiate the Alert class
     *
     * @returns {Promise<void>} Resolves when the Alert module and all destinations are initiated
     * @memberof Alerts
     */
    init() {
        this.started = true;
        return Promise.all(Object.keys(this.destinations).map(key => {
            let destination = this.destinations[key];
            if (typeof destination.init === 'function') {
                return destination.init();
            }
            else {
                return Promise.resolve();
            }
        }));
    }
    /**
     * Register a new alert destination
     *
     * @param {Destination} destination The Destination class to register
     * @return {void}
     * @memberof Alerts
     */
    registerDestination(name, destination) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.started) {
                this.destinations[name] = destination;
            }
            else {
                if (typeof destination.init === 'function') {
                    yield destination.init();
                }
                this.destinations[name] = destination;
            }
        });
    }
    /**
     * Send a new alert
     *
     * @param data The alert payload
     * @returns Resolves once the alert has been sent
     * @memberof Alerts
     */
    alert(data) {
        Object.keys(this.destinations).forEach(key => {
            let destination = this.destinations[key];
            destination.alert(data);
        });
        return Promise.resolve();
    }
}
exports.Alerts = Alerts;
exports.default = Alerts;
