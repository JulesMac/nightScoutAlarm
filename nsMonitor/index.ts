import { LogFactory } from "../local_modules/BufferedLog/app";
import {NightScout, SgResponse} from "../local_modules/NightScout/app"
import {Alarm} from "../local_modules/Alarm/app"
import configRoot from '../Config/app'
import moment from 'moment'

export class NsMonitor{

  private readonly config = configRoot.nsMonitor
  private readonly nightScout : NightScout
  private readonly log : (message: string) => void 
  private readonly alartSound = './alarm.m4a';

  readonly alarm : Alarm

  constructor(nightScout : NightScout, logFactory: LogFactory){
    this.nightScout = nightScout
    this.alarm  = new Alarm(this.alartSound, logFactory);
    this.log = logFactory.createLogger("main").log;
    setInterval(this.periodicCheck, this.config.nightScoutPollFrequency);
  }


  private periodicCheck = () => {
    this.nightScout.getSgData(3)
      .then(data =>{
        //log("debug:" + JSON.stringify(data));
        this.log("sample:" + moment(new Date(data.lastTimestamp)).format("DD-MM HH:mm:ss") + ", average:" + data.mean.toFixed(1) + ", last: "+ data.sgSamples[2].toFixed(1));
        if (data.mean < this.config.thresholdLow)
          this.alarm.triggerAlarm(this.config.snoozeTimeForLow)
        else if (data.mean > this.config.thresholdHigh)
          this.alarm.triggerAlarm(this.config.snoozeTimeForHigh)
      })
      .catch(error => {
        this.log(error);
      });

  }

  snooze = () => {
    this.alarm.snooze()
  }
}
