
const component = function(logFactory){
  const express = require('express');
  const router = express.Router();

  const config = require('../Config');

  
  /* GET users listing. */
  router.get('/', function(req, res, next) {
    res.render('index', { title: config.webTitle });
  });
  router.get('/logs', function(req, res, next) {
    res.render('logs', { title: config.webTitle, log: logFactory.getEvents() });
  });


  return router;
}

module.exports = component;
