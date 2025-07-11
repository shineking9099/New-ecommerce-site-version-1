import React, { useEffect, useState } from 'react';
import kidsData from '../assets/kids';
import mensData from '../assets/mens';
import womenData from '../assets/women';

const CATEGORIES = [
  { key: 'kids', label: 'Kids', data: kidsData },
  { key: 'mens', label: 'Mens', data: mensData },
  { key: 'women', label: 'Women', data: womenData },
];

export default function AdminDashboard() {
  const [data, setData] = useState({
    kids: [],
    mens: [],
    women: []
  });
  const [editingId, setEditingId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Initialize data with proper IDs
  useEffect(() => {
    const formatted = {};
    CATEGORIES.forEach(({ key, data: categoryData }) => {
      formatted[key] = categoryData.map(product => ({
        ...product,
        id: product.id || Date.now(), // Ensure every product has an ID
        image: `http://localhost:5000${product.image}`
      }));
    });
    setData(formatted);
  }, []);

  const handleDelete = async (categoryKey, id) => {
  if (!window.confirm('Are you sure you want to delete this product?')) {
    return;
  }

  try {
    const token = localStorage.getItem('token'); // Ensure this matches your auth token key
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`http://localhost:5000/products/${categoryKey}/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || 'Failed to delete product');
    }

    // Update local state
    setData(prev => ({
      ...prev,
      [categoryKey]: prev[categoryKey].filter(item => String(item.id) !== String(id))
    }));

    alert('Product deleted successfully!');
  } catch (error) {
    console.error('Delete error:', error);
    alert(`Delete failed: ${error.message}`);
  }
};

  const handleEdit = (categoryKey, id, field, value) => {
    setData(prev => ({
      ...prev,
      [categoryKey]: prev[categoryKey].map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    }));
  };

  const handleSave = async (categoryKey, product) => {
    setIsSaving(true);
    try {
      const response = await fetch(`http://localhost:5000/products/${categoryKey}/${product.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          name: product.name,
          price: product.price
        })
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to update product');
      }

      // Refresh data from backend after successful update
      const refreshResponse = await fetch(`http://localhost:5000/products/${categoryKey}`);
      const updatedData = await refreshResponse.json();

      setData(prev => ({
        ...prev,
        [categoryKey]: updatedData.map(p => ({
          ...p,
          image: `http://localhost:5000${p.image}`
        }))
      }));

      setEditingId(null);
      alert('Product updated successfully!');
    } catch (error) {
      console.error('Error updating product:', error);
      alert(`Failed to update product: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };
return (
  <div style={{ display: 'flex', gap: '20px', padding: '20px', flexWrap: 'wrap' }}>
    {CATEGORIES.map(({ key, label }) => (
      <div key={key} style={{ flex: '1 1 300px', minWidth: '300px' }}>
        <h2>{label} Collection</h2>
        {data[key].length === 0 && <p>No products</p>}
        {data[key].map((p, index) => {
          // Generate a unique key combining category, id, and index
          const uniqueKey = `${key}-${p.id || 'no-id'}-${index}`;
          
          return (
            <div
              key={uniqueKey}
              style={{
                border: '1px solid #ccc',
                borderRadius: '8px',
                padding: '10px',
                marginBottom: '10px',
                textAlign: 'center'
              }}
            >
              <img
                src={p.image}
                alt={p.name}
                style={{ width: '100%', height: 'auto', borderRadius: '4px' }}
                onError={(e) => {
                  e.target.src = '/placeholder-image.jpg';
                }}
              />
              <input
                type="text"
                value={p.name}
                onChange={(e) => handleEdit(key, p.id, 'name', e.target.value)}
                style={{ width: '90%', margin: '5px 0', padding: '5px' }}
              />
              <input
                type="number"
                value={p.price}
                onChange={(e) => handleEdit(key, p.id, 'price', e.target.value)}
                style={{ width: '90%', margin: '5px 0', padding: '5px' }}
              />
              <br />
              {editingId === p.id ? (
                <button
                  onClick={() => handleSave(key, p)}
                  disabled={isSaving}
                  style={{
                    background: '#4CAF50',
                    color: '#fff',
                    border: 'none',
                    padding: '8px 12px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    marginRight: '5px',
                    opacity: isSaving ? 0.7 : 1
                  }}
                >
                  {isSaving ? 'Saving...' : 'Save'}
                </button>
              ) : (
                <button
                  onClick={() => setEditingId(p.id)}
                  style={{
                    background: '#2196F3',
                    color: '#fff',
                    border: 'none',
                    padding: '8px 12px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    marginRight: '5px'
                  }}
                >
                  Edit
                </button>
              )}
              <button
                onClick={() => handleDelete(key, p.id)}
                style={{
                  background: '#ff4d4d',
                  color: '#fff',
                  border: 'none',
                  padding: '8px 12px',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Delete
              </button>
            </div>
          );
        })}
      </div>
    ))}
  </div>
);
}