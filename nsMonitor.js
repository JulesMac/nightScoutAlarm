

const snoozeTimeForHigh = 60 * 60 * 1000 ;
const snoozeTimeForLow = 15 * 60 * 1000;
const nightScoutPollFrequency = 10000;


const nsMonitor = function (nightScout, logFactory){

  const thresholdLow = 4.0;
  const thresholdHigh = 9.0;


  const log = logFactory.createLogger("main").log;
  const alartSound = './alarm.m4a';

  const alarm = require("./local_modules/Alarm")(alartSound,logFactory);


  function periodicCheck() {
    nightScout.getSgData(3)
      .then(data =>{
        log(new Date(data.lastTimestamp) + ", average:" + data.mean + ", last: "+ data.sgSamples[0] + ", snoozed at:" + "--snoozeStartTime--");
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
