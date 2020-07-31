import { Router } from 'express';
import controller from '../controller';
const router = Router();

export default  (app) => {
  app.use('/', router);

  router.get('/api/getProcessMeachne', controller.machineController.getProcessAndMachine);
  router.get('/api/getProcessRecord/:id', controller.machineController.getMachineByProcessId);
  router.get('/api/getProcessRecordByid/:id', controller.machineController.getMachineById);
  router.post('/api/addProcessrecord', controller.machineController.createMachine);
  router.post('/api/updateProcessrecord', controller.machineController.updateMachine);

};
