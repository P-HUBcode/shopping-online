import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import axios from 'axios';
import withRouter from '../utils/withRouter';

class Mycart extends Component {
    static contextType = MyContext;

    render() {
        const mycart = this.context.mycart.map((item, index) => (
            <tr key={item.product._id} className="datatable">
                <td>{index + 1}</td>
                <td>{item.product._id}</td>
                <td>{item.product.name}</td>
                <td>{item.product.category.name}</td>
                <td><img src={"data:image/jpg;base64," + item.product.image} width="70px" height="70px" alt="" /></td>
                <td>{item.product.price.toLocaleString()}</td>
                <td>{item.quantity}</td>
                <td>{(item.product.price * item.quantity).toLocaleString()}</td>
                <td><span className="link" onClick={() => this.lnkRemoveClick(item.product._id)}>Remove</span></td>
            </tr>
        ));

        return (
            <div className="align-center">
                <h2 className="text-center">ITEM LIST</h2>
                <table className="datatable" border="1">
                    <thead>
                        <tr className="datatable">
                            <th>No.</th><th>ID</th><th>Name</th><th>Category</th><th>Image</th><th>Price</th><th>Qty</th><th>Amount</th><th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mycart}
                        {this.context.mycart.length > 0 ? (
                            <tr>
                                <td colSpan="6"></td>
                                <td style={{ fontWeight: 'bold' }}>Total</td>
                                <td style={{ color: 'red', fontWeight: 'bold' }}>{this.getTotal(this.context.mycart).toLocaleString()}</td>
                                <td><span className="link" onClick={() => this.lnkCheckoutClick()}>CHECKOUT</span></td>
                            </tr>
                        ) : (
                            <tr><td colSpan="9">Your cart is empty</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        );
    }

    getTotal(mycart) {
        return mycart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    }

    lnkRemoveClick(id) {
        const mycart = [...this.context.mycart]; // Copy mảng để React nhận diện thay đổi
        const index = mycart.findIndex(x => x.product._id === id);
        if (index !== -1) {
            mycart.splice(index, 1);
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
        axios.post('/api/customer/checkout', body, config).then((res) => {
            if (res.data) {
                alert('THANKS FOR YOUR ORDER!');
                this.context.setMycart([]); // Xóa sạch giỏ hàng toàn cục
                this.props.navigate('/home');
            } else {
                alert('CHECKOUT FAILED!');
            }
        }).catch(err => {
            console.error(err);
            alert('Server Error (500): Hãy kiểm tra OrderDAO và API trên Server!');
        });
    }
}

export default withRouter(Mycart);