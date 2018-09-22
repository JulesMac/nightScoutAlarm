
var logger = require("../Log")("audio")

function Audio(audioFile){
  var audioFile = audioFile
  var player =require('play-sound')(opts = {})
  var isPlaying = false;
  var audioProcess = undefined;

  var log = logger.log;

  this.play = function () {
    if(!isPlaying){
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
    }else {
      return false;
    }
  }


  this.stop = function () {
    if(isPlaying){
      log("stop Playing...");
      isPlaying = false;
      audioProcess.kill();
    }
  }

}




module.exports = function(audioFile){
  return new Audio(audioFile)
}
