import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { Payment } from '../../models/index.js';

const r = Router();

r.post('/charge', requireAuth, async (req, res) => {
  const { subscriptionId, amount_cents } = req.body || {};
  if (!subscriptionId || !amount_cents) return res.status(400).json({ message: 'subscriptionId & amount_cents required' });
  const pay = await Payment.create({
    subscription_id: subscriptionId,
    amount_cents,
    status: 'captured',
    currency: 'CAD',
    provider_ref: 'DEV-MOCK'
  });
  res.json(pay);
});

export default r;
