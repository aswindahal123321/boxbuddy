import { Sequelize, DataTypes } from 'sequelize';

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS, {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 3306),
    dialect: 'mysql',
    logging: false
  }
);

const User = sequelize.define('User', {
  id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password_hash: { type: DataTypes.STRING, allowNull: false },
  full_name: DataTypes.STRING,
  role: { type: DataTypes.STRING, defaultValue: 'user' },
  created_at: { type: DataTypes.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
}, { tableName: 'users', timestamps: false });

const Product = sequelize.define('Product', {
  id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
  sku: { type: DataTypes.STRING, allowNull: false, unique: true },
  name: { type: DataTypes.STRING, allowNull: false },
  description: DataTypes.TEXT,
  price_cents: { type: DataTypes.INTEGER, allowNull: false },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
  created_at: { type: DataTypes.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
}, { tableName: 'products', timestamps: false });

const Subscription = sequelize.define('Subscription', {
  id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
  user_id: { type: DataTypes.BIGINT, allowNull: false },
  product_id: { type: DataTypes.BIGINT, allowNull: false },
  status: { type: DataTypes.STRING, defaultValue: 'active' },
  start_date: { type: DataTypes.DATE, allowNull: false },
  next_renewal: { type: DataTypes.DATE },
  renew_interval: { type: DataTypes.STRING, defaultValue: 'weekly' },
  created_at: { type: DataTypes.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
}, { tableName: 'subscriptions', timestamps: false });

const Payment = sequelize.define('Payment', {
  id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
  subscription_id: { type: DataTypes.BIGINT, allowNull: false },
  amount_cents: { type: DataTypes.INTEGER, allowNull: false },
  currency: { type: DataTypes.STRING, defaultValue: 'CAD' },
  status: { type: DataTypes.STRING, allowNull: false },
  provider_ref: { type: DataTypes.STRING },
  created_at: { type: DataTypes.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
}, { tableName: 'payments', timestamps: false });

const Shipment = sequelize.define('Shipment', {
  id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
  subscription_id: { type: DataTypes.BIGINT, allowNull: false },
  label_code: { type: DataTypes.STRING, allowNull: false },
  status: { type: DataTypes.STRING, defaultValue: 'pending' },
  eta_date: { type: DataTypes.DATE },
  created_at: { type: DataTypes.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
}, { tableName: 'shipments', timestamps: false });

// Associations
User.hasMany(Subscription, { foreignKey: 'user_id' });
Subscription.belongsTo(User, { foreignKey: 'user_id' });

Product.hasMany(Subscription, { foreignKey: 'product_id' });
Subscription.belongsTo(Product, { foreignKey: 'product_id' });

Subscription.hasMany(Payment, { foreignKey: 'subscription_id' });
Payment.belongsTo(Subscription, { foreignKey: 'subscription_id' });

Subscription.hasMany(Shipment, { foreignKey: 'subscription_id' });
Shipment.belongsTo(Subscription, { foreignKey: 'subscription_id' });

export { sequelize, User, Product, Subscription, Payment, Shipment };
