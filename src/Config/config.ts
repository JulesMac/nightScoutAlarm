

class Config{
  web = {
    port : 3003,
    title : "Floppet SG"
  };

  nsMonitor = {
    snoozeTimeForHigh : 60 * 60 * 1000,
    snoozeTimeForLow : 15 * 60 * 1000,
    nightScoutPollFrequency : 10000,
    thresholdLow : 4.0,
    thresholdHigh : 9.0
  };

  logger = {
    logSize : 5000
  }
}

export = new Config
