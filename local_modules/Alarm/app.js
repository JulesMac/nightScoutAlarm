



function Alarm(audioFile){
  const audioPlayer = require("../Audio")(audioFile);
  const logger = require("../Log")("alarm");
  const time = require("../Time");
  const log = logger.log;

  var isSnoozed = false;
  var snoozeTime = 0;
  var snoozeStartTime   = undefined;
  var maxAlarmPlayTime  = 300000;

  this.triggerAlarm = function(timeToSnooze) {
    if(!isSnoozed){
      if(audioPlayer.play()){
        //startPlaying();
        setTimeout(function(){
          //Only play alarm sound for fixed amount of time (after this the alarm can be repeated)
          log("alarm play timed out")
          audioPlayer.stop()
        }, maxAlarmPlayTime);
        snoozeTime = timeToSnooze;
      }
    }
  }


  this.snooze = function() {
      if(!isSnoozed){
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
  }

module.exports = function(audioFile){
  return new Alarm(audioFile)
}
