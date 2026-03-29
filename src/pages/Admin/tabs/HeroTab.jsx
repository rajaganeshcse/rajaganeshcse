import React, { useState, useEffect } from 'react';
import API from '../../../utils/api';

export default function HeroTab({ data, reload, flash }) {
  const [form,  setForm]  = useState({});
  const [photo, setPhoto] = useState(null);
  const [resume, setResume] = useState(null);

  useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.keys(form).forEach((k) => { if (form[k] !== null && form[k] !== undefined) fd.append(k, form[k]); });
    if (photo) fd.append('photo', photo);
    if (resume) fd.append('resume', resume);
    await API.put('/admin/hero/', fd);
    flash('Hero section saved!');
    reload();
  };

  return (
    <div>
      <h2 className="tab-heading">Edit Hero Section</h2>
      <form className="admin-form" onSubmit={handleSave}>
        <div className="row-2">
          <div className="field">
            <label>Full Name</label>
            <input name="name" value={form.name || 'Rajaganesh T'} onChange={onChange} />
          </div>
          <div className="field">
            <label>Title</label>
            <input name="title" value={form.title || ''} onChange={onChange} />
          </div>
        </div>
        <div className="field">
          <label>Bio</label>
          <textarea name="bio" rows={4} value={form.bio || ''} onChange={onChange} />
        </div>
        <div className="row-2">
          <div className="field">
            <label>Email</label>
            <input name="email" type="email" value={form.email || 'rajaganeshcse2005@gmail.com'} onChange={onChange} />
          </div>
          <div className="field">
            <label>Phone</label>
            <input name="phone" value={form.phone || ''} onChange={onChange} />
          </div>
        </div>
        <div className="row-2">
          <div className="field">
            <label>GitHub URL</label>
            <input name="github" value={form.github || ''} onChange={onChange} />
          </div>
          <div className="field">
            <label>LinkedIn URL</label>
            <input name="linkedin" value={form.linkedin || ''} onChange={onChange} />
          </div>
        </div>
        <div className="row-2">
          <div className="field">
            <label>LeetCode URL</label>
            <input name="leetcode" value={form.leetcode || ''} onChange={onChange} />
          </div>
          <div className="field">
            <label>Instagram URL</label>
            <input name="instagram" value={form.instagram || ''} onChange={onChange} />
          </div>
        </div>
        <div className="row-2">
          <div className="field">
            <label>Portfolio URL</label>
            <input name="portfolio" value={form.portfolio || ''} onChange={onChange} />
          </div>
          <div className="field">
            <label>Location</label>
            <input name="location" value={form.location || ''} onChange={onChange} />
          </div>
        </div>
        <div className="field">
          <label>College</label>
          <input name="college" value={form.college || ''} onChange={onChange} />
        </div>
        <div className="field">
          <label>Address</label>
          <textarea name="address" rows={3} value={form.address || ''} onChange={onChange} />
        </div>
        <div className="field">
          <label>Profile Photo</label>
          <input type="file" accept="image/*" onChange={(e) => setPhoto(e.target.files[0])} />
        </div>
        <div className="field">
          <label>Resume File</label>
          <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => setResume(e.target.files[0])} />
          {form.resume_url ? (
            <a href={form.resume_url} target="_blank" rel="noreferrer" className="badge" style={{ width: 'fit-content', marginTop: '10px' }}>
              View current resume
            </a>
          ) : null}
        </div>
        <button type="submit" className="btn-primary">Save Changes</button>
      </form>
    </div>
  );
}
