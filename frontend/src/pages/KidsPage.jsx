import React, { useEffect, useState } from 'react';
import kidsData from '../assets/kids'; // Import from your assets
import './kids.css';

export default function KidsPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Process the imported kids data
    const formattedProducts = kidsData.map(product => ({
      ...product,
      image: `http://localhost:5000${product.image}`
    }));
    setProducts(formattedProducts);
  }, []);

  return (
    <div className="kids-container">
      <h1>Kids Collection</h1>
      <div className="grid">
        {products.map((p) => (
          <div key={p.id || p.name} className="card">
            <img 
              src={p.image} 
              alt={p.name} 
              onError={(e) => {
                e.target.src = '/placeholder-image.jpg'; // Fallback image
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