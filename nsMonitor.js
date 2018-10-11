

var snoozeTimeForHigh = 60 * 60 * 1000 ;
var snoozeTimeForLow = 15 * 60 * 1000;
var nightScoutPollFrequency = 10000;
const nightScoutUrl = 'https://bfg9000.azurewebsites.net';


var nsMonitor = function (){

  var thresholdLow = 4.0;
  var thresholdHigh = 9.0;


  var logger = require("./local_modules/Log")("main");
  var log = logger.log;
  var alartSound = './alarm.m4a';

  const alarm = require("./local_modules/Alarm")(alartSound);
  const nightScout = require('./local_modules/NightScout')(nightScoutUrl);


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
