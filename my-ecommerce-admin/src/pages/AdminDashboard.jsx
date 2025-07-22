import React, { useEffect, useState } from 'react';
import './AdminDashboard.css';

const CATEGORIES = ['kids', 'mens', 'women'];

export default function AdminDashboard() {
  const [products, setProducts] = useState({ kids: [], mens: [], women: [] });
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch all products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const results = await Promise.all(
          CATEGORIES.map(cat => 
            fetch(`http://localhost:5000/api/products/${cat}`)
              .then(res => res.ok ? res.json() : [])
          )
        );
        
        const productsData = CATEGORIES.reduce((acc, cat, index) => {
          acc[cat] = results[index] || [];
          return acc;
        }, {});
        
        setProducts(productsData);
      } catch (error) {
        console.error('Fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const deleteProduct = async (category, id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/products/${category}/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete product');
      }

      setProducts(prev => ({
        ...prev,
        [category]: prev[category].filter(p => p.id !== id)
      }));
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete product');
    }
  };
const updateProduct = async () => {
  if (!editing) return;

  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication token missing');
    }

    const { category, id, name, price } = editing;
    
    const response = await fetch(`http://localhost:5000/api/products/${category}/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        name: editing.name,
        price: parseFloat(editing.price)
      })
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || 'Failed to update product');
    }

    // Update local state
    setProducts(prev => ({
      ...prev,
      [category]: prev[category].map(p => 
        p.id === id ? { ...p, name, price: parseFloat(price) } : p
      )
    }));

    setEditing(null);
  } catch (error) {
    console.error('Update error:', error);
    alert(error.message || 'Failed to update product');
  }
};

  if (loading) return <div className="loading">Loading products...</div>;

  return (
    <div className="admin-dashboard">
      <h2>Product Management</h2>
      
      <div className="categories-container">
        {CATEGORIES.map(category => (
          <div key={category} className="category-column">
            <h3>{category.charAt(0).toUpperCase() + category.slice(1)}</h3>
            
            {products[category].length === 0 ? (
              <p>No products in this category</p>
            ) : (
              products[category].map(product => (
                <div key={product.id} className="product-card">
                  {editing?.id === product.id && editing?.category === category ? (
                    <div className="edit-form">
                      <input
                        type="text"
                        value={editing.name}
                        onChange={e => setEditing({...editing, name: e.target.value})}
                      />
                      <input
                        type="number"
                        value={editing.price}
                        onChange={e => setEditing({...editing, price: e.target.value})}
                        step="0.01"
                        min="0"
                      />
                      <div className="edit-actions">
                        <button onClick={updateProduct}>Save</button>
                        <button onClick={() => setEditing(null)}>Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="product-image">
                        <img 
                          src={`http://localhost:5000${product.image}`} 
                          alt={product.name}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/placeholder.jpg';
                          }}
                        />
                      </div>
                      <div className="product-info">
                        <h4>{product.name}</h4>
                        <p>Rs. {product.price.toFixed(2)}</p>
                      </div>
                      <div className="product-actions">
                        <button onClick={() => setEditing({
                          ...product,
                          category
                        })}>
                          Edit
                        </button>
                        <button onClick={() => deleteProduct(category, product.id)}>
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        ))}
      </div>
    </div>
  );
}