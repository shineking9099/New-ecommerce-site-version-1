// src/components/Navbar/Navbar.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import Logocard from '../logocard/Logocard';

const Navbar = () => {
  const [menu, setMenu] = useState("home");

  return (
    <div className="navbar">
      <div className="nav-top-row">
        <div className="nav-logo">
          <p>SHOPPER</p>
        </div>
        <div className="nav-login-cart">
          <Logocard />
        </div>
      </div>

      <ul className="nav-menu">
        <li onClick={() => setMenu("home")} className={menu === "home" ? "active" : ""}>
          <Link to="/">Home</Link>
        </li>
        <li onClick={() => setMenu("gadgets")} className={menu === "gadgets" ? "active" : ""}>
          <Link to="/MobileandGadgets">Mobile & Gadgets</Link>
        </li>
        <li onClick={() => setMenu("healthbeauty")} className={menu === "healthbeauty" ? "active" : ""}>
          <Link to="/Healthandbeauty">Health & Beauty</Link>
        </li>
        <li onClick={() => setMenu("accessories")} className={menu === "accessories" ? "active" : ""}>
          <Link to="/Extras">Extras</Link>
        </li>
        <li onClick={() => setMenu("offers")} className={menu === "offers" ? "active" : ""}>
          <Link to="/Offers">Offers</Link>
        </li>
      </ul>
    </div>
  );
};

export default Navbar;