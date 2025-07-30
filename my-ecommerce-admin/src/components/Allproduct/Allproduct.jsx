import React, { useContext } from "react";
import { ShopContext } from "../Context/ShopContext";
import ProductCard from "../Cart/ProductCard"; // Adjust relative path if needed
import "./Allproduct.css";

const Allproduct = () => {
  const { allProducts } = useContext(ShopContext);

  return (
    <div className="all-products-container">
      <h1>All Products</h1>
      <div className="all-products-grid">
        {allProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Allproduct;
