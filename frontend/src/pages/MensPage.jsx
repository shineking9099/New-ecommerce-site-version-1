import React, { useEffect, useState } from 'react';
import mensData from '../assets/mens'; // Import local data
import './mens.css';

export default function MensPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const formattedProducts = mensData.map(product => ({
      ...product,
      image: `http://localhost:5000${product.image}`
    }));
    setProducts(formattedProducts);
  }, []);

  return (
    <div className="mens-container">
      <h1>Mens Collection</h1>
      <div className="grid">
        {products.map((p) => (
          <div key={p.id || p.name} className="card">
            <img 
              src={p.image} 
              alt={p.name} 
              onError={(e) => {
                e.target.src = '/placeholder-image.jpg';
                console.error('Error loading image:', p.image);
              }}
            />
            <h4>{p.name}</h4>
            <p>Rs. {p.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
