
import {LogFactory} from "./util/logger"
import {NightScout} from './util/nightScout'
import {NsMonitor} from './util/nsMonitor'
import {web as theWeb} from "./web/index"


const nightScoutUrl = 'https://bfg9000.azurewebsites.net';
//const nightScoutUrl = 'http://localhost:8080';

const logFactory = new LogFactory()
const nightScout = new NightScout(nightScoutUrl, logFactory);

const nsMonitor = new NsMonitor(nightScout, logFactory);
theWeb(nsMonitor, nightScout, logFactory);
