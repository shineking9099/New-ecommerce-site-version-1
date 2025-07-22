import React, { useEffect, useState } from 'react';
import './kids.css';

export default function KidsPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/products/kids')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setProducts(data);
      })
      .catch(error => {
        console.error('Error fetching products:', error);
      });
  }, []);

  return (
    <div className="kids-container">
      <h1>Kids Collection</h1>
      <div className="grid">
        {products.map(p => (
          <div key={p.id} className="card">
            <img 
              src={`http://localhost:5000/uploads/${p.image.split('/').pop()}`} 
              alt={p.name} 
              onError={(e) => {
                e.target.onerror = null; 
                e.target.src = '/placeholder.jpg';
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
