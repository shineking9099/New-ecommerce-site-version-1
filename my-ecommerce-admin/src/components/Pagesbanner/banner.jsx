import React, { useContext } from "react";
import { ShopContext } from "../Context/ShopContext";
import "./banner.css";

const Banner = ({ category = "", bannerImage, children }) => {
  const { allProducts } = useContext(ShopContext);

  const products = allProducts?.filter((item) =>
    item?.category?.toLowerCase() === category?.toLowerCase()
  ) || [];

  return (
    <div className="modern-banner-wrapper">
      {/* Full-width Modern Banner */}
      <div 
        className="modern-banner-fullwidth"
        style={{
          backgroundImage: `linear-gradient(89deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 100%), url(${bannerImage || process.env.PUBLIC_URL + '/uploads/shop_banner.png'})`
        }}
      >
        <div className="banner-content-container">
          <div className="banner-text-section">
            <h1 className="banner-main-heading">
              Premium <span className="accent-text">{category}</span> Collection
            </h1>
    
            <div className="benefits-list">
              <div className="benefit">
                <span className="benefit-emoji">🚚</span>
                <span>Free Shipping</span>
              </div>
              <div className="benefit">
                <span className="benefit-emoji">💳</span>
                <span>Secure Payments</span>
              </div>
              <div className="benefit">
                <span className="benefit-emoji">↩️</span>
                <span>Easy Returns</span>
              </div>
            </div>

            <button 
              className="shop-now-button"
              onClick={() => window.scrollTo({ top: 500, behavior: "smooth" })}
            >
              Shop Now
              <svg className="arrow-svg" viewBox="0 0 24 24">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Children Content */}
      <div className="banner-child-content">
        {children}
      </div>
    </div>
  );
};

export default Banner;