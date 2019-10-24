"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("../Config/app"));
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const body_parser_1 = __importDefault(require("body-parser"));
const index_1 = require("../routes/index");
const ns_1 = require("../routes/ns");
const fs_1 = __importDefault(require("fs"));
exports.web = function (nsMonitor, nightScout, logFactory) {
    const app = express_1.default();
    const config = app_1.default.web;
    console.log(path_1.default.join(__dirname, 'access.log'));
    console.log(path_1.default.join(__dirname, 'access.log'));
    console.log(path_1.default.join(__dirname, 'access.log'));
    console.log(path_1.default.join(__dirname, 'access.log'));
    const accessLogStream = fs_1.default.createWriteStream(path_1.default.join(__dirname, '../../access.log'), { flags: 'a' });
    const log = logFactory.createLogger("web").log;
    app.set('views', path_1.default.join(__dirname, '../../views'));
    app.set('view engine', 'pug');
    //app.use(logger('dev'));
    app.use(morgan_1.default('dev', { stream: accessLogStream }));
    app.use(body_parser_1.default.json());
    app.use(body_parser_1.default.urlencoded({ extended: false }));
    app.use(cookie_parser_1.default());
    app.use(express_1.default.static(path_1.default.join(__dirname, '../../public')));
    app.use('/', index_1.component(logFactory));
    app.use('/ns', ns_1.ns(nsMonitor, nightScout, logFactory));
    const PORT = config.port;
    app.listen(PORT, () => {
        log(`Floppet Alarm listening on port ${PORT}`);
    });
};
