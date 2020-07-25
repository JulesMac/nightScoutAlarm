import configRoot from "../Config/config"

import express from 'express'
import path from 'path'
import favicon from 'serve-favicon'
import logger from 'morgan'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import { NsMonitor } from '../util/nsMonitor'
import { NightScout } from '../util/nightScout'
import { LogFactory } from '../util/logger'


import { component as indexRouter } from './routes/index';
import { ns as nsRouter } from './routes/ns';
import fs from 'fs'



export const web = function (nsMonitor: NsMonitor, nightScout: NightScout, logFactory: LogFactory) {

  const app = express();

  const config = configRoot.web

  const accessLogStream = fs.createWriteStream(path.join(__dirname, '../../access.log'), { flags: 'a' })

  const log = logFactory.createLogger("web").log;
  app.set('views', path.join(__dirname, '../views'));
  app.set('view engine', 'pug');

  app.use(logger('dev', { stream: accessLogStream }))
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, '../public')));
  app.use('/', indexRouter(logFactory));
  app.use('/ns', nsRouter(nsMonitor, nightScout, logFactory));


  const PORT = config.port;
  app.listen(PORT, () => {
    log(`Floppet Alarm listening on port ${PORT}`);
  });
}

