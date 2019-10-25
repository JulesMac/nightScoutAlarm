"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("../Config/config"));
const moment_1 = __importDefault(require("moment"));
const time_1 = require("./time");
class Logger {
    constructor(sink, component) {
        this.log = (message) => {
            this.sink.addEvent(this.component, message);
        };
        this.component = (component == undefined) ? "<Undefined>" : component;
        this.sink = sink;
    }
}
exports.Logger = Logger;
class Event {
    constructor(time, component, message) {
        this.time = time;
        this.component = component;
        this.message = message;
    }
}
class LogFactory {
    constructor() {
        this.config = config_1.default.logger;
        this.logSize = this.config.logSize;
        this.end = 0;
        this.events = [];
        this.addEvent("logger", "Log size: " + this.logSize);
    }
    getEvents() {
        var results = [];
        var i;
        for (i = this.end; i < this.events.length; i++) {
            const event = this.events[i];
            results.push(event);
        }
        for (i = 0; i < this.end; i++) {
            const event = this.events[i];
            results.push(event);
        }
        return results;
    }
    eventToString(event) {
        return event.time + " - " + event.component + " - " + event.message;
    }
    getEventsAsStrings() {
        return this.getEvents().map(this.eventToString);
    }
    addEvent(component, msg) {
        const event = new Event(moment_1.default(time_1.Time.now()).format("YYYY MM DD HH:mm:ss"), component, msg);
        if (this.events.length < this.logSize)
            this.events.push(event);
        else
            this.events[this.end] = event;
        this.end = this.end + 1;
        if (this.end == this.logSize)
            this.end = 0;
        console.log(this.eventToString(event));
    }
    createLogger(component) {
        return new Logger(this, component);
    }
}
exports.LogFactory = LogFactory;
