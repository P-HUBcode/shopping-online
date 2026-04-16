import axios from 'axios';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import withRouter from '../utils/withRouter';

class Product extends Component {
    constructor(props) {
        super(props);
        this.state = {
            products: []
        };
    }

    render() {
        const prods = this.state.products.map((item) => (
            <div key={item._id} className="group">

                {/* IMAGE */}
                <Link to={'/product/' + item._id}>
                    <img
                        src={"data:image/jpg;base64," + item.image}
                        className="w-full h-72 object-cover hover:scale-105 transition duration-300"
                        alt={item.name}
                    />
                </Link>

                {/* INFO */}
                <div className="mt-3 text-center">
                    <div className="font-medium text-lg">
                        {item.name}
                    </div>

                    <div className="text-gray-400">
                        {item.price.toLocaleString()} VND
                    </div>
                </div>

            </div>
        ));

        return (
            <div className="p-10">
                <h2 className="text-3xl text-center mb-8">
                    COLLECTION
                </h2>

                <div className="grid grid-cols-4 gap-8">
                    {prods}
                </div>
            </div>
        );
    }

    componentDidMount() {
        const params = this.props.params;
        if (params.cid) {
            this.apiGetProductsByCatID(params.cid);
        } else if (params.keyword) {
            this.apiGetProductsByKeyword(params.keyword);
        } else {
            this.apiGetAllProducts();
        }
    }

    componentDidUpdate(prevProps) {
        const params = this.props.params;
        if (params.cid && params.cid !== prevProps.params.cid) {
            this.apiGetProductsByCatID(params.cid);
        } else if (params.keyword && params.keyword !== prevProps.params.keyword) {
            this.apiGetProductsByKeyword(params.keyword);
        } else if (!params.cid && !params.keyword && (prevProps.params.cid || prevProps.params.keyword)) {
            this.apiGetAllProducts();
        }
    }

    apiGetAllProducts() {
        axios.get('/api/customer/products').then((res) => {
            this.setState({ products: res.data });
        });
    }

    apiGetProductsByCatID(cid) {
        axios.get('/api/customer/products/category/' + cid).then((res) => {
            this.setState({ products: res.data });
        });
    }

    apiGetProductsByKeyword(keyword) {
        axios.get('/api/customer/products/search/' + keyword).then((res) => {
            this.setState({ products: res.data });
        });
    }

    btnAdd2CartClick(e, item) {
        e.preventDefault();
        // TODO: wire add-to-cart behavior for product cards
        console.log('Add to cart clicked for', item._id);
    }
}

export default withRouter(Product);
