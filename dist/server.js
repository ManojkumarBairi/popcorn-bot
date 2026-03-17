"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
const express_1 = __importDefault(require("express"));
const MainRouter_1 = require("./components/router/MainRouter");
class App {
    app;
    constructor() {
        this.app = (0, express_1.default)();
        this.initializeMiddleware();
        this.initializeRoutes();
    }
    initializeMiddleware() {
        this.app.use(express_1.default.json());
    }
    initializeRoutes() {
        console.log('routes');
        this.app.use('/', new MainRouter_1.MainRouter().router);
    }
    listen() {
        this.app.listen(8080, () => {
            console.log(`Server running`);
        });
    }
}
exports.App = App;
