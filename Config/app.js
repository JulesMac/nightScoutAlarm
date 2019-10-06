


function Config(){
  this.web = {
    port : 3000,
    title : "Floppet SG"
  };

  this.nsMonitor = {
    snoozeTimeForHigh : 60 * 60 * 1000,
    snoozeTimeForLow : 15 * 60 * 1000,
    nightScoutPollFrequency : 10000,
    thresholdLow : 4.0,
    thresholdHigh : 9.0
  };

  this.logger = {
    logSize : 5000
  }
}

module.exports = new Config()
