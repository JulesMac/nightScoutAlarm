
var snoozer = function(nsMonitor){
  var express = require('express');
  var router = express.Router();

  /* GET users listing. */
  router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
    //res.send('respond with a resource');
  });

  router.get('/snooze', function(req, res, next) {
    console.log("--------")
    nsMonitor.snooze();
    res.render('index', { title: 'Express' });
    //res.send('respond with a resource');
  });
  return router;
}

module.exports = snoozer;
