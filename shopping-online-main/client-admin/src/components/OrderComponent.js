import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';

class Order extends Component {
  static contextType = MyContext;
  constructor(props) {
    super(props);
    this.state = {
      orders: [],
      order: null // Lưu đơn hàng đang được chọn để xem chi tiết
    };
  }

  render() {
    // Render bảng danh sách đơn hàng (Bảng trên)
    const orders = this.state.orders.map((item) => (
      <tr key={item._id} className="datatable" onClick={() => this.trItemClick(item)}>
        <td>{item._id}</td>
        <td>{new Date(item.cdate).toLocaleString()}</td>
        <td>{item.customer.name}</td>
        <td>{item.total.toLocaleString()}</td>
        <td>{item.status}</td>
        <td>
          {item.status === 'PENDING' ? (
            <div>
              <span className="link" onClick={(e) => this.lnkApproveClick(e, item._id)}>APPROVE</span> || 
              <span className="link" onClick={(e) => this.lnkCancelClick(e, item._id)}> CANCEL</span>
            </div>
          ) : <span style={{color: 'gray'}}>N/A</span>}
        </td>
      </tr>
    ));

    // Render bảng chi tiết sản phẩm (Bảng dưới - Xuất hiện khi click vào 1 đơn hàng)
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
      <div>
        <div className="align-center">
          <h2 className="text-center">ORDER LIST</h2>
          <table className="datatable" border="1">
            <tbody>
              <tr className="datatable">
                <th>ID</th><th>Creation date</th><th>Cust.name</th><th>Total</th><th>Status</th><th>Action</th>
              </tr>
              {orders}
            </tbody>
          </table>
        </div>

        {this.state.order ? (
          <div className="align-center" style={{ marginTop: '50px' }}>
            <h2 className="text-center">ORDER DETAIL</h2>
            <table className="datatable" border="1">
              <tbody>
                <tr className="datatable">
                  <th>No.</th><th>Prod.ID</th><th>Prod.name</th><th>Image</th><th>Price</th><th>Qty</th><th>Amount</th>
                </tr>
                {items}
              </tbody>
            </table>
          </div>
        ) : <div />}
      </div>
    );
  }

  // --- HÀM XỬ LÝ ---
  componentDidMount() {
    this.apiGetOrders();
  }

  trItemClick(item) {
    this.setState({ order: item });
  }

  lnkApproveClick(e, id) {
    e.stopPropagation(); // Ngăn sự kiện click dòng trItemClick
    this.apiPutOrderStatus(id, 'APPROVED');
  }

  lnkCancelClick(e, id) {
    e.stopPropagation();
    this.apiPutOrderStatus(id, 'CANCELED');
  }

  // --- APIS ---
  apiGetOrders() {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('/api/admin/orders', config).then((res) => {
      this.setState({ orders: res.data });
    });
  }

  apiPutOrderStatus(id, status) {
    const body = { status: status };
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.put('/api/admin/orders/status/' + id, body, config).then((res) => {
      if (res.data) {
        this.apiGetOrders(); // Refresh lại danh sách
        this.setState({ order: null }); // Ẩn bảng chi tiết sau khi update
      } else {
        alert('Update failed!');
      }
    });
  }
}
export default Order;