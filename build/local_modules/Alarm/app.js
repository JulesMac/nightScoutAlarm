"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("../Audio/app"); //(audioFile, logFactory);
const app_2 = require("../Time/app");
class Alarm {
    constructor(audioFile, logFactory) {
        this.isSnoozed = false;
        this.snoozeTime = 0;
        this.snoozeStartTime = new Date(); // not a suitable start  **************
        this.maxAlarmPlayTime = 300000;
        this.snooze = () => {
            if (!this.isSnoozed) {
                this.audioPlayer.stop();
                this.isSnoozed = true;
                this.snoozeStartTime = app_2.Time.now();
                setTimeout(() => {
                    this.log("Snooze ended");
                    this.isSnoozed = false;
                }, this.snoozeTime);
                this.log("Set snooze timer");
            }
        };
        this.audioPlayer = new app_1.Audio(audioFile, logFactory);
        this.log = logFactory.createLogger("alarm").log;
        this.log("Alarm initialised");
    }
    triggerAlarm(timeToSnooze) {
        let log = this.log;
        if (!this.isSnoozed) {
            if (this.audioPlayer.play()) {
                //startPlaying();
                setTimeout(() => {
                    //Only play alarm sound for fixed amount of time (after this the alarm can be repeated)
                    log("alarm play timed out");
                    this.audioPlayer.stop();
                }, this.maxAlarmPlayTime);
                this.snoozeTime = timeToSnooze;
            }
        }
    }
}
exports.Alarm = Alarm;
