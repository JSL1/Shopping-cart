//Header.js
import React, { Component } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

const Header = () => {
  
  const cart = useSelector((state) => state.cart);
  
  return (
    <div id="header">
      <div className="navbar">
        <div className="h2 logo">
          <span>GameStart
            <span className="material-symbols-outlined">
              videogame_asset
            </span>
          </span>
        </div>
        <div className="h2">
          <Link to="../">Home</Link>
        </div>
        <div className="h2">
          <Link to="../">Shop</Link>
        </div>
      </div>
      <div className="cart-icon">
        <Link
          to={{
            pathname: "/cart",
          }}>
          {cart.length}<span className="material-symbols-outlined">shopping_cart</span>
        </Link>
      </div>
    </div>
  );
}

export default Header;