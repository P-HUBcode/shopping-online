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
      order: null
    };
  }

  render() {
    const { orders, order } = this.state;

    return (
      <div className="p-10">
        <h2 className="text-3xl text-center mb-10">
          MY ORDERS
        </h2>

        {/* ORDER LIST */}
        <div className="grid gap-4">
          {orders.map((item) => (
            <div
              key={item._id}
              onClick={() => this.trItemClick(item)}
              className="border p-4 cursor-pointer hover:shadow-md bg-white"
            >
              <div className="flex justify-between">
                <div>
                  <p><b>ID:</b> {item._id}</p>
                  <p>{new Date(item.cdate).toLocaleString()}</p>
                </div>

                <div className="text-right">
                  <p className="font-semibold">
                    {item.total.toLocaleString()} VND
                  </p>
                  <p className="text-gray-500">{item.status}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ORDER DETAIL */}
        {order && (
          <div className="mt-10">
            <h3 className="text-2xl mb-4">
              ORDER DETAIL
            </h3>

            <div className="grid gap-4">
              {order.items.map((item) => (
                <div
                  key={item.product._id}
                  className="flex items-center justify-between border p-4 bg-white"
                >
                  <img
                    src={"data:image/jpg;base64," + item.product.image}
                    className="w-20 h-20 object-cover grayscale"
                    alt=""
                  />

                  <div className="flex-1 ml-4">
                    <p>{item.product.name}</p>
                    <p className="text-gray-500">
                      {item.product.price.toLocaleString()} VND
                    </p>
                  </div>

                  <div>Qty: {item.quantity}</div>

                  <div className="font-semibold">
                    {(item.product.price * item.quantity).toLocaleString()} VND
                  </div>
                </div>
              ))}
            </div>
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

  trItemClick(item) {
    this.setState({ order: item });
  }

  apiGetOrdersByCustID(cid) {
    const config = { headers: { 'x-access-token': this.context.token } };

    axios.get('/api/customer/orders/customer/' + cid, config)
      .then((res) => {
        this.setState({ orders: res.data });
      });
  }
}

export default withRouter(Myorders);