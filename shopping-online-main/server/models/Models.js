// CLI: npm install mongoose --save
const mongoose = require('mongoose');

// ==========================================
// 1. ADMIN SCHEMA
// ==========================================
const AdminSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  username: { type: String, required: true },
  password: { type: String, required: true }
}, { versionKey: false });

// ==========================================
// 2. CATEGORY SCHEMA
// ==========================================
const CategorySchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true }
}, { versionKey: false });

// ==========================================
// 3. CUSTOMER SCHEMA
// ==========================================
const CustomerSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  username: { type: String, required: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  active: { type: Number, default: 0 }, // 0: deactive, 1: active
  token: { type: String, default: '' }
}, { versionKey: false });

// ==========================================
// 4. PRODUCT SCHEMA
// ==========================================
const ProductSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: String, // Base64 string
  cdate: Number, // Timestamp
  category: CategorySchema // Embedded Category
}, { versionKey: false });

// ==========================================
// 5. ITEM SCHEMA (Dùng trong đơn hàng)
// ==========================================
const ItemSchema = mongoose.Schema({
  product: ProductSchema, // Embedded Product tại thời điểm mua
  quantity: { type: Number, required: true }
}, { versionKey: false, _id: false });

// ==========================================
// 6. ORDER SCHEMA
// ==========================================
const OrderSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  cdate: Number,
  total: Number,
  status: { type: String, default: 'PENDING' }, // PENDING, APPROVED, CANCELLED
  customer: CustomerSchema, // Embedded Customer thông tin người mua
  items: [ItemSchema] // Mảng các mặt hàng
}, { versionKey: false });

// ==========================================
// KHOỞI TẠO VÀ EXPORT MODELS
// ==========================================
const Admin = mongoose.model('Admin', AdminSchema, 'admins');
const Category = mongoose.model('Category', CategorySchema, 'categories');
const Customer = mongoose.model('Customer', CustomerSchema, 'customers');
const Product = mongoose.model('Product', ProductSchema, 'products');
const Order = mongoose.model('Order', OrderSchema, 'orders');

module.exports = { Admin, Category, Customer, Product, Order };