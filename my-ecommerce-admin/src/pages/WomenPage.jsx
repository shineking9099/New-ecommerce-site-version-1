import React, { useEffect, useState } from 'react';
import './women.css';

export default function WomenPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/products/women')
      .then(r => r.json())
      .then(setProducts)
      .catch(console.error);
  }, []);

  return (
    <div className="women-container">
      <h1>Women Collection</h1>
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
