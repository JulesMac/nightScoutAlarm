

var isSnoozed = false;
var snoozeTimeForHigh = 60 * 60 * 1000 ;
var snoozeTimeForLow = 15 * 60 * 1000;
var snoozeTime = 0;
var snoozeStartTime = undefined;

var nightScoutPollFrequency = 10000;
var maxAlarmPlayTime       = 300000;
const nightScoutUrl = 'https://bfg9000.azurewebsites.net';


var nsMonitor = function (){

//  var keypress = require('keypress');


  var thresholdLow = 4.0;
  var thresholdHigh = 9.0;


  var logger = require("./local_modules/Log")("main");
  var log = logger.log;

  var alartSound = './alarm.m4a';
  var audioPlayer = require("./local_modules/Audio")(alartSound);
  var time = require("./local_modules/Time");



  const axios = require('axios');
  const nightScout = require('./local_modules/NightScout')(nightScoutUrl);


  function periodicCheck() {
    nightScout.getSgData(3)
      .then(data =>{
        log(new Date(data.lastTimestamp) + ", average:" + data.mean + ", last: "+ data.sgSamples[0] + ", snoozed at:" + snoozeStartTime);
        if (data.mean < thresholdLow)
          triggerAlarm(snoozeTimeForLow);
        else if (data.mean > thresholdHigh)
          triggerAlarm(snoozeTimeForHigh);
      })
      .catch(error => {
        log(error);
      });

  }

  function triggerAlarm(timeToSnooze) {
    if(!isSnoozed){
      if(audioPlayer.play()){
        //startPlaying();
        setTimeout(function(){
          //Only play alarm sound for fixed amount of time (after this the alarm can be repeated)
          log("alarm play timed out")
          audioPlayer.stop()
        }, maxAlarmPlayTime);
        snoozeTime = timeToSnooze;
        //Start checking for key presses to mute alarm
        //process.stdin.setRawMode(true);
      }
    }
  }

  setInterval(periodicCheck, nightScoutPollFrequency);



  // make `process.stdin` begin emitting "keypress" events
//  keypress(process.stdin);



  // function keyHandler(ch, key) {
  //   if (!isSnoozed && key && (key.name == 'space')) {
  //     startSnooze();
  //   }
  // }
  // // listen for the "keypress" event
  // process.stdin.on('keypress', keyHandler);
  // process.stdin.resume();


  function startSnooze() {
    if(!isSnoozed){
      //TODO - fix the keypress to be better
      //process.stdin.setRawMode(false);
      log("Snooze started");
      audioPlayer.stop();
      isSnoozed = true;
      snoozeStartTime = time.now();
      setTimeout(function(){
        log("Snooze ended");
        isSnoozed = false;
      }, snoozeTime);
      log("Set snooze timer")
    }
  }

  return {
    snooze: startSnooze
  }
}

module.exports = nsMonitor;