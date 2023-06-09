import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import RouteSwitch from "./RouteSwitch";
import { BrowserRouter } from "react-router-dom";
import reportWebVitals from './reportWebVitals';
import { Provider } from "react-redux";
import { store } from "./state/store";

//Store >> Globalized state
//Action >> Whatever you want to do. (add to cart)
//Reducer >> Describes how your ACTION modifies the STORE,  globalized state


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <RouteSwitch />
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
