import { Router } from 'express';
import MomoController from '../controllers/momo';

const momoRouter = Router();
const momoController = new MomoController();

momoRouter.post('/momo/initiate', momoController.momoInitiate);
momoRouter.get('/momo/callback', momoController.momoCallback);

export default momoRouter;
