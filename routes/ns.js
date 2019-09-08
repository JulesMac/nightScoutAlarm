

const moment = require('moment');

const ns = function(nsMonitor, nightScout, logFactory){
  const log = logFactory.createLogger("route-ns").log;
  const express = require('express');
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
    res.send("snoozed");
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
  router.get('/logs', function(req, res) {
    const html = "<table><tr><td>" + logFactory.getEvents().reduce((a, b) => {return a + "</td></tr><tr><td>" + b}) + "</td></tr></table>";
    res.send(html);
  });
  return router;
}

module.exports = ns;
