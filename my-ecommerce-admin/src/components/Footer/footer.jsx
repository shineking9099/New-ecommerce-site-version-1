import React from 'react';
import { Link } from 'react-router-dom';
import './footer.css';

const Footer = () => {
  const isLoggedIn = localStorage.getItem('adminToken');

  return (
    <div className="footer">
      <div className="footer-logo">
        <p className="tag">SHOPPER</p>
      </div>

      <ul className="footer-links">
        <li>Company</li>
        <li>Products</li>
        <li>Offices</li>
        <li>About</li>
        <li>Contact</li>
      </ul>

      <div className="footer-social-icon">
        <div className="footer-icons-container"><h3>shine@123</h3></div>
        <div className="footer-icons-container"><h3>shine@123</h3></div>
        <div className="footer-icons-container"><h3>03709598407</h3></div>
      </div>

      <div className="footer-copyright">
        <hr />

        <div className="website-request">
          <h2>
            "I created this website! 🚀 Contact me to build a stunning website for your business!"
          </h2>
          <h3 className="white">Contact me on WhatsApp:</h3>
          <a
            href="https://wa.me/923709598407?text=Hello%20there!"
            target="_blank"
            rel="noopener noreferrer"
            className="whatsapp-link"
          >
            Click Here
          </a>

          <div style={{ marginTop: '1rem' }}>
            {!isLoggedIn ? (
              <Link to="/admin/login">
                <button className="login-btn">Admin Login</button>
              </Link>
            ) : (
              <Link to="/admin/dashboard">
                <button className="login-btn">Go to Admin</button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
 