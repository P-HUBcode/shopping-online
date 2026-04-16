import axios from 'axios';
import React, { Component } from 'react';

class Signup extends Component {
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
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="bg-white p-10 shadow-lg w-[400px]">

          <h2 className="text-3xl text-center mb-6">
            SIGN UP
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
              onClick={e => this.btnSignupClick(e)}
              className="w-full border py-2 hover:bg-black hover:text-white transition"
            >
              SIGN UP
            </button>
          </form>
        </div>
      </div>
    );
  }

  btnSignupClick(e) {
    e.preventDefault();
    const { txtUsername, txtPassword, txtName, txtPhone, txtEmail } = this.state;

    if (txtUsername && txtPassword && txtName && txtPhone && txtEmail) {
      const account = {
        username: txtUsername,
        password: txtPassword,
        name: txtName,
        phone: txtPhone,
        email: txtEmail
      };
      this.apiSignup(account);
    } else {
      alert('Please fill all fields');
    }
  }

  apiSignup(account) {
    axios.post('/api/customer/signup', account).then(res => {
      alert(res.data.message);
    });
  }
}

export default Signup;