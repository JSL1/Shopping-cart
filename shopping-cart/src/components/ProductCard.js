//ProductCard.js
import React, { Component } from "react";
import { Link, useNavigate } from "react-router-dom";

const ProductCard = (props) => {
  
  const navigate = useNavigate();
  const viewProduct = () => {
    navigate("products/" + props.product.id);
  }

  return (
    <div
      className="product-card"
      id={props.product.id}
    >
      <div
        className="product-img-container"
        id={props.product.id}
        style={{ backgroundImage: `url(${props.product.img2})` }}
      >
        <Link to={"product/" + props.product.id}>
          <img src={props.product.img} />
        </Link>
      </div>
      <h4>{props.product.name}</h4>
      <h4>${props.product.price}</h4>
    </div>
  );
}

export default ProductCard;