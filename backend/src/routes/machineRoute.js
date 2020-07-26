import { Router } from 'express';
import controller from '../controller';
const router = Router();

export default  (app) => {
  app.use('/', router);

  router.get('/api/getProcessMeachne', controller.machineController.getProcessAndMachine);
  router.get('/api/getProcessRecord/:id', controller.machineController.getMachineByProcessId);

};
