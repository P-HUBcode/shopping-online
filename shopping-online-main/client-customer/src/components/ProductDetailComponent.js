import axios from 'axios';
import React, { Component } from 'react';
import withRouter from '../utils/withRouter';
import MyContext from '../contexts/MyContext';

class ProductDetail extends Component {
    // Truy cập global state từ MyProvider (Lab 7)
    static contextType = MyContext;

    constructor(props) {
        super(props);
        this.state = {
            product: null,
            txtQuantity: 1 // Mặc định là 1 khi vào trang chi tiết
        };
    }

    render() {
        const prod = this.state.product;
        if (prod != null) {
            return (
                <div className="align-center">
                    <h2 className="text-center">PRODUCT DETAILS</h2>
                    <figure className="caption-right">
                        {/* PHẦN BÊN TRÁI: HÌNH ẢNH */}
                        <img 
                            src={"data:image/jpg;base64," + prod.image} 
                            width="400px" 
                            height="400px" 
                            alt={prod.name} 
                        />
                        
                        {/* PHẦN BÊN PHẢI: THÔNG TIN CHI TIẾT */}
                        <figcaption>
                            <form>
                                <table>
                                    <tbody>
                                        <tr>
                                            <td align="right">ID:</td>
                                            <td>{prod._id}</td>
                                        </tr>
                                        <tr>
                                            <td align="right">Name:</td>
                                            <td>{prod.name}</td>
                                        </tr>
                                        <tr>
                                            <td align="right">Price:</td>
                                            <td>{prod.price.toLocaleString()} VNĐ</td> 
                                        </tr>
                                        <tr>
                                            <td align="right">Category:</td>
                                            <td>{prod.category.name}</td>
                                        </tr>
                                        <tr>
                                            <td align="right">Quantity:</td>
                                            <td>
                                                <input 
                                                    type="number" 
                                                    min="1" 
                                                    max="99" 
                                                    value={this.state.txtQuantity} 
                                                    onChange={(e) => { this.setState({ txtQuantity: e.target.value }) }} 
                                                />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td></td>
                                            <td>
                                                <input 
                                                    className="input-button"
                                                    type="submit" 
                                                    value="ADD TO CART" 
                                                    onClick={(e) => this.btnAdd2CartClick(e)} 
                                                />
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </form>
                        </figcaption>
                    </figure>
                </div>
            );
        }
        return (<div />);
    }

    componentDidMount() {
        const params = this.props.params;
        this.apiGetProduct(params.id);
    }

    // --- APIS ---
    apiGetProduct(id) {
        axios.get('/api/customer/products/' + id).then((res) => {
            const result = res.data;
            this.setState({ product: result });
        }).catch((err) => console.error("Lỗi lấy chi tiết SP: ", err));
    }

    // --- EVENT-HANDLERS ---
    btnAdd2CartClick(e) {
        e.preventDefault();
        const { product, txtQuantity } = this.state;
        const quantity = parseInt(txtQuantity);
        
        if (quantity > 0 && !isNaN(quantity)) {
            // Sao chép giỏ hàng hiện tại từ context
            const mycart = [...this.context.mycart]; 
            
            // Tìm xem sản phẩm này đã có trong giỏ chưa
            const index = mycart.findIndex(x => x.product._id === product._id);
            
            if (index === -1) { 
                // Nếu chưa có: Thêm item mới
                const newItem = { product: product, quantity: quantity };
                mycart.push(newItem);
            } else { 
                // Nếu đã có: Cộng dồn số lượng
                mycart[index].quantity += quantity;
            }
            
            // Cập nhật lại context toàn cục
            this.context.setMycart(mycart);
            alert('Thêm vào giỏ hàng thành công!');
        } else {
            alert('Vui lòng nhập số lượng hợp lệ (tối thiểu là 1)');
        }
    }
}

export default withRouter(ProductDetail);