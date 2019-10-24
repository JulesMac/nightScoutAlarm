
import express from 'express';
import configRoot from '../Config/app'
import {LogFactory} from '../local_modules/BufferedLog/app'


export const component = function(logFactory : LogFactory){
  const config = configRoot.web
  const router = express.Router();


  /* GET users listing. */
  router.get('/', (req, res, next) => {
    res.render('index', { title: config.title });
  });
  router.get('/logs', (req, res, next) => {
    res.render('logs', { title: config.title, log: logFactory.getEvents() });
  });

  return router;
}
