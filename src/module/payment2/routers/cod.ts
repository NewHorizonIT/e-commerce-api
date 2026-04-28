import { Router } from 'express';
import CodController from '../controllers/cod';

const codRouter = Router();
const codController = new CodController();

codRouter.post('/cod', codController.codPayment);

export default codRouter;
