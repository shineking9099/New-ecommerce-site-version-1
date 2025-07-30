import React, { useContext } from "react";
import { ShopContext } from "../Context/ShopContext";
import Banner from "../Pagesbanner/banner";
import ProductCard from "../Cart/ProductCard";
import './Extras.css';

const Extras = () => {
  const { allProducts } = useContext(ShopContext);

  const extrasProducts = allProducts.filter(
    (product) => product.category === "Extras"
  );

  return (
    <Banner
      category="Extras"
      bannerImage="/product/shop_banner.png"
    >
      <div className="extras-container">
        <h1 className="extras-title">Extras</h1>
        <div className="extras-grid">
          {extrasProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </Banner>
  );
};

export default Extras;