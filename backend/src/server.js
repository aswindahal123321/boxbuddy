import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { sequelize } from '../models/index.js';
import authRoutes from './routes/auth.js';
import productsRoutes from './routes/products.js';
import subscriptionsRoutes from './routes/subscriptions.js';
import billingRoutes from './routes/billing.js';
import fulfillmentRoutes from './routes/fulfillment.js';

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ ok: true }));

app.use('/api/auth', authRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/subscriptions', subscriptionsRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/fulfillment', fulfillmentRoutes);

const port = Number(process.env.PORT || 4000);

async function start() {
  try {
    await sequelize.authenticate();
    console.log('DB connected');
    app.listen(port, () => console.log(`API listening on http://localhost:${port}`));
  } catch (e) {
    console.error('Failed to start:', e);
    process.exit(1);
  }
}
start();
