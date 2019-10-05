

const snoozeTimeForHigh = 60 * 60 * 1000 ;
const snoozeTimeForLow = 15 * 60 * 1000;
const nightScoutPollFrequency = 10000;

const moment = require('moment');

const nsMonitor = function (nightScout, logFactory){

  const thresholdLow = 4.0;
  const thresholdHigh = 9.0;


  const log = logFactory.createLogger("main").log;
  const alartSound = './alarm.m4a';

  const alarm = require("./local_modules/Alarm")(alartSound,logFactory);


  function periodicCheck() {
    nightScout.getSgData(3)
      .then(data =>{
        log("sample:" + moment(new Date(data.lastTimestamp)).format("DD-MM HH:mm:ss") + ", average:" + data.mean.toFixed(1) + ", last: "+ data.sgSamples[0].toFixed(1));
        if (data.mean < thresholdLow)
          alarm.triggerAlarm(snoozeTimeForLow)
        else if (data.mean > thresholdHigh)
          alarm.triggerAlarm(snoozeTimeForHigh)
      })
      .catch(error => {
        log(error);
      });

  }

  setInterval(periodicCheck, nightScoutPollFrequency);

  return {
    snooze: alarm.snooze
  }
}

module.exports = nsMonitor;
