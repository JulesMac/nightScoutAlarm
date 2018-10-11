
const nightScoutUrl = 'https://bfg9000.azurewebsites.net';

const nightScout = require('../local_modules/NightScout')(nightScoutUrl);

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
  return router;
}

module.exports = ns;
