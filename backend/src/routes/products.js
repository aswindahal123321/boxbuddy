import { Router } from 'express';
import { Product } from '../../models/index.js';

const r = Router();

r.get('/', async (req, res) => {
  const items = await Product.findAll({ where: { is_active: true } });
  res.json(items);
});

r.get('/:id', async (req, res) => {
  const item = await Product.findByPk(req.params.id);
  if (!item) return res.status(404).json({ message: 'Not found' });
  res.json(item);
});

export default r;
