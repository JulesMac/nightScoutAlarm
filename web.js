const express = require('express');
//var rp = require('request-promise');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const app = express();

const indexRouter = require('./routes/index');

var web = function(nsMonitor){
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'pug');
  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, 'public')));
  app.use('/', indexRouter(nsMonitor));


  const PORT = 3000;
  app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}!`);
  });
}
module.exports = web;
