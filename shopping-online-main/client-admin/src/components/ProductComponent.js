import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import ProductDetail from './ProductDetailComponent';

class Product extends Component {
    static contextType = MyContext; // Sử dụng this.context để truy cập global state (token admin)

    constructor(props) {
        super(props);
        this.state = {
            products: [],
            noPages: 0,
            curPage: 1,
            itemSelected: null
        };
    }

    render() {
        // PHÒNG THỦ: Đảm bảo products luôn là một mảng để tránh lỗi .map()
        const products = this.state.products || [];

        const prods = products.map((item) => {
            return (
                <tr key={item._id} className="datatable" onClick={() => this.trItemClick(item)}>
                    <td>{item._id}</td>
                    <td>{item.name}</td>
                    <td>{item.price}</td>
                    {/* Kiểm tra ngày tạo cdate tồn tại */}
                    <td>{item.cdate ? new Date(item.cdate).toLocaleString() : 'N/A'}</td>
                    
                    {/* SỬA LỖI QUAN TRỌNG: Kiểm tra category tồn tại trước khi truy cập .name */}
                    <td>{item.category ? item.category.name : 'No Category'}</td>
                    
                    <td>
                        {item.image ? (
                            <img src={"data:image/jpg;base64," + item.image} width="100px" height="100px" alt="product" />
                        ) : (
                            "No Image"
                        )}
                    </td>
                </tr>
            );
        });

        // PHÒNG THỦ: Kiểm tra noPages để tạo mảng phân trang an toàn
        const noPages = this.state.noPages || 0;
        const pagination = Array.from({ length: noPages }, (_, index) => {
            if ((index + 1) === this.state.curPage) {
                return (<span key={index}>| <b>{index + 1}</b> | </span>);
            } else {
                return (<span key={index} className="link" onClick={() => this.lnkPageClick(index + 1)}>| {index + 1} | </span>);
            }
        });

        return (
            <div>
                <div className="float-left">
                    <h2 className="text-center">PRODUCT LIST</h2>
                    <table className="datatable" border="1">
                        <tbody>
                            <tr className="datatable">
                                <th>ID</th>
                                <th>Name</th>
                                <th>Price</th>
                                <th>Creation date</th>
                                <th>Category</th>
                                <th>Image</th>
                            </tr>
                            {/* Nếu mảng prods rỗng, hiển thị thông báo thay vì để trống */}
                            {prods.length > 0 ? prods : <tr><td colSpan="6" style={{textAlign: 'center'}}>No products found. Please add a category first!</td></tr>}
                            <tr>
                                <td colSpan="6">{pagination}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="inline" />
                {/* Component chi tiết sản phẩm để Thêm/Sửa/Xóa */}
                <ProductDetail 
                    item={this.state.itemSelected} 
                    curPage={this.state.curPage} 
                    updateProducts={this.updateProducts} 
                />
                <div className="float-clear" />
            </div>
        );
    }

    componentDidMount() {
        this.apiGetProducts(this.state.curPage);
    }

    // Xử lý sự kiện click vào số trang
    lnkPageClick(index) {
        this.apiGetProducts(index);
    }

    // Xử lý sự kiện click vào một dòng sản phẩm trong bảng
    trItemClick(item) {
        this.setState({ itemSelected: item });
    }

    // Gọi API lấy danh sách sản phẩm từ Backend
    apiGetProducts(page) {
        const config = { headers: { 'x-access-token': this.context.token } };
        axios.get('/api/admin/products?page=' + page, config)
            .then((res) => {
                const result = res.data;
                if (result && result.products) {
                    this.setState({ 
                        products: result.products, 
                        noPages: result.noPages, 
                        curPage: result.curPage 
                    });
                }
            })
            .catch((err) => {
                console.error("API Get Products Error:", err);
            });
    }

    // Hàm callback để ProductDetail cập nhật lại danh sách sau khi Thêm/Sửa/Xóa
    updateProducts = (products, noPages) => {
        this.setState({ products: products, noPages: noPages });
    }
}

export default Product;