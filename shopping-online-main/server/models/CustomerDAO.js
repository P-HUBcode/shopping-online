const Models = require('./Models');

const CustomerDAO = {
  // --- CODE HIỆN CÓ CỦA BẠN ---
  async selectByUsernameOrEmail(username, email) {
    const query = { $or: [{ username: username }, { email: email }] };
    return await Models.Customer.findOne(query);
  },
  async insert(customer) {
    const mongoose = require('mongoose');
    customer._id = new mongoose.Types.ObjectId();
    return await Models.Customer.create(customer);
  },
  async active(_id, token, active) {
    const query = { _id: _id, token: token };
    const newvalues = { active: active };
    return await Models.Customer.findOneAndUpdate(query, newvalues, { new: true });
  },
  async selectByUsernameAndPassword(username, password) {
    const query = { username: username, password: password };
    return await Models.Customer.findOne(query);
  },
  async update(customer) {
    const currentCustomer = await Models.Customer.findById(customer._id).exec();

    if (!currentCustomer) {
      return null;
    }

    const newvalues = {
      username: customer.username,
      password: customer.password || currentCustomer.password,
      name: customer.name,
      phone: customer.phone,
      email: customer.email
    };
    return await Models.Customer.findByIdAndUpdate(customer._id, newvalues, { new: true });
  },

  // --- BỔ SUNG MỚI CHO LAB 09 ---
  async selectAll() {
    const query = {};
    const customers = await Models.Customer.find(query).exec();
    return customers;
  },
  async selectByID(_id) {
    const customer = await Models.Customer.findById(_id).exec();
    return customer;
  }
};

module.exports = CustomerDAO;
