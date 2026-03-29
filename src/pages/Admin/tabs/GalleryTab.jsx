import React, { useState } from 'react';
import API from '../../../utils/api';

const CATS = ['certificate', 'internship', 'workshop', 'project', 'achievement'];
const EMPTY = { title: '', category: 'certificate', caption: '', order: 0 };

export default function GalleryTab({ data, reload, flash }) {
  const [form,    setForm]    = useState(EMPTY);
  const [image,   setImage]   = useState(null);
  const [editing, setEditing] = useState(null);
  const [preview, setPreview] = useState(null);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onFile = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  const cancel = () => { setEditing(null); setForm(EMPTY); setImage(null); setPreview(null); };

  const handleSave = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.keys(form).forEach((k) => fd.append(k, form[k]));
    if (image) fd.append('image', image);
    if (editing) {
      await API.put(`/admin/gallery/${editing}/`, fd);
      flash('Image updated!');
    } else {
      await API.post('/admin/gallery/', fd);
      flash('Image added!');
    }
    cancel();
    reload();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this image?')) return;
    await API.delete(`/admin/gallery/${id}/`);
    flash('Deleted');
    reload();
  };

  return (
    <div>
      <h2 className="tab-heading">{editing ? 'Edit Gallery Image' : 'Add Gallery Image'}</h2>

      <form className="admin-form" onSubmit={handleSave}>
        <div className="row-2">
          <div className="field">
            <label>Title</label>
            <input name="title" value={form.title} required placeholder="e.g. IBM Data Analytics Certificate" onChange={onChange} />
          </div>
          <div className="field">
            <label>Category</label>
            <select name="category" value={form.category} onChange={onChange}>
              {CATS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div className="field">
          <label>Caption (short description)</label>
          <input name="caption" value={form.caption} placeholder="e.g. Completed Python programming course at IIT Madras" onChange={onChange} />
        </div>
        <div className="field">
          <label>Image</label>
          <input type="file" accept="image/*" onChange={onFile} required={!editing} />
          {preview && (
            <img src={preview} alt="preview" style={{ width:180, height:120, objectFit:'cover', borderRadius:8, marginTop:8, border:'1px solid var(--border)' }} />
          )}
        </div>
        <div className="btn-row">
          <button type="submit" className="btn-primary">{editing ? 'Update' : 'Add Image'}</button>
          {editing && <button type="button" className="btn-outline" onClick={cancel}>Cancel</button>}
        </div>
      </form>

      <div className="gallery-admin-grid">
        {(data || []).map((item) => (
          <div key={item.id} className="gallery-admin-card">
            {item.image_url ? (
              <img src={item.image_url} alt={item.title} className="gallery-admin-img" />
            ) : (
              <div className="gallery-admin-noimg">No Image</div>
            )}
            <div className="gallery-admin-info">
              <span className="gallery-admin-cat">{item.category}</span>
              <p className="gallery-admin-title">{item.title}</p>
              {item.caption && <p className="gallery-admin-caption">{item.caption}</p>}
            </div>
            <div className="gallery-admin-actions">
              <button className="btn-edit" onClick={() => { setEditing(item.id); setForm({ title:item.title, category:item.category, caption:item.caption||'', order:item.order||0 }); setPreview(item.image_url); }}>Edit</button>
              <button className="btn-del"  onClick={() => handleDelete(item.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .gallery-admin-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(220px,1fr)); gap:14px; max-width:900px; margin-top:8px; }
        .gallery-admin-card { background:var(--card); border:1px solid var(--border); border-radius:10px; overflow:hidden; }
        .gallery-admin-img  { width:100%; height:130px; object-fit:cover; display:block; }
        .gallery-admin-noimg{ height:100px; background:var(--bg3); display:flex; align-items:center; justify-content:center; color:var(--muted); font-size:0.8rem; }
        .gallery-admin-info { padding:10px 12px 6px; }
        .gallery-admin-cat  { font-size:0.68rem; font-weight:700; color:var(--accent2); text-transform:uppercase; letter-spacing:0.06em; }
        .gallery-admin-title{ font-size:0.85rem; font-weight:700; color:var(--text); margin:4px 0 3px; line-height:1.3; }
        .gallery-admin-caption { font-size:0.75rem; color:var(--muted); line-height:1.4; }
        .gallery-admin-actions { display:flex; gap:6px; padding:8px 12px 12px; }
      `}</style>
    </div>
  );
}
