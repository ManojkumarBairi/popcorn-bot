import express, { Application } from 'express';
import { MainRouter } from './components/router/MainRouter';

export class App {
    public app: Application;

    constructor() {
        this.app = express();
        this.initializeMiddleware();
        this.initializeRoutes();
    }

    private initializeMiddleware() {
      this.app.use(express.json());
    }

    private initializeRoutes() {
        console.log('routes');
        this.app.use('/', new MainRouter().router);
    }
    public listen() {
        this.app.listen(8080, () => {
            console.log(`Server running`);
        })
    }
}