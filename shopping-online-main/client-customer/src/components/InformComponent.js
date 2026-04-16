import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import MyContext from '../contexts/MyContext';

class Inform extends Component {
    static contextType = MyContext;

    render() {
        return (
            <div className="flex justify-end items-center gap-6 px-10 py-2 bg-gray-100 text-sm">

                {/* USER */}
                {this.context.token === '' ? (
                    <div className="space-x-4">
                        <Link to='/login'>Login</Link>
                        <Link to='/signup'>Sign-up</Link>
                        <Link to='/active'>Active</Link>
                    </div>
                ) : (
                    <div className="space-x-4">
                        <span>
                            Hello <b>{this.context.customer?.name}</b>
                        </span>

                        <Link to='/home' onClick={() => this.lnkLogoutClick()}>
                            Logout
                        </Link>

                        <Link to='/myprofile'>Profile</Link>
                        <Link to='/myorders'>Orders</Link>
                    </div>
                )}

                {/* CART */}
                <Link to='/mycart' className="ml-4">
                    🛒 Cart ({this.context.mycart ? this.context.mycart.length : 0})
                </Link>

            </div>
        );
    }

    lnkLogoutClick() {
        this.context.setToken('');
        this.context.setCustomer(null);
        this.context.setMycart([]);
    }
}

export default Inform;