"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const bluebird_1 = require("bluebird");
const meanSampleLength = 2;
function buildApi(baseUrl) {
    return {
        //url: baseUrl,
        getSgSamples: function (sampleCount) {
            const url = baseUrl + '/api/v1/entries.json?count=' + sampleCount;
            //const url = baseUrl + '/nsData.js?count=' + sampleCount;
            return url;
        }
    };
}
;
class NightScout {
    constructor(baseUrl, logFactory) {
        this.baseUrl = baseUrl;
        this.logFactory = logFactory;
        this.log = logFactory.createLogger("nightScout").log;
        this.api = buildApi(this.baseUrl);
        this.log("started NS");
    }
    //log("Url: " + api.url);
    getSgData(sampleSize) {
        let api = this.api;
        return new bluebird_1.Promise(function (resolve, reject) {
            axios_1.default.get(api.getSgSamples(sampleSize)
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
                resolve({
                    timeStamps: timeStamps,
                    sgSamples: sgvs,
                    mean: average,
                    lastTimestamp: timeStamps[sgvs.length - 1],
                    lastSg: sgvs[sgvs.length - 1]
                });
                //
                // if ((average < thresholdLow ||average > thresholdHigh)){
                //   triggerAlarm();
                // }
            })
                .catch(error => {
                reject({ errorMessage: error });
            });
        });
    }
}
exports.NightScout = NightScout;
function create(baseUrl, logFactory) {
    return new NightScout(baseUrl, logFactory);
}
exports.create = create;
