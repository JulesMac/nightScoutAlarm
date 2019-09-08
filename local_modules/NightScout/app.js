
const axios = require('axios');
const meanSampleLength = 2;

function buildApi(baseUrl) {
  return {
    url: baseUrl,
    getSgSamples : function (sampleCount) {
      const url = baseUrl + '/api/v1/entries.json?count=' + sampleCount;
      //const url = baseUrl + '/nsData.js?count=' + sampleCount;
      return url;
    }
  }
};

function NightScout(baseUrl, logFactory){
  const log = logFactory.createLogger("nightScout").log;

  log("started NS")
  
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
        //logger.display();
        //var values = (response.data.sgvs.reverse().slice(0, 2).map(x => x.mgdl / 18.0));
        const data = response.data.reverse();
        const sgvs = (data.map(x => x.sgv / 18.0));
        const timeStamps = data.map(x => x.date);
        //log(values);
        const average = sgvs.reduce((acc, x) => acc + x) * 1.0 / sgvs.length;
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

module.exports = function(baseUrl, logFactory){
  return new NightScout(baseUrl, logFactory)
}
