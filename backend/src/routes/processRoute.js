import { Router } from 'express';
import controller from '../controller';
const router = Router();

export default  (app) => {
  app.use('/', router);

  // get saved process list
  router.get('/api/getProcess', controller.processController.get);
  // create process
  router.post('/api/processSave', controller.processController.create);
};
