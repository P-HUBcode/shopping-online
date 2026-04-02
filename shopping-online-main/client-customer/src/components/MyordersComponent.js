import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import withRouter from '../utils/withRouter';

class Myorders extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      orders: [],
      order: null // Lưu đơn hàng đang được chọn để xem chi tiết
    };
  }

  render() {
    // 1. Vẽ bảng ORDER LIST (Danh sách đơn hàng)
    const orders = this.state.orders.map((item) => (
      <tr key={item._id} className="datatable" onClick={() => this.trItemClick(item)}>
        <td>{item._id}</td>
        <td>{new Date(item.cdate).toLocaleString()}</td>
        <td>{item.customer.name}</td>
        <td>{item.total.toLocaleString()}</td>
        <td>{item.status}</td>
      </tr>
    ));

    // 2. Vẽ bảng ORDER DETAIL (Chi tiết sản phẩm trong đơn đã chọn)
    const items = this.state.order ? this.state.order.items.map((item, index) => (
      <tr key={item.product._id} className="datatable">
        <td>{index + 1}</td>
        <td>{item.product._id}</td>
        <td>{item.product.name}</td>
        <td><img src={"data:image/jpg;base64," + item.product.image} width="70px" height="70px" alt="" /></td>
        <td>{item.product.price.toLocaleString()}</td>
        <td>{item.quantity}</td>
        <td>{(item.product.price * item.quantity).toLocaleString()}</td>
      </tr>
    )) : null;

    return (
      <div className="align-center">
        <h2 className="text-center">ORDER LIST</h2>
        <table className="datatable" border="1">
          <thead>
            <tr className="datatable">
              <th>ID</th><th>Creation date</th><th>Cust.name</th><th>Total</th><th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders}
          </tbody>
        </table>

        {this.state.order && (
          <div className="align-center" style={{ marginTop: '30px' }}>
            <h2 className="text-center">ORDER DETAIL</h2>
            <table className="datatable" border="1">
              <thead>
                <tr className="datatable">
                  <th>No.</th><th>Prod.ID</th><th>Prod.name</th><th>Image</th><th>Price</th><th>Qty</th><th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {items}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }

  componentDidMount() {
    if (this.context.customer) {
      this.apiGetOrdersByCustID(this.context.customer._id);
    }
  }

  // --- EVENT-HANDLERS ---
  trItemClick(item) {
    this.setState({ order: item });
  }

  // --- APIS ---
  apiGetOrdersByCustID(cid) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('/api/customer/orders/customer/' + cid, config).then((res) => {
      this.setState({ orders: res.data });
    }).catch((err) => {
      console.error("Lỗi lấy đơn hàng: ", err);
    });
  }
}

export default withRouter(Myorders);