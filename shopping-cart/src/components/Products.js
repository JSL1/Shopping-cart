//Products.js
import React, { Component } from "react";
import { useState, useEffect } from "react";
import uniqid from "uniqid";
import ProductCard from "./ProductCard";
import { productPool } from "./productList";

const Products = (props) => {
  return (
    <div id="store-products">
      {productPool.map(product => (
        <ProductCard
          product={product}
        />
      ))}
    </div>
  );
}

export default Products;