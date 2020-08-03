import { Router } from 'express';
import controller from '../controller';
const router = Router();

export default  (app) => {
  app.use('/', router);

  router.get('/api/getFamily', controller.familyController.get);

};
