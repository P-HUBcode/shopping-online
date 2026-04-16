import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import axios from 'axios';
import withRouter from '../utils/withRouter';

class Mycart extends Component {
    static contextType = MyContext;

    render() {
        const mycart = this.context.mycart;

        return (
            <div className="p-10">
                <h2 className="text-3xl text-center mb-10">
                    YOUR CART
                </h2>

                {mycart.length === 0 ? (
                    <div className="text-center text-gray-500">
                        Your cart is empty
                    </div>
                ) : (
                    <div>
                        <table className="w-full border-collapse border border-gray-300">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="border border-gray-300 p-2">Product</th>
                                    <th className="border border-gray-300 p-2">Size</th>
                                    <th className="border border-gray-300 p-2">Qty</th>
                                    <th className="border border-gray-300 p-2">Amount</th>
                                    <th className="border border-gray-300 p-2">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {mycart.map((item) => (
                                    <tr key={item.product._id + '-' + item.size} className="border border-gray-300">
                                        <td className="border border-gray-300 p-2 flex items-center">
                                            <img
                                                src={"data:image/jpg;base64," + item.product.image}
                                                className="w-16 h-16 object-cover grayscale mr-4"
                                                alt=""
                                            />
                                            <div>
                                                <h3 className="text-lg">{item.product.name}</h3>
                                                <p className="text-gray-500">{item.product.category.name}</p>
                                                <p>{item.product.price.toLocaleString()} VND</p>
                                            </div>
                                        </td>
                                        <td className="border border-gray-300 p-2">
                                            {item.product.sizes && item.product.sizes.length > 0 ? (
                                                <select
                                                    value={item.size || ''}
                                                    onChange={(e) => this.updateSize(item.product._id, e.target.value)}
                                                    className="border px-2 py-1"
                                                >
                                                    <option value="" disabled>Select size</option>
                                                    {item.product.sizes.map((size) => (
                                                        <option key={size} value={size}>{size}</option>
                                                    ))}
                                                </select>
                                            ) : (
                                                item.size || 'N/A'
                                            )}
                                        </td>
                                        <td className="border border-gray-300 p-2 text-center">
                                            <div className="inline-flex items-center overflow-hidden rounded-full border border-gray-300 bg-white shadow-sm">
                                                <button
                                                    onClick={() => this.updateQuantity(item.product._id, Math.max(1, item.quantity - 1))}
                                                    disabled={item.quantity <= 1}
                                                    className="flex h-10 w-10 items-center justify-center border-r border-gray-300 text-lg font-semibold text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
                                                    aria-label={`Decrease quantity of ${item.product.name}`}
                                                >
                                                    -
                                                </button>
                                                <span className="flex h-10 min-w-[3rem] items-center justify-center bg-gray-50 px-4 text-sm font-semibold text-gray-800">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => this.updateQuantity(item.product._id, item.quantity + 1)}
                                                    className="flex h-10 w-10 items-center justify-center border-l border-gray-300 text-lg font-semibold text-gray-700 transition hover:bg-gray-100"
                                                    aria-label={`Increase quantity of ${item.product.name}`}
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </td>
                                        <td className="border border-gray-300 p-2 text-center font-semibold">
                                            {(item.product.price * item.quantity).toLocaleString()} VND
                                        </td>
                                        <td className="border border-gray-300 p-2 text-center">
                                            <button
                                                onClick={() => this.lnkRemoveClick(item.product._id, item.size)}
                                                className="text-red-500 hover:underline"
                                            >
                                                Remove
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="mt-6 flex items-center justify-between rounded-lg border border-gray-300 bg-gray-50 p-4">
                            <div>
                                <p className="text-sm uppercase tracking-wide text-gray-500">Total</p>
                                <p className="text-2xl font-semibold">{this.getTotal(mycart).toLocaleString()} VND</p>
                            </div>
                            <button
                                onClick={() => this.lnkCheckoutClick()}
                                className="border border-black px-6 py-3 text-sm font-semibold uppercase tracking-wide transition hover:bg-black hover:text-white"
                            >
                                Checkout
                            </button>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    getTotal(mycart) {
        return mycart.reduce(
            (sum, item) => sum + (item.product.price * item.quantity),
            0
        );
    }

    lnkRemoveClick(id, size) {
        const mycart = [...this.context.mycart];
        const index = mycart.findIndex(
            x => x.product._id === id && x.size === size
        );

        if (index !== -1) {
            mycart.splice(index, 1);
            this.context.setMycart(mycart);
        }
    }

    updateQuantity(id, qty) {
        const mycart = [...this.context.mycart];
        const index = mycart.findIndex(x => x.product._id === id);

        if (index !== -1 && qty >= 1) {
            mycart[index].quantity = parseInt(qty, 10);
            this.context.setMycart(mycart);
        }
    }

    updateSize(id, size) {
        const mycart = [...this.context.mycart];
        const index = mycart.findIndex(x => x.product._id === id);

        if (index !== -1) {
            mycart[index].size = size;
            this.context.setMycart(mycart);
        }
    }

    lnkCheckoutClick() {
        if (window.confirm('Are you sure you want to checkout?')) {
            if (this.context.mycart.length > 0) {
                const total = this.getTotal(this.context.mycart);
                const items = this.context.mycart;
                const customer = this.context.customer;

                if (customer) {
                    this.apiCheckout(total, items, customer);
                } else {
                    alert('Please login first!');
                    this.props.navigate('/login');
                }
            } else {
                alert('Your cart is empty');
            }
        }
    }

    apiCheckout(total, items, customer) {
        const body = { total: total, items: items, customer: customer };
        const config = { headers: { 'x-access-token': this.context.token } };

        axios.post('/api/customer/checkout', body, config)
            .then((res) => {
                if (res.data) {
                    alert('THANKS FOR YOUR ORDER!');
                    this.context.setMycart([]);
                    this.props.navigate('/home');
                } else {
                    alert('CHECKOUT FAILED!');
                }
            })
            .catch(err => {
                console.error(err);
                alert('Server Error (500)');
            });
    }
}

export default withRouter(Mycart);
