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

        const renderProductCard = (item) => (
            <div key={item._id} className="group">
                <div className="relative overflow-hidden bg-white">
                    <Link to={'/product/' + item._id}>
                        <img
                            src={"data:image/jpg;base64," + item.image}
                            className="h-72 w-full object-cover transition duration-300 group-hover:scale-105"
                            alt={item.name}
                        />
                    </Link>

                    <button
                        onClick={(e) => this.btnAdd2CartClick(e, item)}
                        className="absolute bottom-4 left-1/2 -translate-x-1/2 border border-black bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wide opacity-0 transition duration-300 group-hover:opacity-100 hover:bg-black hover:text-white"
                    >
                        Add to cart
                    </button>
                </div>

                <div className="mt-3 text-center">
                    <p className="text-lg font-medium">{item.name}</p>
                    <p className="text-gray-500">{item.price.toLocaleString()} VND</p>
                </div>
            </div>
        );

        const newprods = this.state.newprods.filter(Boolean).map(renderProductCard);

        const hotprods = this.state.hotprods.filter(Boolean).map(renderProductCard);

        return (
            <div>

                {/* HERO */}
                <div className="relative h-screen overflow-hidden">

                    <img
                        src="https://images.unsplash.com/photo-1617137968427-85924c800a22"
                        className="w-full h-full object-cover
                                   scale-105 hover:scale-110
                                   transition duration-[4000ms]"
                        alt="Modern menswear collection hero banner"
                    />

                    <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-white">

                        <p className="tracking-[4px] text-sm">
                            AUTUMN COLLECTION
                        </p>

                        <h1 className="text-7xl text-center mt-4 leading-tight">
                            THE MODERN <br /> PATRIARCH
                        </h1>

                    </div>
                </div>

                {/* NEW PRODUCTS */}
                <div data-aos="fade-up" className="p-10 bg-gray-100">
                    <h2 className="text-3xl mb-8 text-center">
                        NEW PRODUCTS
                    </h2>

                    <div data-aos="fade-up" className="grid grid-cols-3 gap-8">
                        {newprods}
                    </div>

                    <div className="mt-8 text-center">
                        <Link
                            to="/products"
                            className="inline-flex items-center border border-black px-6 py-3 text-sm font-semibold uppercase tracking-wide transition hover:bg-black hover:text-white"
                        >
                            View all products
                        </Link>
                    </div>
                </div>

                {/* HOT PRODUCTS */}
                {this.state.hotprods.length > 0 && (
                    <div className="p-10">
                        <h2 className="text-3xl mb-8 text-center">
                            HOT PRODUCTS
                        </h2>

                        <div data-aos="fade-up" className="grid grid-cols-3 gap-8">
                            {hotprods}
                        </div>
                    </div>
                )}

            </div>
        );
    }

    componentDidMount() {
        this.apiGetNewProducts();
        this.apiGetHotProducts();
    }

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
