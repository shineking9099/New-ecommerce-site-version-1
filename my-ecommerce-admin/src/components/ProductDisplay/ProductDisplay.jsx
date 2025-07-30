// src/components/ProductDisplay/ProductDisplay.jsx
import React, { useEffect, useContext, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ProductDisplay.css";
import { ShopContext } from "../Context/ShopContext";
import GoBackButton from "../GoBackButton/GoBackButton";

const ProductDisplay = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { allProducts, addToCart } = useContext(ShopContext);
  const [loading, setLoading] = useState(true);

  // Find product by id
  const product = allProducts.find((p) => p.id.toString() === productId);

  useEffect(() => {
    window.scrollTo(0, 0);
    // Simulate loading delay for better UX
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, [productId]);

  if (loading) {
    return (
      <div className="product-loading">
        <div className="loading-spinner"></div>
        <p>Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-not-found">
        <h2>Product Not Found</h2>
        <p>The product you're looking for doesn't exist or may have been removed.</p>
        <button onClick={() => navigate("/")}>Back to Home</button>
      </div>
    );
  }

  return (
    <div className="productdisplay">
      <div className="productdisplay-left">
        <div className="productdisplay-img-list">
          <img src={product.image} alt={product.name} />
          <img src={product.image} alt={product.name} />
          <img src={product.image} alt={product.name} />
          <img src={product.image} alt={product.name} />
        </div>
        <div className="productdisplay-img">
          <img
            className="productdisplay-main-img"
            src={product.image}
            alt={product.name}
          />
        </div>
      </div>

      <div className="productdisplay-right">
        <h1>Name{product.name}</h1>
        
<div className="productdisplay-right-prices">
  <p>Review (122)</p>
  <div className="productdisplay-right-price-new">Rs {product.price}</div>
  {product.old_price && (
    <div className="productdisplay-right-price-old">Rs {product.old_price}</div>
  )}
</div>

        <div className="productdisplay-right-description">
          <p>{product.description || "Premium quality product with excellent features."}</p>
        </div>

        <button
          className="addtocart"
          onClick={() => addToCart(product)}
        >
          ADD TO CART
        </button>

        <button
          className="byNow"
          onClick={() => {
            addToCart(product);
            navigate("/register", {
              state: { cartItems: [{ ...product, quantity: 1 }] },
            });
          }}
        >
          Buy Now
        </button>

        <GoBackButton />
        <p className="productdisplay-right-category">
          <span>Category:</span> {product.category}
        </p>
        <p className="productdisplay-right-category">
          <span>Tags:</span> Modern, Latest
        </p>
      </div>
    </div>
  );
};

export default ProductDisplay;