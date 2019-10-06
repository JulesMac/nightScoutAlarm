
const config = require('./Config').nsMonitor;



const moment = require('moment');

const nsMonitor = function (nightScout, logFactory){



  const log = logFactory.createLogger("main").log;
  const alartSound = './alarm.m4a';

  const alarm = require("./local_modules/Alarm")(alartSound,logFactory);


  function periodicCheck() {
    nightScout.getSgData(3)
      .then(data =>{
        log("sample:" + moment(new Date(data.lastTimestamp)).format("DD-MM HH:mm:ss") + ", average:" + data.mean.toFixed(1) + ", last: "+ data.sgSamples[0].toFixed(1));
        if (data.mean < config.thresholdLow)
          alarm.triggerAlarm(config.snoozeTimeForLow)
        else if (data.mean > config.thresholdHigh)
          alarm.triggerAlarm(config.snoozeTimeForHigh)
      })
      .catch(error => {
        log(error);
      });

  }

  setInterval(periodicCheck, config.nightScoutPollFrequency);

  return {
    snooze: alarm.snooze
  }
}

module.exports = nsMonitor;
