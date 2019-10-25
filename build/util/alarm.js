"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const audio_1 = require("./audio"); //(audioFile, logFactory);
const time_1 = require("./time");
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
                this.snoozeStartTime = time_1.Time.now();
                setTimeout(() => {
                    this.log("Snooze ended");
                    this.isSnoozed = false;
                }, this.snoozeTime);
                this.log("Set snooze timer");
            }
        };
        this.audioPlayer = new audio_1.Audio(audioFile, logFactory);
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
