import axios from 'axios';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import withRouter from '../utils/withRouter';

class Menu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            categories: [],
            txtKeyword: ''
        };
    }

    render() {
        return (
            <div className="border-b bg-white">

                <div className="w-full px-10 flex items-center justify-between py-5">

                    {/* LEFT: LOGO + MENU */}
                    <div className="flex items-center gap-10">

                        {/* LOGO */}
                        <div className="text-2xl tracking-[6px] font-light">
                            ALTERNA
                        </div>

                        {/* MENU */}
                        <ul className="flex gap-6 text-sm uppercase tracking-widest">

                            <li>
                                <Link to="/" className="hover:opacity-60 transition">
                                    Home
                                </Link>
                            </li>

                            <li className="relative group cursor-pointer pb-4">

                                <span className="hover:opacity-60 transition">
                                    Products
                                </span>

                                <div className="absolute top-full left-0 w-56 bg-white shadow-xl z-50
                                                opacity-0 invisible translate-y-2
                                                group-hover:opacity-100 group-hover:visible group-hover:translate-y-0
                                                transition duration-300">

                                    <div className="flex flex-col text-sm">

                                        {this.state.categories.map((item) => (
                                            <Link
                                                key={item._id}
                                                to={'/product/category/' + item._id}
                                                className="px-5 py-3 hover:bg-gray-100"
                                            >
                                                {item.name}
                                            </Link>
                                        ))}

                                    </div>

                                </div>

                            </li>

                        </ul>

                    </div>

                    {/* RIGHT: SEARCH */}
                    <form className="flex items-center border-b">
                        <input
                            type="text"
                            placeholder="Search"
                            value={this.state.txtKeyword}
                            onChange={(e) => this.setState({ txtKeyword: e.target.value })}
                            className="outline-none px-2 py-1 text-sm"
                        />
                        <button onClick={(e) => this.btnSearchClick(e)}>
                            🔍
                        </button>
                    </form>

                </div>

            </div>
        );
    }

    componentDidMount() {
        this.apiGetCategories();
    }

    btnSearchClick(e) {
        e.preventDefault();
        this.props.navigate('/product/search/' + this.state.txtKeyword);
    }

    apiGetCategories() {
        axios.get('/api/customer/categories').then((res) => {
            this.setState({ categories: res.data });
        });
    }
}

export default withRouter(Menu);