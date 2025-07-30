import React, { useContext } from "react";
import { ShopContext } from "../Context/ShopContext";
import Banner from "../Pagesbanner/banner";
import ProductCard from "../Cart/ProductCard";
import './offers.css';

const Offers = () => {
  const { allProducts } = useContext(ShopContext);

  const offerProducts = allProducts.filter(
    (product) => product.category === "offers"
  );

  return (
    <Banner
      category="Special Offers"
      bannerImage="/product/shop_banner.png"
    >
      <div className="offers-container">
        <h1 className="offers-title">Special Offers</h1>
        <div className="offers-grid">
          {offerProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </Banner>
  );
};

export default Offers;