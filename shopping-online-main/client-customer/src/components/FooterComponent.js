import React, { Component } from 'react';

class Footer extends Component {
  render() {
    return (
      <div className="bg-black text-white mt-20">

        <div className="max-w-[1200px] mx-auto grid grid-cols-3 gap-10 px-10 py-12 text-sm">

          {/* BRAND */}
          <div>
            <h2 className="text-xl tracking-[5px] mb-4">ALTERNA</h2>
            <p className="text-gray-400">
              Modern fashion for modern people. 
              Minimalist design, premium experience.
            </p>
          </div>

          {/* MENU */}
          <div>
            <h3 className="mb-4">MENU</h3>
            <ul className="space-y-2 text-gray-400">
              <li className="hover:text-white cursor-pointer">Home</li>
              <li className="hover:text-white cursor-pointer">Shop</li>
              <li className="hover:text-white cursor-pointer">About</li>
              <li className="hover:text-white cursor-pointer">Contact</li>
            </ul>
          </div>

          {/* CONTACT */}
          <div>
            <h3 className="mb-4">CONTACT</h3>
            <p className="text-gray-400">Email: support@alterna.com</p>
            <p className="text-gray-400 mt-2">Phone: 0123 456 789</p>
          </div>

        </div>

        {/* BOTTOM */}
        <div className="text-center text-gray-500 text-sm pb-6">
          © 2026 ALTERNA. All rights reserved.
        </div>

      </div>
    );
  }
}

export default Footer;