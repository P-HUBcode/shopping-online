import axios from 'axios';
import React, { Component } from 'react';

class Active extends Component {
  constructor(props) {
    super(props);
    this.state = {
      txtID: '',
      txtToken: ''
    };
  }

  render() {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="bg-white p-10 shadow-lg w-[400px]">

          <h2 className="text-3xl text-center mb-6">
            ACTIVATE ACCOUNT
          </h2>

          <form>
            <div className="mb-4">
              <label>ID</label>
              <input
                type="text"
                value={this.state.txtID}
                onChange={e => this.setState({ txtID: e.target.value })}
                className="w-full border px-3 py-2 mt-1"
              />
            </div>

            <div className="mb-6">
              <label>Token</label>
              <input
                type="text"
                value={this.state.txtToken}
                onChange={e => this.setState({ txtToken: e.target.value })}
                className="w-full border px-3 py-2 mt-1"
              />
            </div>

            <button
              onClick={e => this.btnActiveClick(e)}
              className="w-full border py-2 hover:bg-black hover:text-white transition"
            >
              ACTIVATE
            </button>
          </form>
        </div>
      </div>
    );
  }

  btnActiveClick(e) {
    e.preventDefault();
    const { txtID, txtToken } = this.state;

    if (txtID && txtToken) {
      this.apiActive(txtID, txtToken);
    } else {
      alert('Please input id and token');
    }
  }

  apiActive(id, token) {
    const body = { id, token };

    axios.post('/api/customer/active', body).then(res => {
      const result = res.data;

      if (result) {
        alert('ACTIVATE SUCCESS!');
      } else {
        alert('ACTIVATE FAILED!');
      }
    });
  }
}

export default Active;