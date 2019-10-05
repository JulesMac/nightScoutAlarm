
const snoozer = function(nsMonitor, logFactory){
  const express = require('express');
  const router = express.Router();

  
  /* GET users listing. */
  router.get('/', function(req, res, next) {
    res.render('index', { title: 'Florence SG', log: logFactory.getEvents() });
  });

  return router;
}

module.exports = snoozer;
