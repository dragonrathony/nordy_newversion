import { Router } from 'express';
const app = Router();
import testRoute from './testRoute';
import authRoute from './authRoute';

const route = () => {
    testRoute(app);
    authRoute(app);

    return app;
}

export default route;
