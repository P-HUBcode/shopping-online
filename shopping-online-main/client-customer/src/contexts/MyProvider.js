import React, { Component } from 'react';
import MyContext from './MyContext';

class MyProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: '',
      customer: null,
      mycart: [] // Khởi tạo mảng rỗng
    };
  }

  // Hàm này cực kỳ quan trọng để cập nhật giỏ hàng
  setMycart = (value) => {
    this.setState({ mycart: value });
  }

  setToken = (value) => {
    this.setState({ token: value });
  }

  setCustomer = (value) => {
    this.setState({ customer: value });
  }

  render() {
    return (
      /* PHẢI CÓ setMycart TRONG VALUE THÌ CÁC FILE KHÁC MỚI GỌI ĐƯỢC */
      <MyContext.Provider value={{ 
          ...this.state, 
          setToken: this.setToken, 
          setCustomer: this.setCustomer, 
          setMycart: this.setMycart 
      }}>
        {this.props.children}
      </MyContext.Provider>
    );
  }
}

export default MyProvider;