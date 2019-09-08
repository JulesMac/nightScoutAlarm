
const snoozer = function(nsMonitor, logFactory){
  const express = require('express');
  const router = express.Router();

  /* GET users listing. */
  router.get('/', function(req, res, next) {
    res.render('index', { title: 'Florence SG' });
    //res.send('respond with a resource');
  });

  return router;
}

module.exports = snoozer;
