/* // src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from 'react';

const CATEGORIES = ['kids', 'mens', 'women'];

export default function AdminDashboard() {
  const [data, setData]    = useState({ kids: [], mens: [], women: [] });
  const [editing, setEdit] = useState(null);

  // Fetch products for all categories on mount
  useEffect(() => {
    CATEGORIES.forEach((cat) => {
      fetch(`http://localhost:5000/products/${cat}`)
        .then((r) => {
          if (!r.ok) throw new Error(`Failed to load ${cat}`);
          return r.json();
        })
        .then((arr) => setData((d) => ({ ...d, [cat]: arr })))
        .catch((err) => {
          console.error(err);
          // Keep data[cat] === [] on error
        });
    });
  }, []);

  const handleDelete = (category, id) => {
    fetch(`http://localhost:5000/products/${category}/${id}`, { method: 'DELETE' })
      .then((r) => {
        if (!r.ok) throw new Error('Delete failed');
        setData((d) => ({
          ...d,
          [category]: d[category].filter((p) => p.id !== id),
        }));
      })
      .catch(console.error);
  };

  const startEdit = (category, product) => {
    setEdit({ category, ...product });
  };

  const saveEdit = () => {
    if (!editing) return;
    const { category, id, name, price, image } = editing;

    // 1) delete the old
    fetch(`http://localhost:5000/products/${category}/${id}`, { method: 'DELETE' })
      .then((r) => {
        if (!r.ok) throw new Error('Delete for edit failed');
        // 2) re-upload JSON-only version
        return fetch('http://localhost:5000/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, price, category, image }),
        });
      })
      .then((r) => {
        if (!r.ok) throw new Error('Re-upload failed');
        // 3) re-fetch this category
        return fetch(`http://localhost:5000/products/${category}`);
      })
      .then((r) => r.json())
      .then((arr) => {
        setData((d) => ({ ...d, [category]: arr }));
        setEdit(null);
      })
      .catch(console.error);
  };

  return (
    <div style={{ display: 'flex', gap: 20, padding: 20 }}>
      {CATEGORIES.map((cat) => (
        <div key={cat} style={{ flex: 1 }}>
          <h2 style={{ textTransform: 'capitalize' }}>{cat}</h2>
          {data[cat].length === 0 && <p>No products</p>}
          {data[cat].map((p) => {
            const isEditing = editing && editing.id === p.id && editing.category === cat;
            return (
              <div
                key={p.id}
                style={{
                  border: '1px solid #ccc',
                  margin: '10px 0',
                  padding: '10px',
                }}
              >
                {isEditing ? (
                  <>
                    <input
                      value={editing.name}
                      onChange={(e) =>
                        setEdit({ ...editing, name: e.target.value })
                      }
                    />
                    <input
                      value={editing.price}
                      onChange={(e) =>
                        setEdit({ ...editing, price: e.target.value })
                      }
                    />
                    <button onClick={saveEdit}>Save</button>
                    <button onClick={() => setEdit(null)}>Cancel</button>
                  </>
                ) : (
                  <>
                    <img src={p.image} alt={p.name} style={{ width: '100%' }} />
                    <h4>{p.name}</h4>
                    <p>Rs. {p.price}</p>
                    <button onClick={() => handleDelete(cat, p.id)}>
                      Delete
                    </button>
                    <button onClick={() => startEdit(cat, p)}>Edit</button>
                  </>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
 */
import React, { useEffect, useState } from 'react';
import './AdminDashboard.css';

const CATEGORIES = ['kids','mens','women'];

export default function AdminDashboard() {
  const [data, setData] = useState({ kids:[], mens:[], women:[] });
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    CATEGORIES.forEach(cat => {
      fetch(`http://localhost:5000/products/${cat}`)
        .then(r => r.ok ? r.json() : Promise.reject())
        .then(arr => setData(d => ({ ...d, [cat]: arr })))
        .catch(console.error);
    });
  }, []);

  const deleteOne = (cat, id) =>
    fetch(`http://localhost:5000/products/${cat}/${id}`, { method:'DELETE' })
      .then(() => setData(d => ({
        ...d,
        [cat]: d[cat].filter(p=>p.id!==id)
      })))
      .catch(console.error);

  const startEdit = (cat,p) => setEditing({ ...p, category:cat });
const saveEdit = () => {
  if (!editing) return;
  const { id, name, price, category } = editing;

  fetch(`http://localhost:5000/products/${category}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('adminToken')}` },
    body: JSON.stringify({ name, price }),
  })
    .then(r => {
      if (!r.ok) throw new Error('Update failed');
      return fetch(`http://localhost:5000/products/${category}`);
    })
    .then(r => r.json())
    .then(arr => {
      setData(d => ({ ...d, [category]: arr }));
      setEditing(null);
    })
    .catch(console.error);
};


  return (
    <div className="dashboard">
      {CATEGORIES.map(cat=>(
        <div key={cat} className="column">
          <h3>{cat.charAt(0).toUpperCase()+cat.slice(1)}</h3>
          {data[cat].length===0 && <p><em>No items</em></p>}
          {data[cat].map(p=>{
            const isEd = editing && editing.id===p.id && editing.category===cat;
            return (
              <div key={p.id} className="card">
                {isEd
                  ? <>
                      <input value={editing.name}
                             onChange={e=>setEditing({...editing,name:e.target.value})}/>
                      <input value={editing.price}
                             onChange={e=>setEditing({...editing,price:e.target.value})}/>
                      <button onClick={saveEdit}>Save</button>
                      <button onClick={()=>setEditing(null)}>Cancel</button>
                    </>
                  : <>
                      <img src={p.image} alt={p.name}/>
                      <h4>{p.name}</h4>
                      <p>Rs. {p.price}</p>
<div className="button-group">
  <button onClick={() => deleteOne(cat, p.id)}>Delete</button>
  <button onClick={() => startEdit(cat, p)}>Edit</button>
</div>

                    </>
                }
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
