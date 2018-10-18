
const logger = require("../Log")("audio")
const processTreeKill =require('tree-kill')
const moment = require('moment');

function isQuietTime(timeStamp){
    const quietStartHour = 9
    const quietEndHour = 20
    const currentHour = parseFloat(timeStamp.format("HH"));
    return (currentHour >=quietStartHour) && (currentHour <=quietEndHour)
}

function Audio(audioFile){
  var audioFile = audioFile
  var player =require('play-sound')(opts = {})
  var isPlaying = false;
  var audioProcess = undefined;

  var log = logger.log;

  this.play = function () {
    const currentTime = moment();
    if(!isPlaying){
      if(!isQuietTime(currentTime)){
        log("startPlaying...");
        isPlaying = true;
        //-o alsa requird to work on my Pi
        audioProcess = player.play(audioFile, {omxplayer: ['-o', 'alsa']}, function(err){
          if (err) {
            log(err);
            throw err;
          }
        });
        return true;
      }else{
        log("Alarm in quiet time:" + currentTime.format("hh:mm:ss"))
        return false;
      }
    }else {
      return false;
    }
  }


  this.stop = function () {
    if(isPlaying){
      log("stop Playing...");
      isPlaying = false;
      log("kill process - " + audioProcess.pid);
      processTreeKill(audioProcess.pid);
    }
  }

}




module.exports = function(audioFile){
  return new Audio(audioFile)
}
