import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import withRouter from '../utils/withRouter';

class Login extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      txtUsername: '',
      txtPassword: ''
    };
  }

  render() {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="bg-white p-10 shadow-lg w-[400px]">

          <h2 className="text-3xl text-center mb-6">
            CUSTOMER LOGIN
          </h2>

          <form>
            <div className="mb-4">
              <label>Username</label>
              <input
                type="text"
                value={this.state.txtUsername}
                onChange={e => this.setState({ txtUsername: e.target.value })}
                className="w-full border px-3 py-2 mt-1"
              />
            </div>

            <div className="mb-6">
              <label>Password</label>
              <input
                type="password"
                value={this.state.txtPassword}
                onChange={e => this.setState({ txtPassword: e.target.value })}
                className="w-full border px-3 py-2 mt-1"
              />
            </div>

            <button
              onClick={e => this.btnLoginClick(e)}
              className="w-full border py-2 hover:bg-black hover:text-white transition"
            >
              LOGIN
            </button>
          </form>
        </div>
      </div>
    );
  }

  btnLoginClick(e) {
    e.preventDefault();
    const { txtUsername, txtPassword } = this.state;

    if (txtUsername && txtPassword) {
      this.apiLogin({ username: txtUsername, password: txtPassword });
    } else {
      alert('Please input username and password');
    }
  }

  apiLogin(account) {
    axios.post('/api/customer/login', account).then(res => {
      const result = res.data;
      if (result.success === true) {
        this.context.setToken(result.token);
        this.context.setCustomer(result.customer);
        this.props.navigate('/home');
      } else {
        alert(result.message);
      }
    });
  }
}

export default withRouter(Login);
