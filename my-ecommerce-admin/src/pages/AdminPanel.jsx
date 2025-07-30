import React, { useState } from 'react';
import './AdminPanel.css';

export default function AdminPanel() {
  const [form, setForm] = useState({
    name: '',
    price: '',
    new_price: '',
    category: 'MobileandGadgets',
    image: null
  });
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const categories = ['MobileandGadgets', 'Healthandbeauty', 'Extras', 'offers'];

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setMessage('❌ Only image files are allowed');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage('❌ File size must be less than 5MB');
      return;
    }

    setForm({ ...form, image: file });
    setPreview(URL.createObjectURL(file));
    setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('adminToken');
      if (!token) throw new Error('You need to login first');

      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('price', form.price);
      formData.append('new_price', form.new_price);
      formData.append('category', form.category);
      formData.append('image', form.image);

      const response = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Upload failed');

      setMessage(`✅ ${data.message}`);
      setForm({ name: '', price: '', new_price: '', category: 'MobileandGadgets', image: null });
      setPreview(null);
    } catch (error) {
      setMessage(`❌ ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-panel">
      <h2>Upload Product</h2>

      {message && (
        <div className={`message ${message.includes('✅') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Product Name</label>
          <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
        </div>

        <div className="form-group">
          <label>Current Price</label>
          <input type="number" step="0.01" min="0" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required />
        </div>

        <div className="form-group">
          <label>Original Price</label>
          <input type="number" step="0.01" min="0" value={form.new_price} onChange={e => setForm({ ...form, new_price: e.target.value })} />
        </div>

        <div className="form-group">
          <label>Category</label>
          <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} required>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div className="form-group">
          <label>Product Image</label>
          <div className="upload-box">
            {preview ? (
              <img src={preview} alt="Preview" className="preview-image" />
            ) : (
              <>
                <p>Drag & drop image here or</p>
                <label className="file-input-label">
                  Select Image
                  <input type="file" accept="image/*" onChange={handleFile} required style={{ display: 'none' }} />
                </label>
                <p className="file-requirements">(JPEG/PNG, max 5MB)</p>
              </>
            )}
          </div>
        </div>

        <button type="submit" disabled={loading}>{loading ? 'Uploading...' : 'Upload Product'}</button>
      </form>
    </div>
  );
}
