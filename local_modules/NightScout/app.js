
const axios = require('axios');
var logger = require("../Log")("nightScout");
var log = logger.log;

const meanSampleLength = 2;

function buildApi(baseUrl) {
  return {
    url: baseUrl,
    getSgSamples : function (sampleCount) {
       return baseUrl + '/api/v1/entries.json?count=' + sampleCount;
    }
  }
};

function NightScout(baseUrl){
  var api = buildApi(baseUrl);
  log("Url: " + api.url);

  this.getSgData = function(sampleSize){
    return new Promise(function(resolve, reject){
      axios.get(
        api.getSgSamples(sampleSize)
        //'https://bfg9000.azurewebsites.net/api/v2/ddata/at/'
        //'https://bfg9000.azurewebsites.net/api/v1/entries.json?count=3'
      )
      .then(response => {
        //var values = (response.data.sgvs.reverse().slice(0, 2).map(x => x.mgdl / 18.0));
        var data = response.data.reverse();
        var sgvs = (data.map(x => x.sgv / 18.0));
        var timeStamps = data.map(x => x.date);
        //log(values);
        var average = sgvs.reduce((acc, x) => acc + x) * 1.0 / sgvs.length;
        resolve( {
          timeStamps: timeStamps,
          sgSamples: sgvs,
          mean: average,
          lastTimestamp: timeStamps[sgvs.length -1],
          lastSg: sgvs[sgvs.length -1]
        });
        //
        // if ((average < thresholdLow ||average > thresholdHigh)){
        //   triggerAlarm();
        // }
      })
      .catch(error => {
        reject({errorMessage: error});
      });
    });
  }
}

module.exports = function(baseUrl){
  log("started NS")
  return new NightScout(baseUrl)
}
