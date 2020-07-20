import { Router } from 'express';
import controller from '../controller';
const router = Router();

export default  (app) => {
  app.use('/', router);

  // add product
  router.post('/api/productSaveWithProductCode', controller.productionController.add);
  router.get('/api/initFormByProductCode/:productCode', controller.productionController.init);
};
