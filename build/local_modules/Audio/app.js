"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tree_kill_1 = __importDefault(require("tree-kill"));
const moment_1 = __importDefault(require("moment"));
const play_sound_1 = __importDefault(require("play-sound"));
function isQuietTime(timeStamp) {
    const quietStartHour = 9;
    const quietEndHour = 20;
    const currentHour = parseFloat(timeStamp.format("HH"));
    return (currentHour >= quietStartHour) && (currentHour <= quietEndHour);
}
class Audio {
    constructor(audioFile, logFactory) {
        this.player = play_sound_1.default({});
        this.isPlaying = false;
        this.audioProcess = undefined;
        this.audioFile = audioFile;
        this.log = logFactory.createLogger("audio").log;
        this.log("Audio initialised");
    }
    play() {
        const currentTime = moment_1.default();
        const self = this;
        if (!this.isPlaying) {
            if (!isQuietTime(currentTime)) {
                this.log("StartPlaying...");
                this.isPlaying = true;
                //-o alsa requird to work on my Pi
                this.audioProcess = this.player.play(this.audioFile, { omxplayer: ['-o', 'alsa'] }, function (err) {
                    if (err) {
                        self.log("Error what attempting to use Audio player: " + err);
                        return false;
                    }
                    else
                        return true;
                });
                return true;
            }
            else {
                this.log("Alarm in quiet time:" + currentTime.format("HH:mm:ss"));
                return false;
            }
        }
        else {
            this.log("Already playing alarm");
            return false;
        }
    }
    stop() {
        if (this.isPlaying) {
            this.log("stop Playing...");
            this.isPlaying = false;
            this.log("kill process - " + this.audioProcess.pid);
            tree_kill_1.default(this.audioProcess.pid);
        }
    }
}
exports.Audio = Audio;
