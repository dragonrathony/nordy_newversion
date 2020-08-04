import { Router } from 'express';
import controller from '../controller';
const router = Router();

export default  (app) => {
  app.use('/', router);

  router.get('/api/getAdmProcesses', controller.admProcessController.get);
  router.post('/api/getAdmProcessById', controller.admProcessController.getById);
  router.post('/api/addAdmProcess', controller.admProcessController.create);
  router.post('/api/editAdmProcesses', controller.admProcessController.update);
  
};
