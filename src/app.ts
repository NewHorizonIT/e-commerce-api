import { corsMiddleware } from '@/presentation/http/middleware/cors';
import { rateLimitMiddleware } from '@/presentation/http/middleware/rateLimit';
import { config } from '@config/config';
import { loadEnvFile } from '@config/env';
import express from 'express';

// Load environment variables đầu tiên
loadEnvFile();

const app = express();
const port = config.app.port;

// ==================== MIDDLEWARES ====================
app.use(corsMiddleware());
app.use(rateLimitMiddleware());

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ==================== ROUTES ====================
app.get('/', (req, res) => {
  res.json({ message: 'E-Commerce API is running!', timestamp: new Date() });
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', uptime: process.uptime() });
});

// ==================== START SERVER ====================
app.listen(port, () => {
  console.log('========================================');
  console.log('      E-COMMERCE API SERVER STARTED     ');
  console.log('========================================');
  console.log(`Environment: ${config.app.env}`);
  console.log(`Server is running on http://${config.app.host}:${port}`);
  console.log('========================================');
});
