import React, { useState } from 'react';
import './AdminPanel.css';

export default function AdminPanel() {
  const [form, setForm] = useState({
    name: '', price: '', category: '', image: null
  });
  const [preview, setPreview] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [msg, setMsg] = useState('');

  const handleFile = (file) => {
    setForm({ ...form, image: file });
    setPreview(URL.createObjectURL(file));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith('image/')) handleFile(file);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') handleFile(files[0]);
    else setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', form.name);
    data.append('price', form.price);
    data.append('category', form.category);
    data.append('image', form.image);

    const res = await fetch('http://localhost:5000/upload', {
      method: 'POST',
      body: data,
    });

    const json = await res.json();
    setMsg(res.ok ? `✅ ${json.message}` : `❌ ${json.error || 'Upload failed'}`);
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
        />
      <select name="category" value={form.category} onChange={handleChange}>
  <option value="" disabled>Select Category</option>
  <option value="kids">Kids</option>
  <option value="mens">Mens</option>
  <option value="women">Women</option>
</select>


        {/* DRAG AND DROP */}
        <div
          className={`upload-box ${dragOver ? 'dragover' : ''}`}
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
        >
          {preview ? (
            <img src={preview} alt="preview" />
          ) : (
            <p>Drag & Drop image here</p>
          )}
        </div>

        {/* OR CHOOSE FILE */}
        <label className="upload-label">
          Choose Image
          <input type="file" name="image" accept="image/*" onChange={handleChange} />
        </label>

        <button type="submit">Upload</button>
      </form>
      {msg && <p>{msg}</p>}
    </div>
  );
}
