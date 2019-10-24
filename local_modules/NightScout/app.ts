
import axios from 'axios'
import {Logger, LogFactory} from "../BufferedLog/app"
import {Promise} from 'bluebird'
const meanSampleLength = 2;

interface NsApi {
  getSgSamples : (sampleCount: number) => string
}

function buildApi(baseUrl :string): NsApi {
  return {
    //url: baseUrl,
    getSgSamples : function (sampleCount: number) {
      const url = baseUrl + '/api/v1/entries.json?count=' + sampleCount;
      //const url = baseUrl + '/nsData.js?count=' + sampleCount;
      return url;
    }
  }
};

interface Sample{
  sgv: number
  date: number
}

export interface SgResponse
  {
    timeStamps: number[],
    sgSamples: number[],
    mean: number,
    lastTimestamp: number,
    lastSg: number
  }


export class NightScout{
  
  readonly baseUrl : string
  readonly logFactory :LogFactory
  readonly log: (message: string) => void;
  readonly api: NsApi;

  constructor(baseUrl : string, logFactory :LogFactory){
    this.baseUrl = baseUrl
    this.logFactory = logFactory
    this.log = logFactory.createLogger("nightScout").log;
    this.api = buildApi(this.baseUrl);
    this.log("started NS");
  }
  
  
  
  //log("Url: " + api.url);

  getSgData(sampleSize: number) : Promise<SgResponse> {
    let api = this.api
    return new Promise(function(resolve, reject){
      axios.get<Sample[]>(
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

export function create(baseUrl : string, logFactory: LogFactory){
  return new NightScout(baseUrl, logFactory)
}
