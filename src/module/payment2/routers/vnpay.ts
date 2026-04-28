import { Router } from 'express';
import VnpayController from '../controllers/vnpay';

const vnpayRouter = Router();
const vnpayController = new VnpayController();

vnpayRouter.post('/vnpay/initiate', vnpayController.vnpayInitiate);
vnpayRouter.get('/vnpay/callback', vnpayController.vnpayCallback);

export default vnpayRouter;
