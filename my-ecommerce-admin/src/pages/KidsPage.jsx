import React, { useEffect, useState } from 'react';
import './kids.css';

export default function KidsPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/products/kids')
      .then((r) => r.json())
      .then(setProducts)
      .catch(console.error);
  }, []);

  return (
    <div className="kids-container">
      <h1>Kids Collection</h1>
      <div className="grid">
        {products.map((p) => (
          <div key={p.id} className="card">
            <img src={`http://localhost:5000${p.image}`} alt={p.name} />
            <h4>{p.name}</h4>
            <p>Rs. {p.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
