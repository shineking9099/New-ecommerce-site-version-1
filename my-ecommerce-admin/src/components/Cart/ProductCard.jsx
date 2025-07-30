import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShopContext } from "../Context/ShopContext";
import { FaShareAlt, FaCheck, FaTimes } from "react-icons/fa";
import "./ProductCard.css";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const [copyStatus, setCopyStatus] = useState(null);

  const handleBuyNow = () => {

    navigate(`/productdisplay/${product.id}`);
  };

  const copyProductLink = async () => {
    if (!product?.id) {
      setCopyStatus("error");
      setTimeout(() => setCopyStatus(null), 2000);
      return;
    }

    const url = `${window.location.origin}/productdisplay/${product.id}`;

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        setCopyStatus("success");
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = url;
        document.body.appendChild(textArea);
        textArea.select();
        const success = document.execCommand("copy");
        document.body.removeChild(textArea);

        if (success) {
          setCopyStatus("success");
        } else {
          throw new Error("Fallback copy failed");
        }
      }
    } catch (err) {
      console.error("Copy failed:", err);
      setCopyStatus("error");
    } finally {
      setTimeout(() => setCopyStatus(null), 2000);
    }
  };

  return (
    <div className="product-card">
      <div className="product-card-image-wrapper">
        <img
          src={product.image}
          alt={product.name}
          className="product-card-image"
        />
      </div>

      <p className="product-card-name">Name:  {product.name}</p>

      <div className="product-card-prices">
        <div className="product-card-price-new">Rs. {product.price}</div>
        {product.old_price && (
          <div className="product-card-price-old">Rs. {product.old_price}</div>
        )}
      </div>

      <div className="product-card-buttons">
        <button onClick={handleBuyNow} className="product-card-buynow">
          Buy Now
        </button>

        <button
          onClick={copyProductLink}
          className={`product-card-share ${copyStatus ? "status-active" : ""}`}
          aria-label="Share product"
          onTouchStart={copyProductLink}
        >
          {copyStatus === "success" ? (
            <FaCheck className="status-icon" />
          ) : copyStatus === "error" ? (
            <FaTimes className="status-icon" />
          ) : (
            <FaShareAlt />
          )}
        </button>

        {copyStatus && (
          <div className={`copy-status-bubble ${copyStatus}`}>
            {copyStatus === "success" ? "Copied!" : "Copy Failed"}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
