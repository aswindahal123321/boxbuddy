import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { Subscription } from '../../models/index.js';

const r = Router();

r.post('/', requireAuth, async (req, res) => {
  const { productId, renewInterval } = req.body || {};
  if (!productId) return res.status(400).json({ message: 'productId required' });
  const today = new Date();
  const sub = await Subscription.create({
    user_id: req.userId,
    product_id: productId,
    status: 'active',
    start_date: today,
    next_renewal: today,
    renew_interval: renewInterval || 'weekly'
  });
  res.json(sub);
});

r.get('/my', requireAuth, async (req, res) => {
  const subs = await Subscription.findAll({ where: { user_id: req.userId } });
  res.json(subs);
});

r.patch('/:id', requireAuth, async (req, res) => {
  const { status } = req.body || {};
  const sub = await Subscription.findByPk(req.params.id);
  if (!sub) return res.status(404).json({ message: 'Not found' });
  if (sub.user_id !== req.userId) return res.status(403).json({ message: 'Forbidden' });
  await sub.update({ status });
  res.json(sub);
});

export default r;
