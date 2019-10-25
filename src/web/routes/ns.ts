

import moment from 'moment'
import express from 'express'
import {NsMonitor} from '../../util/nsMonitor'
import {NightScout} from '../../util/nightScout'
import {LogFactory} from '../../util/logger'


export const ns = function(nsMonitor : NsMonitor, nightScout: NightScout, logFactory: LogFactory){
  const log = logFactory.createLogger("route-ns").log;
    const router = express.Router();

  router.get('/sgData', function(req, res) {
    nightScout.getSgData(25)
      .then(data =>{
        res.send(data);
      })
      .catch(error => {
        log(error);
      });
  });
  router.get('/snooze', function(req, res) {
    nsMonitor.snooze();
    res.send("snoozed!");
  });
  router.get('/lastUpdateTime', function(req, res) {
    nightScout.getSgData(1)
      .then(data =>{
        const timestamp = moment(data.lastTimestamp).format("HH:mm:ss")
        res.send(timestamp);
      })
      .catch(error => {
        log(error);
      });
  });
  router.get('/sgLevel', function(req, res) {
    nightScout.getSgData(1)
      .then(data =>{
        const sgLevel = "" + Math.round(data.lastSg * 10) / 10; //.format("HH:mm:ss")
        res.send(sgLevel);
      })
      .catch(error => {
        log(error);
      });
  });
  router.get('/log', function(req, res) {
    res.send(logFactory.getEventsAsStrings());
  });
  return router;
}