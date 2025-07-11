import React, { useState } from 'react';
import './AdminPanel.css';

export default function AdminPanel() {
  const [form, setForm] = useState({ 
    name: '', 
    price: '', 
    category: '', 
    image: null 
  });
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setMessage({ text: 'Only image files are allowed', type: 'error' });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage({ text: 'Image size should be less than 5MB', type: 'error' });
      return;
    }

    setForm({ ...form, image: file });
    setPreview(URL.createObjectURL(file));
    setMessage({ text: '', type: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.name || !form.price || !form.category || !form.image) {
      setMessage({ text: 'All fields are required', type: 'error' });
      return;
    }

    setLoading(true);
    setMessage({ text: '', type: '' });

    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('price', form.price);
    formData.append('category', form.category);
    formData.append('image', form.image);

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:5000/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      setMessage({ 
        text: 'Product uploaded successfully!', 
        type: 'success' 
      });
      
      // Reset form
      setForm({ name: '', price: '', category: '', image: null });
      setPreview(null);
    } catch (error) {
      console.error('Upload error:', error);
      setMessage({ 
        text: error.message || 'Failed to upload product', 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-panel-container">
      <h2>Add New Product</h2>
      
      {message.text && (
        <div className={`message ${message.type}`}>{message.text}</div>
      )}

      <form onSubmit={handleSubmit} className="product-form">
        <div className="form-group">
          <label>Product Name</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>Price (Rs.)</label>
          <input
            type="number"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            min="0"
            required
          />
        </div>

        <div className="form-group">
          <label>Category</label>
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            required
          >
            <option value="">Select Category</option>
            <option value="kids">Kids</option>
            <option value="mens">Mens</option>
            <option value="women">Women</option>
          </select>
        </div>

        <div className="form-group">
          <label>Product Image</label>
          <div className="image-upload-container">
            {preview ? (
              <div className="image-preview">
                <img src={preview} alt="Preview" />
                <button 
                  type="button" 
                  onClick={() => {
                    setPreview(null);
                    setForm({ ...form, image: null });
                  }}
                >
                  Change Image
                </button>
              </div>
            ) : (
              <label className="upload-label">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
                <span>Choose Image</span>
              </label>
            )}
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="submit-button"
        >
          {loading ? 'Uploading...' : 'Upload Product'}
        </button>
      </form>
    </div>
  );
}