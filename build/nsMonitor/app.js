"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("../local_modules/Alarm/app");
const app_2 = __importDefault(require("../Config/app"));
const moment_1 = __importDefault(require("moment"));
class NsMonitor {
    constructor(nightScout, logFactory) {
        this.config = app_2.default.nsMonitor;
        this.alartSound = './alarm.m4a';
        this.nightScout = nightScout;
        this.alarm = new app_1.Alarm(this.alartSound, logFactory);
        this.log = logFactory.createLogger("main").log;
        setInterval(this.periodicCheck, this.config.nightScoutPollFrequency);
    }
    periodicCheck() {
        this.nightScout.getSgData(3)
            .then(data => {
            //log("debug:" + JSON.stringify(data));
            this.log("sample:" + moment_1.default(new Date(data.lastTimestamp)).format("DD-MM HH:mm:ss") + ", average:" + data.mean.toFixed(1) + ", last: " + data.sgSamples[2].toFixed(1));
            if (data.mean < this.config.thresholdLow)
                this.alarm.triggerAlarm(this.config.snoozeTimeForLow);
            else if (data.mean > this.config.thresholdHigh)
                this.alarm.triggerAlarm(this.config.snoozeTimeForHigh);
        })
            .catch(error => {
            this.log(error);
        });
    }
    snooze() {
        this.alarm.snooze;
    }
}
exports.NsMonitor = NsMonitor;
