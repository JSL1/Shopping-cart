import React from "react";
import { useState, useEffect } from "react";
import { productPool } from "./productList";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Header from "./Header";
import { useSelector, useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { actionCreators } from '../state/index';

const Cart = (props) => {
  
  const cart = useSelector((state) => state.cart);
  
  const dispatch = useDispatch();

  const { addToCart, removeFromCart } = bindActionCreators(actionCreators, dispatch);
  
  //function for determining the user's total
  function sumCart() {
    let tot = 0;
    cart.forEach(product => {
      tot = tot + product.price * product.quantity;
    });
    return tot;
  }
  
  const [ cartProducts, setCartProducts ] = useState();
  
  console.log(cart);
  
  return(
    <>
      <Header />
      <div id="cart-main">
      {cart.map((product) => {
        return (
          <div className="cart-item">
            <div className="cart-product-img">
              <img src={product.img} />
            </div>
            <div className="cart-product-body">
              <h2>{product.name}</h2>
              <h3>{Math.ceil((product.price * product.quantity) * 100) / 100}</h3>
              <h3>
              Quantity: {product.quantity}
                <button
                  className="delete-item"
                  onClick={() => removeFromCart(product.id)}
                >
                  <span className="material-symbols-outlined">delete</span>
                </button>
              </h3>
            </div>
          </div>
        )
       })
      }
      <h3>Total: {Math.ceil(sumCart() * 100) / 100}</h3>
      </div>
    </>
  );
}

export default Cart;