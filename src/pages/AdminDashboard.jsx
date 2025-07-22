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
  const [data, setData] = useState({ kids: [], mens: [], women: [] });
  const [editingId, setEditingId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const formatted = {};
        for (const { key } of CATEGORIES) {
          const response = await fetch(`http://localhost:5000/products/${key}`);
          const products = await response.json();
          formatted[key] = products.map(p => ({
            ...p,
            image: `http://localhost:5000${p.image}`
          }));
        }
        setData(formatted);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };
    loadData();
  }, []);

  const handleDelete = async (categoryKey, id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/products/${categoryKey}/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Delete failed');

      setData(prev => ({
        ...prev,
        [categoryKey]: prev[categoryKey].filter(item => String(item.id) !== String(id))
      }));
      alert('Product deleted successfully!');
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete product');
    }
  };

  const handleEdit = (categoryKey, id, field, value) => {
    setData(prev => ({
      ...prev,
      [categoryKey]: prev[categoryKey].map(item =>
        String(item.id) === String(id) ? { ...item, [field]: value } : item
      )
    }));
  };

  const handleSave = async (categoryKey, product) => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/products/${categoryKey}/${product.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: product.name,
          price: product.price
        })
      });

      if (!response.ok) throw new Error('Update failed');

      setEditingId(null);
      alert('Product updated successfully!');
    } catch (error) {
      console.error('Update error:', error);
      alert('Failed to update product');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{ display: 'flex', gap: '20px', padding: '20px', flexWrap: 'wrap' }}>
      {CATEGORIES.map(({ key, label }) => (
        <div key={key} style={{ flex: '1 1 300px', minWidth: '300px' }}>
          <h2>{label} Collection</h2>
          {data[key]?.length === 0 && <p>No products</p>}
          {data[key]?.map((p) => (
            <div key={`${key}-${p.id}`} style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '10px', marginBottom: '10px', textAlign: 'center' }}>
              <img src={p.image} alt={p.name} style={{ width: '100%', height: 'auto', borderRadius: '4px' }} />
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
                <button onClick={() => handleSave(key, p)} disabled={isSaving}>
                  {isSaving ? 'Saving...' : 'Save'}
                </button>
              ) : (
                <button onClick={() => setEditingId(p.id)}>Edit</button>
              )}
              <button onClick={() => handleDelete(key, p.id)}>Delete</button>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}