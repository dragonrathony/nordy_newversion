import { Router } from 'express';
import controller from '../controller';
const router = Router();

export default  (app) => {
  app.use('/', router);

  // add product
  router.get('/api/getProcess', controller.processController.get);
};
