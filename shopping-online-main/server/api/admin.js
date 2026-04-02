const express = require('express');
const router = express.Router();

// utils
const JwtUtil = require('../utils/JwtUtil');
const EmailUtil = require('../utils/EmailUtil');

// daos
const AdminDAO = require('../models/AdminDAO');
const CategoryDAO = require('../models/CategoryDAO');
const ProductDAO = require('../models/ProductDAO');
const OrderDAO = require('../models/OrderDAO');
const CustomerDAO = require('../models/CustomerDAO');

// ==========================================
// 1. AUTHENTICATION & TOKEN
// ==========================================

// Login
router.post('/login', async function (req, res) {
  const { username, password } = req.body;
  if (username && password) {
    const admin = await AdminDAO.selectByUsernameAndPassword(username, password);
    if (admin) {
      const token = JwtUtil.genToken(admin.username, admin.password);
      res.json({ success: true, message: 'Authentication successful', token: token });
    } else {
      res.json({ success: false, message: 'Incorrect username or password' });
    }
  } else {
    res.json({ success: false, message: 'Please input username and password' });
  }
});

// Check Token
router.get('/token', JwtUtil.checkToken, function (req, res) {
  const token = req.headers['x-access-token'] || req.headers['authorization'];
  res.json({ success: true, message: 'Token is valid', token: token });
});

// ==========================================
// 2. CATEGORY MANAGEMENT
// ==========================================

router.get('/categories', JwtUtil.checkToken, async function (req, res) {
  const categories = await CategoryDAO.selectAll();
  res.json(categories);
});

router.post('/categories', JwtUtil.checkToken, async function (req, res) {
  const name = req.body.name;
  const category = { name: name };
  const result = await CategoryDAO.insert(category);
  res.json(result);
});

router.put('/categories/:id', JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id;
  const name = req.body.name;
  const category = { _id: _id, name: name };
  const result = await CategoryDAO.update(category);
  res.json(result);
});

router.delete('/categories/:id', JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id;
  const result = await CategoryDAO.delete(_id);
  res.json(result);
});

// ==========================================
// 3. PRODUCT MANAGEMENT
// ==========================================

router.get('/products', JwtUtil.checkToken, async function (req, res) {
  try {
    let products = await ProductDAO.selectAll();
    if (!products) products = [];
    const sizePage = 4;
    const noPages = Math.ceil(products.length / sizePage) || 1;
    let curPage = req.query.page ? parseInt(req.query.page) : 1;
    const offset = (curPage - 1) * sizePage;
    const pagedProducts = products.slice(offset, offset + sizePage);
    res.json({ products: pagedProducts, noPages: noPages, curPage: curPage });
  } catch (error) {
    res.status(500).json({ message: "Server Error: " + error.message });
  }
});

router.post('/products', JwtUtil.checkToken, async function (req, res) {
  const { name, price, category: cid, image } = req.body;
  const now = new Date().getTime();
  const category = await CategoryDAO.selectByID(cid);
  const product = { name, price, image, cdate: now, category };
  const result = await ProductDAO.insert(product);
  res.json(result);
});

router.put('/products', JwtUtil.checkToken, async function (req, res) {
  const { id: _id, name, price, category: cid, image } = req.body;
  const now = new Date().getTime();
  const category = await CategoryDAO.selectByID(cid);
  const product = { _id, name, price, image, cdate: now, category };
  const result = await ProductDAO.update(product);
  res.json(result);
});

router.delete('/products/:id', JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id;
  const result = await ProductDAO.delete(_id);
  res.json(result);
});

// ==========================================
// 4. ORDER MANAGEMENT
// ==========================================

router.get('/orders', JwtUtil.checkToken, async function (req, res) {
  const orders = await OrderDAO.selectAll();
  res.json(orders);
});

router.put('/orders/status/:id', JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id;
  const newStatus = req.body.status;
  const result = await OrderDAO.update(_id, newStatus);
  res.json(result);
});

// Lấy đơn hàng theo mã khách hàng (Lab 09)
router.get('/orders/customer/:cid', JwtUtil.checkToken, async function (req, res) {
  const _cid = req.params.cid;
  const orders = await OrderDAO.selectByCustID(_cid);
  res.json(orders);
});

// ==========================================
// 5. CUSTOMER MANAGEMENT (LAB 09)
// ==========================================

// Danh sách khách hàng
router.get('/customers', JwtUtil.checkToken, async function (req, res) {
  const customers = await CustomerDAO.selectAll();
  res.json(customers);
});

// Vô hiệu hóa khách hàng
router.put('/customers/deactive/:id', JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id;
  const token = req.body.token;
  const result = await CustomerDAO.active(_id, token, 0); // 0 = deactive
  res.json(result);
});

// Gửi mail kích hoạt
router.get('/customers/sendmail/:id', JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id;
  const cust = await CustomerDAO.selectByID(_id);
  if (cust) {
    const send = await EmailUtil.send(cust.email, cust._id, cust.token);
    res.json({ success: send, message: send ? 'Please check email' : 'Email failure' });
  } else {
    res.json({ success: false, message: 'Customer does not exist' });
  }
});

// ==========================================
// 6. TEST ENDPOINTS (ADMIN CREATION)
// ==========================================

router.get('/all', async function (req, res) {
  const admins = await AdminDAO.selectAll();
  res.json({ success: true, data: admins });
});

router.post('/create', async function (req, res) {
  const { username, password } = req.body;
  if (username && password) {
    const admin = await AdminDAO.insert(username, password);
    res.json({ success: true, message: 'Admin created', data: admin });
  } else {
    res.json({ success: false, message: 'Please provide username and password' });
  }
});

module.exports = router;