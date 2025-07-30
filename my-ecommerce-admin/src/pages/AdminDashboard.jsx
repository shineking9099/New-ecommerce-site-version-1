import React, { useEffect, useState } from 'react';
import './AdminDashboard.css';

const CATEGORIES = ['MobileandGadgets', 'Healthandbeauty', 'Extras', 'offers'];

export default function AdminDashboard() {
  const [products, setProducts] = useState({});
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const results = await Promise.all(
          CATEGORIES.map(cat =>
            fetch(`http://localhost:5000/api/products/${cat}`).then(res =>
              res.ok ? res.json() : []
            )
          )
        );
        const data = CATEGORIES.reduce((acc, cat, i) => {
          acc[cat] = results[i] || [];
          return acc;
        }, {});
        setProducts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const deleteProduct = async (category, id) => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`http://localhost:5000/api/products/${category}/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Delete failed');
      setProducts(prev => ({
        ...prev,
        [category]: prev[category].filter(p => p.id !== id),
      }));
    } catch (err) {
      alert('❌ Failed to delete product');
    }
  };

  const updateProduct = async () => {
    if (!editing) return;
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`http://localhost:5000/api/products/${editing.category}/${editing.id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: editing.name,
          price: parseFloat(editing.price),
          new_price: parseFloat(editing.new_price),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Update failed');
      setProducts(prev => ({
        ...prev,
        [editing.category]: prev[editing.category].map(p =>
          p.id === editing.id ? data.product : p
        ),
      }));
      setEditing(null);
    } catch (err) {
      alert('❌ ' + err.message);
    }
  };

  if (loading) return <div className="admin-dash-loading">Loading...</div>;

  return (
    <div className="admin-dash-wrapper">
      <h2 className="admin-dash-title">Product Management</h2>
      <div className="admin-dash-categories">
        {CATEGORIES.map(cat => (
          <div key={cat} className="admin-dash-column">
            <h3>{cat}</h3>
            {products[cat]?.length ? products[cat].map(product => (
              <div key={product.id} className="admin-dash-card">
                {editing?.id === product.id ? (
                  <div className="admin-dash-edit-form">
                    <input value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })} />
                    <input value={editing.price} type="number" onChange={e => setEditing({ ...editing, price: e.target.value })} />
                    <input value={editing.new_price} type="number" onChange={e => setEditing({ ...editing, new_price: e.target.value })} />
                    <div className="admin-dash-edit-actions">
                      <button onClick={updateProduct}>Save</button>
                      <button onClick={() => setEditing(null)}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="admin-dash-image">
                      <img src={`http://localhost:5000${product.image}`} alt={product.name} />
                    </div>
                    <div className="admin-dash-info">
                      <h4>{product.name}</h4>
                      <p className="admin-dash-price">Rs. {product.price}</p>
                      {product.new_price && <p className="admin-dash-old-price">Old: Rs. {product.new_price}</p>}
                    </div>
                    <div className="admin-dash-actions">
                      <button onClick={() => setEditing({ ...product, category: cat })}>Edit</button>
                      <button onClick={() => deleteProduct(cat, product.id)}>Delete</button>
                    </div>
                  </>
                )}
              </div>
            )) : <p>No products</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
