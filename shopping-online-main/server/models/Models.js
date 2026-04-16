// CLI: npm install mongoose --save
const mongoose = require('mongoose');

const AdminSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  username: { type: String, required: true },
  password: { type: String, required: true }
}, { versionKey: false });

const CategorySchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true }
}, { versionKey: false });

const CustomerSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  username: { type: String, required: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  active: { type: Number, default: 0 },
  token: { type: String, default: '' }
}, { versionKey: false });

const OrderCustomerSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  username: { type: String, required: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  active: { type: Number, default: 0 }
}, { versionKey: false, _id: false });

const ProductSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true },
  price: { type: Number, required: true },
  sizes: [String],
  sizeGuide: String,
  image: String,
  cdate: Number,
  category: CategorySchema
}, { versionKey: false });

const ItemSchema = mongoose.Schema({
  product: ProductSchema,
  quantity: { type: Number, required: true }
}, { versionKey: false, _id: false });

const OrderSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  cdate: Number,
  total: Number,
  status: { type: String, default: 'PENDING' },
  customer: OrderCustomerSchema,
  items: [ItemSchema]
}, { versionKey: false });

const Admin = mongoose.model('Admin', AdminSchema, 'admins');
const Category = mongoose.model('Category', CategorySchema, 'categories');
const Customer = mongoose.model('Customer', CustomerSchema, 'customers');
const Product = mongoose.model('Product', ProductSchema, 'products');
const Order = mongoose.model('Order', OrderSchema, 'orders');

module.exports = { Admin, Category, Customer, Product, Order };
