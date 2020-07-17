import { Router } from 'express';
const app = Router();
import testRoute from './testRoute';
import authRoute from './authRoute';
import productRoute from './productRoute';

const route = () => {
    testRoute(app);
    authRoute(app);
    productRoute(app);

    return app;
}

export default route;
