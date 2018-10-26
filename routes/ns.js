
const nightScoutUrl = 'https://bfg9000.azurewebsites.net';

const nightScout = require('../local_modules/NightScout')(nightScoutUrl);
const moment = require('moment');

var ns = function(nsMonitor){
  var express = require('express');
  var router = express.Router();

  router.get('/sgData', function(req, res) {
    nightScout.getSgData(25)
      .then(data =>{
        res.send(data);
      })
      .catch(error => {
        //log(error);
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
        //log(error);
      });
  });
  router.get('/sgLevel', function(req, res) {
    nightScout.getSgData(1)
      .then(data =>{
        const sgLevel = "" + Math.round(data.lastSg * 10) / 10; //.format("HH:mm:ss")
        res.send(sgLevel);
      })
      .catch(error => {
        //log(error);
      });
  });
  return router;
}

module.exports = ns;
