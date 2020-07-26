

import moment from 'moment'
import express from 'express'
import { NsMonitor } from '../../util/nsMonitor'
import { NightScout } from '../../util/nightScout'
import { LogFactory } from '../../util/logger'


export const ns = function (nsMonitor: NsMonitor, nightScout: NightScout, logFactory: LogFactory) {
  const log = logFactory.createLogger("route-ns").log;
  const router = express.Router();

  router.get('/chartData', function (req, res) {
    nightScout.getSgData(25)

      .then(data => {
        log("zoom:" + req.query.zoom)
        const zoom = req.query.zoom == "true"
        const minY = zoom ? data.sgSamples.reduce((p, v) => Math.min(p, v)) : 2;// * 0.90;
        const maxY = zoom ? data.sgSamples.reduce((p, v) => Math.max(p, v)) : 22;// * 1.10;
        const possibleTicks = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22];
        var smallTicks = possibleTicks.filter(x => x<=minY)
        smallTicks.splice(-1,1);
        var largeTicks = possibleTicks.filter(x => x>=maxY)
        largeTicks.splice(0,1);
        const ticksToRemove = new Set(smallTicks.concat(largeTicks));
        const ticksY = possibleTicks.filter(x => !ticksToRemove.has(x))
        const actualMinY = ticksY[0];
        const actualMaxY = ticksY[ticksY.length-1];
        const realData = Array.from(data.sgSamples.entries(), pair => ({x:data.timeStamps[pair[0]], y:pair[1] })) ;
        
        res.send({
          timeStamps : data.timeStamps,
          data       : realData,
          minY       : actualMinY,
          maxY       : actualMaxY,
          ticksY     : ticksY
        });
      })
      .catch(error => {
        log(error);
      });
  });
  router.get('/snooze', function (req, res) {
    nsMonitor.snooze();
    res.send("snoozed!");
  });
  router.get('/lastUpdateTime', function (req, res) {
    nightScout.getSgData(1)
      .then(data => {
        const timestamp = moment(data.lastTimestamp).format("HH:mm:ss")
        res.send(timestamp);
      })
      .catch(error => {
        log(error);
      });
  });
  router.get('/sgLevel', function (req, res) {
    nightScout.getSgData(1)
      .then(data => {
        const sgLevel = "" + Math.round(data.lastSg * 10) / 10; //.format("HH:mm:ss")
        res.send(sgLevel);
      })
      .catch(error => {
        log(error);
      });
  });
  router.get('/log', function (req, res) {
    res.send(logFactory.getEventsAsStrings());
  });
  return router;
}
