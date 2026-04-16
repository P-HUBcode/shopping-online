// server/models/OrderDAO.js
require('../utils/MongooseUtil');
const Models = require('./Models');

const OrderDAO = {
  // --- Dành cho Customer (Lab 7) ---
  
  // Thêm đơn hàng mới khi Checkout
  async insert(order) {
    const mongoose = require('mongoose');
    order._id = new mongoose.Types.ObjectId();
    const result = await Models.Order.create(order);
    return result;
  },
  // BỔ SUNG: Lấy danh sách đơn hàng của một khách hàng cụ thể
  async selectByCustID(_cid) {
    const query = { 'customer._id': _cid };
    const orders = await Models.Order.find(query).exec();
    return orders;
  },

  // Lấy danh sách đơn hàng của một khách hàng cụ thể (Trang My Orders)
  async selectByCustID(cid) {
    const query = { 'customer._id': cid };
    const mysort = { cdate: -1 }; // Đơn hàng mới nhất hiện lên đầu
    const orders = await Models.Order.find(query).sort(mysort).exec();
    return orders;
  },

  // --- Dành cho Admin (Lab 8) ---

  // Lấy toàn bộ danh sách đơn hàng trong hệ thống
  async selectAll() {
    const query = {};
    const mysort = { cdate: -1 }; // Đơn hàng mới đặt hiện lên trước
    const orders = await Models.Order.find(query).sort(mysort).exec();
    return orders;
  },

  // Cập nhật trạng thái đơn hàng (APPROVED hoặc CANCELED)
  async update(_id, newStatus) {
    const newvalues = { status: newStatus };
    const result = await Models.Order.findByIdAndUpdate(_id, newvalues, { new: true });
    return result;
  }
};

module.exports = OrderDAO;