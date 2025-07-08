import React, { useEffect, useState } from 'react';
import './mens.css';

export default function MensPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/products/mens')
      .then(r => r.json())
      .then(setProducts)
      .catch(console.error);
  }, []);

  return (
    <div className="mens-container">
      <h1>Mens Collection</h1>
      <div className="grid">
        {products.map(p => (
          <div key={p.id} className="card">
            <img src={p.image} alt={p.name} />
            <h4>{p.name}</h4>
            <p>Rs. {p.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
