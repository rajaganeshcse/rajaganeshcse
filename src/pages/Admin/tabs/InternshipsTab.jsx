import React, { useState } from 'react';
import API from '../../../utils/api';

const EMPTY = { role: '', company: '', duration: '', description: '' };

export default function InternshipsTab({ data, reload, flash }) {
  const [form, setForm] = useState(EMPTY);
  const [image, setImage] = useState(null);
  const [editing, setEditing] = useState(null);
  const [currentImageUrl, setCurrentImageUrl] = useState('');

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const cancel = () => {
    setEditing(null);
    setForm(EMPTY);
    setImage(null);
    setCurrentImageUrl('');
  };

  const startEdit = (item) => {
    setEditing(item.id);
    setForm({
      role: item.role || '',
      company: item.company || '',
      duration: item.duration || '',
      description: item.description || '',
    });
    setImage(null);
    setCurrentImageUrl(item.image_url || '');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.keys(form).forEach((key) => fd.append(key, form[key]));
    if (image) {
      fd.append('image', image);
    }

    if (editing) {
      await API.put(`/admin/internships/${editing}/`, fd);
      flash('Internship updated!');
    } else {
      await API.post('/admin/internships/', fd);
      flash('Internship added!');
    }
    cancel();
    reload();
  };

  const handleDelete = async (id) => {
    await API.delete(`/admin/internships/${id}/`);
    flash('Internship deleted');
    reload();
  };

  return (
    <div>
      <h2 className="tab-heading">{editing ? 'Edit Internship' : 'Add Internship'}</h2>
      <form className="admin-form" onSubmit={handleSave}>
        <div className="row-2">
          <div className="field">
            <label>Role</label>
            <input name="role" value={form.role} required onChange={onChange} />
          </div>
          <div className="field">
            <label>Company</label>
            <input name="company" value={form.company} onChange={onChange} />
          </div>
        </div>
        <div className="field">
          <label>Duration</label>
          <input name="duration" value={form.duration} placeholder="JAN - MAR 2024" onChange={onChange} />
        </div>
        <div className="field">
          <label>Description</label>
          <textarea name="description" rows={4} value={form.description} onChange={onChange} />
        </div>
        <div className="field">
          <label>Internship Image</label>
          <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0] || null)} />
          {currentImageUrl ? (
            <a
              href={currentImageUrl}
              target="_blank"
              rel="noreferrer"
              className="badge"
              style={{ marginTop: '10px', width: 'fit-content' }}
            >
              View current image
            </a>
          ) : null}
        </div>
        <div className="btn-row">
          <button type="submit" className="btn-primary">{editing ? 'Update Internship' : 'Add Internship'}</button>
          {editing ? <button type="button" className="btn-outline" onClick={cancel}>Cancel</button> : null}
        </div>
      </form>
      <div className="items-list">
        {(data || []).map((item) => (
          <div key={item.id} className="list-row">
            <div>
              <span className="list-name">{item.role}</span>
              <div style={{ marginTop: '6px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                <span className="list-meta">{item.company || 'No company'}</span>
                <span className="list-meta">{item.image_url ? 'Image added' : 'No image'}</span>
              </div>
            </div>
            <div className="list-actions">
              <button className="btn-edit" onClick={() => startEdit(item)}>Edit</button>
              <button className="btn-del" onClick={() => handleDelete(item.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
