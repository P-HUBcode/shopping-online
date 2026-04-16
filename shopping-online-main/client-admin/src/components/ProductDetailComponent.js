import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';

class ProductDetail extends Component {
    static contextType = MyContext;

    constructor(props) {
        super(props);
        this.state = {
            categories: [],
            txtID: '',
            txtName: '',
            txtPrice: 0,
            cmbCategory: '',
            imgProduct: '',
            txtSizes: '',          // 👈 THÊM
            txtSizeGuide: '' 
        };
    }

    render() {
        // Render danh sách category vào dropdown select
        const cates = this.state.categories.map((cate) => {
            return (
                <option key={cate._id} value={cate._id}>
                    {cate.name}
                </option>
            );
        });

        return (
            <div className="float-right">
                <h2 className="text-center">PRODUCT DETAIL</h2>

                <form>
                    <table>
                        <tbody>
                            <tr>
                                <td>ID</td>
                                <td><input type="text" value={this.state.txtID} readOnly={true} /></td>
                            </tr>
                            <tr>
                                <td>Name</td>
                                <td><input type="text" value={this.state.txtName} onChange={(e) => { this.setState({ txtName: e.target.value }) }} /></td>
                            </tr>
                            <tr>
                                <td>Price</td>
                                <td><input type="number" value={this.state.txtPrice} onChange={(e) => { this.setState({ txtPrice: e.target.value }) }} /></td>
                            </tr>
                            <tr>
                                <td>Image</td>
                                <td><input type="file" name="fileImage" accept="image/jpeg, image/png, image/gif" onChange={(e) => this.previewImage(e)} /></td>
                            </tr>
                            <tr>
                                <td>Category</td>
                                <td>
                                    <select 
                                        value={this.state.cmbCategory} 
                                        onChange={(e) => { this.setState({ cmbCategory: e.target.value }) }}
                                    >
                                        <option value="">-- Choose Category --</option>
                                        {cates}
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <td>Sizes</td>
                                <td>
                                    <input
                                        type="text"
                                        placeholder="VD: S,M,L,XL"
                                        value={this.state.txtSizes || ""}
                                        onChange={(e) => this.setState({ txtSizes: e.target.value })}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>Size Guide</td>
                                <td>
                                    <input
                                        type="text"
                                        placeholder="Hướng dẫn size"
                                        value={this.state.txtSizeGuide || ""}
                                        onChange={(e) => this.setState({ txtSizeGuide: e.target.value })}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td></td>
                                <td>
                                    <input type="submit" value="ADD NEW" onClick={(e) => this.btnAddClick(e)} />
                                    <input type="submit" value="UPDATE" onClick={(e) => this.btnUpdateClick(e)} />
                                    <input type="submit" value="DELETE" onClick={(e) => this.btnDeleteClick(e)} />
                                </td>
                            </tr>
                            <tr>
                                <td colSpan="2">
                                    {this.state.imgProduct && (
                                        <img src={this.state.imgProduct} width="300px" height="300px" alt="preview" />
                                    )}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </form>
            </div>
        );
    }

    componentDidMount() {
        this.apiGetCategories();
    }

    // Cập nhật state khi props.item thay đổi (khi click vào dòng ở danh sách sản phẩm)
    componentDidUpdate(prevProps) {
        if (this.props.item !== prevProps.item && this.props.item) {
            this.setState({
                txtID: this.props.item._id,
                txtName: this.props.item.name,
                txtPrice: this.props.item.price,
                // Kiểm tra category tồn tại trước khi lấy _id
                cmbCategory: this.props.item.category ? this.props.item.category._id : '',
                imgProduct: this.props.item.image ? 'data:image/jpg;base64,' + this.props.item.image : '',
                txtSizes: this.props.item.sizes
                    ? this.props.item.sizes.map(s => s.trim()).join(',')
                    : '',
                txtSizeGuide: this.props.item.sizeGuide || ''
            });
        }
    }

    // Event-handlers
    btnAddClick(e) {
        e.preventDefault();
        const { txtName, txtPrice, cmbCategory, imgProduct } = this.state;
        const image = imgProduct.replace(/^data:image\/[a-z]+;base64,/, '');
        
        if (txtName && txtPrice && cmbCategory && image) {
            const prod = {
                name: txtName,
                price: parseInt(txtPrice),
                category: cmbCategory,
                image: image,
                sizes: this.state.txtSizes
                    ? this.state.txtSizes.split(',').map(s => s.trim()).filter(s => s !== '')
                    : [],
                sizeGuide: this.state.txtSizeGuide
            };
            this.apiPostProduct(prod);
        } else {
            alert('Please input name, price, category and image');
        }
    }

    btnUpdateClick(e) {
        e.preventDefault();
        const { txtID, txtName, txtPrice, cmbCategory, imgProduct } = this.state;
        const image = imgProduct.replace(/^data:image\/[a-z]+;base64,/, '');
        
        if (txtID && txtName && txtPrice && cmbCategory && image) {
            const prod = {
                id: txtID,
                name: txtName,
                price: parseInt(txtPrice),
                category: cmbCategory,
                image: image,
                sizes: this.state.txtSizes
                    ? this.state.txtSizes.split(',').map(s => s.trim()).filter(s => s !== '')
                    : [],
                sizeGuide: this.state.txtSizeGuide
            };
            this.apiPutProduct(prod);
        } else {
            alert('Please input all fields to update');
        }
    }

    btnDeleteClick(e) {
        e.preventDefault();
        if (window.confirm('ARE YOU SURE?')) {
            const id = this.state.txtID;
            if (id) {
                this.apiDeleteProduct(id);
            } else {
                alert('Please select a product to delete');
            }
        }
    }

    previewImage(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (evt) => {
                this.setState({ imgProduct: evt.target.result });
            }
            reader.readAsDataURL(file);
        }
    }

    // APIs
    apiPostProduct(prod) {
        const config = { headers: { 'x-access-token': this.context.token } };
        axios.post('/api/admin/products', prod, config).then((res) => {
            if (res.data) {
                alert('Success!');
                this.apiGetProducts();
            } else {
                alert('Failed!');
            }
        }).catch(err => console.error(err));
    }

    apiPutProduct(prod) {
        const config = { headers: { 'x-access-token': this.context.token } };
        axios.put('/api/admin/products', prod, config).then((res) => {
            if (res.data) {
                alert('Success!');
                this.apiGetProducts();
            } else {
                alert('Failed!');
            }
        }).catch(err => console.error(err));
    }

    apiDeleteProduct(id) {
        const config = { headers: { 'x-access-token': this.context.token } };
        axios.delete('/api/admin/products/' + id, config).then((res) => {
            if (res.data) {
                alert('Deleted!');
                this.apiGetProducts();
            } else {
                alert('Failed!');
            }
        }).catch(err => console.error(err));
    }

    apiGetProducts() {
        const config = { headers: { 'x-access-token': this.context.token } };
        let page = this.props.curPage;
        axios.get('/api/admin/products?page=' + page, config).then((res) => {
            const result = res.data;
            if (result.products && result.products.length > 0) {
                this.props.updateProducts(result.products, result.noPages);
            } else if (page > 1) {
                // Nếu xóa hết ở trang hiện tại thì lùi về trang trước
                axios.get('/api/admin/products?page=' + (page - 1), config).then((res) => {
                    this.props.updateProducts(res.data.products, res.data.noPages);
                });
            } else {
                this.props.updateProducts([], 0);
            }
        });
    }

    apiGetCategories() {
        const config = { headers: { 'x-access-token': this.context.token } };
        axios.get('/api/admin/categories', config).then((res) => {
            this.setState({ categories: res.data });
        }).catch(err => console.error(err));
    }
}

export default ProductDetail;