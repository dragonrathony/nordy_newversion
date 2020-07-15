import { Router } from 'express';
import controller from '../controller';
const router = Router();

export default  (app) => {
  app.use('/', router);

  router.post('/api/login', controller.loginController.login);
};
