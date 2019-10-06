
const component = function(logFactory){
  const express = require('express');
  const router = express.Router();

  const config = require('../Config').web;

  
  /* GET users listing. */
  router.get('/', function(req, res, next) {
    res.render('index', { title: config.title });
  });
  router.get('/logs', function(req, res, next) {
    res.render('logs', { title: config.title, log: logFactory.getEvents() });
  });


  return router;
}

module.exports = component;
