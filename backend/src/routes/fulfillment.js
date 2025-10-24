import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { Shipment } from '../../models/index.js';

const r = Router();

r.post('/create-shipment', requireAuth, async (req, res) => {
  const { subscriptionId } = req.body || {};
  if (!subscriptionId) return res.status(400).json({ message: 'subscriptionId required' });
  const label = 'LBL-' + Math.random().toString(36).slice(2, 10).toUpperCase();
  const ship = await Shipment.create({
    subscription_id: subscriptionId,
    label_code: label,
    status: 'pending'
  });
  res.json(ship);
});

r.get('/subscription/:id', requireAuth, async (req, res) => {
  const rows = await Shipment.findAll({ where: { subscription_id: req.params.id } });
  res.json(rows);
});

export default r;
