
import {LogFactory} from "./util/logger"
import {NightScout} from './util/nightScout'
import {NsMonitor} from './util/nsMonitor'
import {web as theWeb} from "./web/index"


//const nightScoutUrl = 'https://bfg9000.azurewebsites.net';
// const nightScoutUrl = 'https://floppet-nightscout.herokuapp.com';
const nightScoutUrl = 'https://flopper.chickenkiller.com';
const token = '763e8ae20662b406f3c71ea345a5d6064be423c3'
//const nightScoutUrl = 'http://localhost:8080';

const logFactory = new LogFactory()
const nightScout = new NightScout(nightScoutUrl, logFactory, token);

const nsMonitor = new NsMonitor(nightScout, logFactory);
theWeb(nsMonitor, nightScout, logFactory);
