import React, { useContext } from "react";
import { ShopContext } from "../Context/ShopContext";
import Banner from "../Pagesbanner/banner";
import ProductCard from "../Cart/ProductCard";
import './MobileandGadgets.css';

const MobileandGadgets = () => {
  const { allProducts } = useContext(ShopContext);

  // Filter only products in the 'MobileandGadgets' category
  const gadgetsProducts = allProducts.filter(
    (product) => product.category === "MobileandGadgets"
  );

  return (
    <div className="mobile-gadgets-container">
      <Banner 
        category="Mobile and Gadgets" 
        bannerImage="/product/shop_banner.png" 
      />
      <h1 className="mobile-gadgets-title">Mobile and Gadgets</h1>
      <div className="mobile-gadgets-grid">
        {gadgetsProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default MobileandGadgets;
