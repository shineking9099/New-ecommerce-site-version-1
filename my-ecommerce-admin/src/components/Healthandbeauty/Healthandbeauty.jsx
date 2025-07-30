import React, { useContext } from "react";
import { ShopContext } from "../Context/ShopContext";
import Banner from "../Pagesbanner/banner";
import ProductCard from "../Cart/ProductCard";
import './Healthandbeauty.css';

const Healthandbeauty = () => {
  const { allProducts } = useContext(ShopContext);

  const healthProducts = allProducts.filter(
    (product) => product.category === "Healthandbeauty"
  );

  return (
    <Banner
      category="Health & Beauty"
      bannerImage="/product/shop_banner.png"
    >
      <div className="health-beauty-container">
        <h1 className="health-beauty-title">Health & Beauty</h1>
        <div className="health-beauty-grid">
          {healthProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </Banner>
  );
};

export default Healthandbeauty;