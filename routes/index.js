
var snoozer = function(nsMonitor){
  var express = require('express');
  var router = express.Router();

  /* GET users listing. */
  router.get('/', function(req, res, next) {
    res.render('index', { title: 'Florence SG' });
    //res.send('respond with a resource');
  });

  return router;
}

module.exports = snoozer;
