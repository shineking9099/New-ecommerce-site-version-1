// src/pages/logocard/Logocard.jsx

import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import { ShopContext } from "../Context/ShopContext";
import "./Logocard.css";

const Logocard = () => {
  const { getCartCount } = useContext(ShopContext);

  return (
    <Link to="/cart" className="logocard">
      <FaShoppingCart className="logocard-icon" />
      <span className="logocard-count">{getCartCount()}</span>
    </Link>
  );
};

export default Logocard;
