import { config } from '@config/config';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { authModule } from './module/auth/module';
import { productModule } from './module/product/module';
import { reviewModule } from './module/review/module';
import errorHandler from './shared/middleware/errorHandler';
import notFoundHandler from './shared/middleware/notFoundHandler';
import helmet from 'helmet';
import morgan from 'morgan';
import { swaggerSpec, swaggerYamlText } from './config/swagger';
import { orderModule } from './module/order/module';
import { discountModule } from './module/discount/module';
// import { paymentModule } from './module/payment/module';
import vnpayRouter from './module/payment2/routers/vnpay';
import codRouter from './module/payment2/routers/cod';
import momoRouter from './module/payment2/routers/momo';
import zalopayRouter from './module/payment2/routers/zalopay';
import { cartModule } from './module/cart/module';
import { userModule } from './module/user/module';
import { promotionModule } from './module/promotion/module';

const app = express();

// ==================== MIDDLEWARES ====================
app.use(
  cors({
    origin: config.cors.origins,
    methods: config.cors.methods,
    allowedHeaders: config.cors.allowedHeaders,
    credentials: config.cors.credentials,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(compression());
app.use(helmet());
app.use(morgan('dev'));

// ==================== ROUTES ====================
app.get('/', (req, res) => {
  res.json({ message: 'E-Commerce API is running!', timestamp: new Date() });
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', uptime: process.uptime() });
});

app.get('/api-docs.yaml', (_req, res) => {
  res.type('application/yaml').send(swaggerYamlText);
});
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(`${config.app.apiPrefix}/${config.app.apiVersion}/auth`, authModule.router);
app.use(`${config.app.apiPrefix}/${config.app.apiVersion}`, productModule.router);
app.use(`${config.app.apiPrefix}/${config.app.apiVersion}`, discountModule.router);
app.use(`${config.app.apiPrefix}/${config.app.apiVersion}/orders`, orderModule.router);
// app.use(`${config.app.apiPrefix}/${config.app.apiVersion}`, paymentModule.router);
app.use(`${config.app.apiPrefix}/${config.app.apiVersion}/payment`, codRouter);
app.use(`${config.app.apiPrefix}/${config.app.apiVersion}/payment`, vnpayRouter);
app.use(`${config.app.apiPrefix}/${config.app.apiVersion}/payment`, momoRouter);
app.use(`${config.app.apiPrefix}/${config.app.apiVersion}/payment`, zalopayRouter);
app.use(`${config.app.apiPrefix}/${config.app.apiVersion}`, reviewModule.router);
app.use(`${config.app.apiPrefix}/${config.app.apiVersion}`, cartModule.router);
app.use(`${config.app.apiPrefix}/${config.app.apiVersion}`, userModule.router);
app.use(`${config.app.apiPrefix}/${config.app.apiVersion}`, promotionModule.router)

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
