//Footer.js
import React, { Component } from "react";
import { Link, useNavigate } from "react-router-dom";

const Footer = () => {
  return (
    <div className="footer">
      <h3> &copy; 2023 Jeremy St. Pierre <Link to="http://github.com/JSL1"><img className="github" src="github-mark.png" /></Link></h3>
    </div>
  );
}

export default Footer;