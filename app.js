


const nightScoutUrl = 'https://bfg9000.azurewebsites.net';
//const nightScoutUrl = 'http://localhost:8080';

const logFactory = require("./local_modules/BufferedLog");
const nightScout = require('./local_modules/NightScout')(nightScoutUrl, logFactory);

const nsMonitor = require('./nsMonitor')(nightScout, logFactory);
const web = require('./web')(nsMonitor, nightScout, logFactory);
