import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import { useState, useEffect } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Main from "./components/Main";
import { useSelector, useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { actionCreators } from "./state/index";


function App() {
  
  const cart = useSelector((state) => state.cart);
  
  const dispatch = useDispatch();
  
  const AC = bindActionCreators(actionCreators, dispatch);
  // const { addToCart, removeFromCart } = bindActionCreates(actionCreators, dispatch);

  return (
    <div className="App">
      <Header />
        <Main />
      <Footer />
    </div>
  );
}

export default App;
