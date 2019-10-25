"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment"));
const express_1 = __importDefault(require("express"));
exports.ns = function (nsMonitor, nightScout, logFactory) {
    const log = logFactory.createLogger("route-ns").log;
    const router = express_1.default.Router();
    router.get('/sgData', function (req, res) {
        nightScout.getSgData(25)
            .then(data => {
            res.send(data);
        })
            .catch(error => {
            log(error);
        });
    });
    router.get('/snooze', function (req, res) {
        nsMonitor.snooze();
        res.send("snoozed!");
    });
    router.get('/lastUpdateTime', function (req, res) {
        nightScout.getSgData(1)
            .then(data => {
            const timestamp = moment_1.default(data.lastTimestamp).format("HH:mm:ss");
            res.send(timestamp);
        })
            .catch(error => {
            log(error);
        });
    });
    router.get('/sgLevel', function (req, res) {
        nightScout.getSgData(1)
            .then(data => {
            const sgLevel = "" + Math.round(data.lastSg * 10) / 10; //.format("HH:mm:ss")
            res.send(sgLevel);
        })
            .catch(error => {
            log(error);
        });
    });
    router.get('/log', function (req, res) {
        res.send(logFactory.getEventsAsStrings());
    });
    return router;
};
