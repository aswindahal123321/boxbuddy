import 'dotenv/config';
import bcrypt from 'bcrypt';
import { sequelize, User, Product } from '../models/index.js';

async function main() {
  await sequelize.authenticate();
  console.log('DB OK');
  const [u, created] = await User.findOrCreate({
    where: { email: 'dev@boxbuddy.local' },
    defaults: {
      password_hash: await bcrypt.hash('password123', 10),
      full_name: 'Dev User',
      role: 'user'
    }
  });
  const count = await Product.count();
  if (count === 0) {
    await Product.bulkCreate([
      { sku:'MEAL_BASIC', name:'Basic Meal Plan', description:'3 meals / week', price_cents:2999, is_active:true },
      { sku:'MEAL_PLUS',  name:'Plus Meal Plan',  description:'5 meals / week', price_cents:4999, is_active:true },
      { sku:'MEAL_PRO',   name:'Pro Meal Plan',   description:'7 meals / week', price_cents:6999, is_active:true }
    ]);
  }
  console.log('Seed complete');
  process.exit(0);
}

main().catch(e => { console.error(e); process.exit(1); });
