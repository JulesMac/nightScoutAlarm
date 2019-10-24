import {Audio} from "../Audio/app" //(audioFile, logFactory);
import {Logger, LogFactory} from "../BufferedLog/app"
import {Time} from "../Time/app"



export class Alarm{
  readonly audioPlayer : Audio
  readonly log : (message: string) => void; 
  isSnoozed = false;
  snoozeTime = 0;
  snoozeStartTime : Date = new Date(); // not a suitable start  **************
  maxAlarmPlayTime  = 300000;

  constructor(audioFile : string, logFactory: LogFactory){
    this.audioPlayer = new Audio(audioFile, logFactory)
    this.log = logFactory.createLogger("alarm").log;
    this.log("Alarm initialised")
  }


  triggerAlarm(timeToSnooze: number) {
    let log = this.log
    if(!this.isSnoozed){
      if(this.audioPlayer.play()){
        //startPlaying();
        setTimeout(() => {
          //Only play alarm sound for fixed amount of time (after this the alarm can be repeated)
          log("alarm play timed out")
          this.audioPlayer.stop()
        }, this.maxAlarmPlayTime);
        this.snoozeTime = timeToSnooze;
      }
    }
  }


  snooze = () => {
      if(!this.isSnoozed){
        this.audioPlayer.stop();
        this.isSnoozed = true;
        this.snoozeStartTime = Time.now();
        setTimeout(() =>{
          this.log("Snooze ended");
          this.isSnoozed = false;
        }, this.snoozeTime);
        this.log("Set snooze timer")
      }
    }
  }
