var express = require('express');
//var rp = require('request-promise');

var app = express();
var isSnoozed = false;
var snoozeTimeForHigh = 60 * 60 * 1000 ;
var snoozeTimeForLow = 15 * 60 * 1000;
var snoozeTime = 0;
var snoozeStartTime = undefined;

var nightScoutPollFrequency = 10000;
var maxAlarmPlayTime       = 300000;
const nightScoutUrl = 'https://bfg9000.azurewebsites.net';
var keypress = require('keypress');


var thresholdLow = 4.0;
var thresholdHigh = 9.0;


var logger = require("./server/Log")("main");
var log = logger.log;

var alartSound = '/Users/jules/Music/iTunes/iTunes Media/Music/Bomb the Bass/Into the Dragon/03 On the Cut.m4a'
var audioPlayer = require("./server/Audio")(alartSound);
var time = require("./server/Time");



const axios = require('axios');
const nightScout = require('./server/NightScout')(nightScoutUrl);


app.get('/', function (req, res) {
  //.then
  axios.get(
    'https://bfg9000.azurewebsites.net/api/v2/ddata/at/'
    //'https://bbc.co.uk/news'
  )
  .then(response => {
    var values = (response.data.sgvs.reverse().slice(0, 9).map(x => x.mgdl / 18.0));
    log(values);
    var average = values.reduce((acc, x) => acc + x) * 1.0 / values.length;
    res.send("Sensor readings:"+ average + "<b>" + values.map(x => x + "</br>") +"</b>");
  })
  .catch(error => {
    log(error);
  });


  //res.send('Hello World!');
});




function periodicCheck() {
  nightScout.getSgData()
    .then(data =>{
      log(data.timeStamp + ", average:" + data.mean + ", last: "+ data.sgSamples[0] + ", snoozed at:" + snoozeStartTime);
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
      process.stdin.setRawMode(true);
    }
  }
}

setInterval(periodicCheck, nightScoutPollFrequency);



// make `process.stdin` begin emitting "keypress" events
keypress(process.stdin);



function keyHandler(ch, key) {
  if (!isSnoozed && key && (key.name == 'space')) {
    startSnooze();
  }
}
// listen for the "keypress" event
process.stdin.on('keypress', keyHandler);
process.stdin.resume();


function startSnooze() {
  if(!isSnoozed){
    //TODO - fix the keypress to be better
    process.stdin.setRawMode(false);
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



app.listen(3000, function () {
  log('Example app listening on port 3000!');
  // player.play(alartSound, function(err){
  //   if (err) throw err
  // })
});
