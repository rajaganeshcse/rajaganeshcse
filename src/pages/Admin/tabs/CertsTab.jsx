import React, { useState } from 'react';
import API from '../../../utils/api';

const EMPTY = { name: '', issuer: '', year: '', description: '', credential_url: '' };

export default function CertsTab({ data, reload, flash }) {
  const [form, setForm] = useState(EMPTY);
  const [image, setImage] = useState(null);
  const [editing, setEditing] = useState(null);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const cancel = () => { setEditing(null); setForm(EMPTY); setImage(null); };

  const startEdit = (cert) => {
    setEditing(cert.id);
    setForm({
      name: cert.name || '',
      issuer: cert.issuer || '',
      year: cert.year || '',
      description: cert.description || '',
      credential_url: cert.credential_url || '',
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.keys(form).forEach((k) => fd.append(k, form[k]));
    if (image) fd.append('image', image);
    if (editing) {
      await API.put(`/admin/certs/${editing}/`, fd);
      flash('Course updated!');
    } else {
      await API.post('/admin/certs/', fd);
      flash('Course added!');
    }
    cancel();
    reload();
  };

  const handleDelete = async (id) => {
    await API.delete(`/admin/certs/${id}/`);
    flash('Course deleted');
    reload();
  };

  return (
    <div>
      <h2 className="tab-heading">{editing ? 'Edit Course' : 'Add Course'}</h2>
      <form className="admin-form" onSubmit={handleSave}>
        <div className="field">
          <label>Course Title</label>
          <input name="name" value={form.name} placeholder="Java Spring Boot and App Development" required onChange={onChange} />
        </div>
        <div className="row-2">
          <div className="field">
            <label>Platform</label>
            <input name="issuer" value={form.issuer} placeholder="Coursera, Udemy, NPTEL, SWAYAM" onChange={onChange} />
          </div>
          <div className="field">
            <label>Year</label>
            <input name="year" value={form.year} placeholder="2024" onChange={onChange} />
          </div>
        </div>
        <div className="field">
          <label>Certificate Description</label>
          <textarea name="description" rows={3} value={form.description} placeholder="What the course covered, what you learned, or what the certificate represents." onChange={onChange} />
        </div>
        <div className="field">
          <label>Certificate Link</label>
          <input name="credential_url" value={form.credential_url} placeholder="https://..." onChange={onChange} />
        </div>
        <div className="field">
          <label>Certificate Image</label>
          <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
        </div>
        <div className="btn-row">
          <button type="submit" className="btn-primary">{editing ? 'Update Course' : 'Add Course'}</button>
          {editing && <button type="button" className="btn-outline" onClick={cancel}>Cancel</button>}
        </div>
      </form>
      <div className="items-list">
        {(data || []).map((cert) => (
          <div key={cert.id} className="list-row">
            <div>
              <span className="list-name">{cert.name}</span>
              <div style={{ marginTop: '6px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                <span className="list-meta">{cert.issuer || 'No platform'}</span>
                <span className="list-meta">{cert.credential_url ? 'Link added' : 'No link'}</span>
              </div>
            </div>
            <div className="list-actions">
              <button className="btn-edit" onClick={() => startEdit(cert)}>Edit</button>
              <button className="btn-del" onClick={() => handleDelete(cert.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
