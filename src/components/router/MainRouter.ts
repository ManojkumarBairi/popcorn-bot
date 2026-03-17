import { Router } from "express";
import { ChromaRouter } from "../../chroma/ChromaRouter";

export class MainRouter {
    public router = Router();

    constructor() {
        console.log('Mainrouter');
        this.router.use('/chroma', new ChromaRouter().router)
        this.router.get('/', (req, res) => { res.status(200).json({message: 'Hello'})});
    }
}