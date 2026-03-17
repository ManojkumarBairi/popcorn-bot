"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MainRouter = void 0;
const express_1 = require("express");
const ChromaRouter_1 = require("../../chroma/ChromaRouter");
class MainRouter {
    router = (0, express_1.Router)();
    constructor() {
        console.log('Mainrouter');
        this.router.use('/chroma', new ChromaRouter_1.ChromaRouter().router);
        this.router.get('/', (req, res) => { res.status(200).json({ message: 'Hello' }); });
    }
}
exports.MainRouter = MainRouter;
