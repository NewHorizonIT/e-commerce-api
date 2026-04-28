import { Router } from 'express';
import ZalopayController from '../controllers/zalopay';

const zalopayRouter = Router();
const zalopayController = new ZalopayController();

zalopayRouter.post('/zalopay/initiate', zalopayController.zalopayInitiate);
zalopayRouter.post('/zalopay/callback', zalopayController.zalopayCallback);

export default zalopayRouter;
