import axios from 'axios';
import React, { Component } from 'react';
import withRouter from '../utils/withRouter';
import MyContext from '../contexts/MyContext';

class ProductDetail extends Component {
    static contextType = MyContext;

    constructor(props) {
        super(props);
        this.state = {
            product: null,
            txtQuantity: 1,
            selectedSize: ""
        };
    }

    render() {
        const prod = this.state.product;
        console.log("PRODUCT:", prod);
        if (prod != null) {
            return (
                <div className="p-10">
                    <h2 className="text-3xl text-center mb-10">
                        PRODUCT DETAILS
                    </h2>

                    <div className="grid grid-cols-2 gap-10">
                        
                        {/* LEFT: IMAGE */}
                        <div>
                            <img
                            src={"data:image/jpg;base64," + prod.image}
                            className="w-full h-[500px] object-cover grayscale
                                       transition duration-500 hover:scale-105"
                            alt={prod.name}
                        />
                        </div>

                        {/* RIGHT: INFO */}
                        <div className="flex flex-col justify-center">
                            <h1 className="text-4xl mb-4">
                                {prod.name}
                            </h1>

                            <p className="text-gray-500 text-xl mb-4">
                                {prod.price.toLocaleString()} VNĐ
                            </p>

                            <p className="mb-4">
                                Category: {prod.category.name}
                            </p>

                            <div className="mb-4">
                                <label className="mr-3">Size:</label>

                                <select
                                    value={this.state.selectedSize || ""}
                                    onChange={(e) => this.setState({ selectedSize: e.target.value })}
                                >
                                    <option value="">Select size</option>
                                    {prod.sizes && prod.sizes.map(size => (
                                        <option key={size} value={size}>{size}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="mt-4 p-4 border tex t-sm bg-gray-50">
                                <b>Size Guide:</b>
                                <p>{prod.sizeGuide}</p>
                            </div>

                            <div className="mb-4">
                                <label className="mr-3">Quantity:</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="99"
                                    value={this.state.txtQuantity}
                                    onChange={(e) =>
                                        this.setState({ txtQuantity: e.target.value })
                                    }
                                    className="border px-3 py-1 w-20"
                                />
                            </div>

                            <button
                                onClick={(e) => this.btnAdd2CartClick(e)}
                                className="w-fit border px-6 py-2 hover:bg-black hover:text-white transition"
                            >
                                ADD TO CART
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return <div className="text-center mt-10">Loading...</div>;
    }

    componentDidMount() {
        const params = this.props.params;
        this.apiGetProduct(params.id);
    }

    apiGetProduct(id) {
        axios.get('/api/customer/products/' + id).then((res) => {
            this.setState({ product: res.data });
        });
    }

    btnAdd2CartClick(e) {
        e.preventDefault();
        
        if (!this.state.selectedSize) {
            alert("Vui lòng chọn size!");
            return;
        }

        const { product, txtQuantity } = this.state;
        const quantity = parseInt(txtQuantity);

        if (quantity > 0 && !isNaN(quantity)) {
            const mycart = [...this.context.mycart];
            const index = mycart.findIndex(
                x => x.product._id === product._id && x.size === this.state.selectedSize
            );

            if (index === -1) {
                mycart.push({
                    product: product,
                    quantity: quantity,
                    size: this.state.selectedSize
                });
            } else {
                mycart[index].quantity += quantity;
            }

            this.context.setMycart(mycart);
            alert('Thêm vào giỏ hàng thành công!');
        } else {
            alert('Vui lòng nhập số lượng hợp lệ');
        }
    }
}

export default withRouter(ProductDetail);