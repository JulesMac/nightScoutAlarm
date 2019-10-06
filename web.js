
const config = require('./Config').web;

const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const app = express();

const indexRouter = require('./routes/index');
const nsRouter = require('./routes/ns');

const web = function(nsMonitor, nightScout, logFactory){
  const log = logFactory.createLogger("web").log;
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'pug');
  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, 'public')));
  app.use('/', indexRouter(logFactory));
  app.use('/ns', nsRouter(nsMonitor, nightScout, logFactory));


  const PORT = config.port;
  app.listen(PORT, () => {
    log(`Floppet Alarm listening on port ${PORT}`);
  });
}
module.exports = web;
