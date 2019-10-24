"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app_1 = __importDefault(require("../Config/app"));
exports.component = function (logFactory) {
    const config = app_1.default.web;
    const router = express_1.default.Router();
    /* GET users listing. */
    router.get('/', (req, res, next) => {
        res.render('index', { title: config.title });
    });
    router.get('/logs', (req, res, next) => {
        res.render('logs', { title: config.title, log: logFactory.getEvents() });
    });
    return router;
};
