
const processTreeKill =require('tree-kill')
const moment = require('moment');

function isQuietTime(timeStamp){
    const quietStartHour = 9
    const quietEndHour = 20
    const currentHour = parseFloat(timeStamp.format("HH"));
    return (currentHour >=quietStartHour) && (currentHour <=quietEndHour)
}

function Audio(audioFile1, logFactory){
  const audioFile = audioFile1
  const player =require('play-sound')(opts = {})
  var isPlaying = false;
  var audioProcess = undefined;

  const log = logFactory.createLogger("audio").log;
  log("Audio initialised");

  this.play = function () {
    const currentTime = moment();
    if(!isPlaying){
      if(!isQuietTime(currentTime)){
        log("StartPlaying...");
        isPlaying = true;
        //-o alsa requird to work on my Pi
        audioProcess = player.play(audioFile, {omxplayer: ['-o', 'alsa']}, function(err){
          if (err) {
            log("Error what attempting to use Audio player: " + err);
            return false;
          }
        });
        return true;
      }else{
        log("Alarm in quiet time:" + currentTime.format("HH:mm:ss"))
        return false;
      }
    }else {
      log("Already playing alarm")
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


module.exports = function(audioFile, logFactory){
  return new Audio(audioFile, logFactory)
}
