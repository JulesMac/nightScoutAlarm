
import processTreeKill from 'tree-kill'
import moment, { Moment } from 'moment'
import {Logger, LogFactory} from './logger';
import soundPlayer from "play-sound"

function isQuietTime(timeStamp: Moment){
    const quietStartHour = 9
    const quietEndHour = 20
    const currentHour = parseFloat(timeStamp.format("HH"));
    return (currentHour >=quietStartHour) && (currentHour <=quietEndHour)
}

export class Audio{
  readonly audioFile: string
  readonly player = soundPlayer( {})
  private isPlaying : boolean = false;
  private audioProcess : any= undefined;
  private log : (message: string) => void

  constructor(audioFile: string, logFactory: LogFactory){
    this.audioFile = audioFile
    this.log = logFactory.createLogger("audio").log;
    this.log("Audio initialised");
  }


  play() {
    const currentTime = moment();
    const self = this
    if(!this.isPlaying){
      if(!isQuietTime(currentTime)){
        this.log("StartPlaying...");
        this.isPlaying = true;
        //-o alsa requird to work on my Pi
        this.audioProcess = this.player.play(this.audioFile, {omxplayer: ['-o', 'alsa']}, function(err){
          if (err) {
            self.log("Error what attempting to use Audio player: " + err);
            return false;
          }else 
            return true;
        });
        return true;
      }else{
        this.log("Alarm in quiet time:" + currentTime.format("HH:mm:ss"))
        return false;
      }
    }else {
      this.log("Already playing alarm")
      return false;
    }
  }

  stop() {
    if(this.isPlaying){
      this.log("stop Playing...");
      this.isPlaying = false;
      this.log("kill process - " + this.audioProcess.pid);
      processTreeKill(this.audioProcess.pid);
    }
  }

}
