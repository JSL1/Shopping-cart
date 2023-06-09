//ProductPage.js
import React, { Component } from "react";
import { useState, useEffect } from "react";
import Products from "./Products";
import { useParams } from "react-router-dom";
import { productPool } from "./productList";
import Header from "./Header";
import { useSelector, useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { actionCreators } from '../state/index';
import uniqid from "uniqid";

const ProductPage = (props) => {
  
  const [quantity, setQuantity] = useState(1);

  const getProduct = () => {
    let product = productPool.find(product => product.id == id);
    return {
      id: uniqid(),
      name: product.name,
      price: product.price,
      img: product.img,
      img2: product.img2,
      quantity: quantity,
    }
  }

  const [id, setId] = useState(useParams().id);
  const [product, setProduct] = useState(getProduct());

  const qPlus = () => {
    setQuantity(quantity + 1);
  }
  
  const qMinus = () => {
    setQuantity(quantity - 1);
  }
  
  const cart = useSelector((state) => state.cart);
  
  const dispatch = useDispatch();
  
  const { addToCart, removeFromCart } = bindActionCreators(actionCreators, dispatch);
  
  return(
    <>
    <Header />
    <div className="product-page">
      <div className="product-page-img">
        <img src={"../" + product.img} className="product-cover" />
      </div>
      <div className="product-page-body">
      <h3>{product.name}</h3>
        <p className="product-page-description"></p>
        
          <label htmlFor="quantity">Quantity: </label>
          <div className="product-quantity">
            <button class="quantity-adjust" id="quantity-plus" onClick={qPlus}>+</button>
            <button class="quantity-adjust" id="quantity-minus" onClick={qMinus}>-</button>
            <input type="number" min="0" max="10" value={quantity} disabled />
          </div>
          <button
            id="add-to-cart"
            onClick={() => {
              addToCart(getProduct());
            }}
          >
            Add to Cart
          </button>
      </div>
    </div>
    </>
  );
}

export default ProductPage;