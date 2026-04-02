import axios from 'axios';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import MyContext from '../contexts/MyContext'; 

class Home extends Component {
    static contextType = MyContext; 

    constructor(props) {
        super(props);
        this.state = {
            newprods: [],
            hotprods: []
        };
    }

    // Hàm xử lý thêm vào giỏ hàng trực tiếp từ trang chủ
    btnAdd2CartClick(e, item) {
        e.preventDefault();
        const product = item;
        const quantity = 1; 
        const mycart = [...this.context.mycart]; 
        const index = mycart.findIndex(x => x.product._id === product._id);
        
        if (index === -1) {
            mycart.push({ product: product, quantity: quantity });
        } else {
            mycart[index].quantity += quantity;
        }
        
        this.context.setMycart(mycart);
        alert('Đã thêm vào giỏ hàng!');
    }

    render() {
        // Render danh sách sản phẩm mới
        const newprods = this.state.newprods.map((item) => {
            return (
                <div key={item._id} className="inline">
                    <figure>
                        <Link to={'/product/' + item._id}>
                            <img src={"data:image/jpg;base64," + item.image} width="300px" height="300px" alt={item.name} />
                        </Link>
                        <figcaption className="text-center">
                            <div className="product-name-label">{item.name}</div>
                            <div className="product-price-label">Price: {item.price.toLocaleString()}</div>
                            <button className="btn-add-cart-home" onClick={(e) => this.btnAdd2CartClick(e, item)}>
                                ADD TO CART
                            </button>
                        </figcaption>
                    </figure>
                </div>
            );
        });

        // Render danh sách sản phẩm hot
        const hotprods = this.state.hotprods.map((item) => {
            return (
                <div key={item._id} className="inline">
                    <figure>
                        <Link to={'/product/' + item._id}>
                            <img src={"data:image/jpg;base64," + item.image} width="300px" height="300px" alt={item.name} />
                        </Link>
                        <figcaption className="text-center">
                            <div className="product-name-label">{item.name}</div>
                            <div className="product-price-label">Price: {item.price.toLocaleString()}</div>
                            <button className="btn-add-cart-home" onClick={(e) => this.btnAdd2CartClick(e, item)}>
                                ADD TO CART
                            </button>
                        </figcaption>
                    </figure>
                </div>
            );
        });

        return (
            <div className="align-center">
                <h2 className="text-center">NEW PRODUCTS</h2>
                <div className="product-container">
                    {newprods}
                </div>
                
                {this.state.hotprods.length > 0 ? (
                    <>
                        <h2 className="text-center" style={{ marginTop: '40px' }}>HOT PRODUCTS</h2>
                        <div className="product-container">
                            {hotprods}
                        </div>
                    </>
                ) : <div />}
            </div>
        );
    }

    componentDidMount() {
        this.apiGetNewProducts();
        this.apiGetHotProducts();
    }

    // apis
    apiGetNewProducts() {
        axios.get('/api/customer/products/new').then((res) => {
            this.setState({ newprods: res.data });
        });
    }

    apiGetHotProducts() {
        axios.get('/api/customer/products/hot').then((res) => {
            this.setState({ hotprods: res.data });
        });
    }
}

export default Home;