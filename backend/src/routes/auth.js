import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../../models/index.js';

const r = Router();

r.post('/register', async (req, res) => {
  const { email, password, fullName } = req.body || {};
  if (!email || !password) return res.status(400).json({ message: 'email & password required' });

  const existing = await User.findOne({ where: { email } });
  if (existing) return res.status(409).json({ message: 'Email in use' });

  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({ email, password_hash: hash, full_name: fullName || null, role: 'user' });
  res.json({ id: user.id, email: user.email });
});

r.post('/login', async (req, res) => {
  const { email, password } = req.body || {};
  const user = await User.findOne({ where: { email } });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
  const token = jwt.sign({ sub: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
  res.json({ token, user: { id: user.id, email: user.email, full_name: user.full_name } });
});

export default r;
