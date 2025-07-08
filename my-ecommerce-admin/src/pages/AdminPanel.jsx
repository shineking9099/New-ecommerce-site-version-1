import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminPanel.css';

export default function AdminPanel() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) navigate('/login');
  }, [navigate]);

  const [form, setForm] = useState({ name: '', price: '', category: '', image: null });
  const [preview, setPreview] = useState(null);
  const [msg, setMsg] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleFile = (file) => {
    if (file.size > 5 * 1024 * 1024) {
      setMsg('❌ Image size should be less than 5MB');
      return;
    }
    setForm({ ...form, image: file });
    setPreview(URL.createObjectURL(file));
    setMsg('');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith('image/')) handleFile(file);
    else setMsg('❌ Only image files are allowed');
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      if (files && files[0]) handleFile(files[0]);
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg('');

    const data = new FormData();
    data.append('name', form.name);
    data.append('price', form.price);
    data.append('category', form.category);
    data.append('image', form.image);

    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch('http://localhost:5000/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Upload failed');

      setMsg(`✅ ${json.message}`);
      setForm({ name: '', price: '', category: '', image: null });
      setPreview(null);
    } catch (error) {
      console.error('Upload error:', error);
      setMsg(`❌ ${error.message || 'Upload failed. Server error.'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-panel">
      <h2>Admin Panel</h2>
      <form onSubmit={handleSubmit}>
        <input 
          name="name" 
          placeholder="Product Name" 
          value={form.name} 
          onChange={handleChange} 
          required 
        />
        <input 
          name="price" 
          type="number" 
          placeholder="Price" 
          value={form.price} 
          onChange={handleChange} 
          required 
          min="0"
        />
        <select 
          name="category" 
          value={form.category} 
          onChange={handleChange} 
          required
        >
          <option value="" disabled>Select Category</option>
          <option value="kids">Kids</option>
          <option value="mens">Mens</option>
          <option value="women">Women</option>
        </select>

        <div
          className={`upload-box ${dragOver ? 'dragover' : ''}`}
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
        >
          {preview ? (
            <img src={preview} alt="preview" />
          ) : (
            <p>Drag & Drop image here or click to select</p>
          )}
        </div>

        <label className="upload-label">
          Choose Image
          <input 
            type="file" 
            name="image" 
            accept="image/*" 
            onChange={handleChange} 
            style={{ display: 'none' }} 
          />
        </label>

        <button type="submit" disabled={loading || !form.image}>
          {loading ? 'Uploading...' : 'Upload Product'}
        </button>
      </form>
      {msg && <p className={msg.includes('✅') ? 'success' : 'error'}>{msg}</p>}
    </div>
  );
}