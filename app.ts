
import {LogFactory} from "./local_modules/BufferedLog/app"
import {NightScout} from './local_modules/NightScout/app'
import {NsMonitor} from './nsMonitor/index'
import {web as theWeb} from "./Web/index"


const nightScoutUrl = 'https://bfg9000.azurewebsites.net';
//const nightScoutUrl = 'http://localhost:8080';

const logFactory = new LogFactory()
const nightScout = new NightScout(nightScoutUrl, logFactory);

const nsMonitor = new NsMonitor(nightScout, logFactory);
const web = theWeb(nsMonitor, nightScout, logFactory);
