import axios from 'axios';
import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';
import MyContext from '../contexts/MyContext';

class Myprofile extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      txtUsername: '',
      txtPassword: '',
      txtName: '',
      txtPhone: '',
      txtEmail: ''
    };
  }

  render() {
    if (this.context.token === '') return <Navigate replace to="/login" />;

    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="bg-white p-10 shadow-lg w-[400px]">

          <h2 className="text-3xl text-center mb-6">
            MY PROFILE
          </h2>

          <form>
            <div className="mb-3">
              <label>Username</label>
              <input
                type="text"
                value={this.state.txtUsername}
                onChange={e => this.setState({ txtUsername: e.target.value })}
                className="w-full border px-3 py-2 mt-1"
              />
            </div>

            <div className="mb-3">
              <label>Password</label>
              <input
                type="password"
                value={this.state.txtPassword}
                onChange={e => this.setState({ txtPassword: e.target.value })}
                className="w-full border px-3 py-2 mt-1"
              />
            </div>

            <div className="mb-3">
              <label>Name</label>
              <input
                type="text"
                value={this.state.txtName}
                onChange={e => this.setState({ txtName: e.target.value })}
                className="w-full border px-3 py-2 mt-1"
              />
            </div>

            <div className="mb-3">
              <label>Phone</label>
              <input
                type="tel"
                value={this.state.txtPhone}
                onChange={e => this.setState({ txtPhone: e.target.value })}
                className="w-full border px-3 py-2 mt-1"
              />
            </div>

            <div className="mb-6">
              <label>Email</label>
              <input
                type="email"
                value={this.state.txtEmail}
                onChange={e => this.setState({ txtEmail: e.target.value })}
                className="w-full border px-3 py-2 mt-1"
              />
            </div>

            <button
              onClick={e => this.btnUpdateClick(e)}
              className="w-full border py-2 hover:bg-black hover:text-white transition"
            >
              UPDATE
            </button>
          </form>
        </div>
      </div>
    );
  }

  componentDidMount() {
    if (this.context.customer) {
      this.setState({
        txtUsername: this.context.customer.username,
        txtPassword: '',
        txtName: this.context.customer.name,
        txtPhone: this.context.customer.phone,
        txtEmail: this.context.customer.email
      });
    }
  }

  btnUpdateClick(e) {
    e.preventDefault();
    const { txtUsername, txtPassword, txtName, txtPhone, txtEmail } = this.state;

    if (txtUsername && txtName && txtPhone && txtEmail) {
      const customer = {
        username: txtUsername,
        name: txtName,
        phone: txtPhone,
        email: txtEmail
      };

      if (txtPassword) {
        customer.password = txtPassword;
      }

      this.apiPutCustomer(this.context.customer._id, customer);
    } else {
      alert('Please fill all fields');
    }
  }

  apiPutCustomer(id, customer) {
    const config = { headers: { 'x-access-token': this.context.token } };

    axios.put('/api/customer/customers/' + id, customer, config)
      .then(res => {
        const result = res.data;

        if (result && result.success !== false) {
          alert('UPDATE SUCCESS!');
          this.context.setCustomer(result);
        } else {
          alert('UPDATE FAILED!');
        }
      });
  }
}

export default Myprofile;
