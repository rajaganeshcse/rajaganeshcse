import React, { useState } from 'react';
import API from '../../../utils/api';

const EMPTY = { title: '', description: '', tech_stack: '', github_url: '', live_url: '', video_url: '' };
const getProjectImages = (project) => [project?.image_url, project?.image_url2, project?.image_url3].filter(Boolean);

export default function ProjectsTab({ data, reload, flash }) {
  const [form,    setForm]    = useState(EMPTY);
  const [images,  setImages]  = useState([]);
  const [editing, setEditing] = useState(null);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const onImagesChange = (e) => setImages(Array.from(e.target.files || []).slice(0, 3));

  const startEdit = (p) => {
    setEditing(p.id);
    setForm({ title: p.title, description: p.description, tech_stack: p.tech_stack, github_url: p.github_url, live_url: p.live_url, video_url: p.video_url });
    setImages([]);
  };

  const cancel = () => { setEditing(null); setForm(EMPTY); setImages([]); };

  const handleSave = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.keys(form).forEach((k) => fd.append(k, form[k]));
    if (images.length > 0) {
      fd.append('replace_project_gallery', '1');
      images.forEach((image, index) => fd.append(index === 0 ? 'image' : `image${index + 1}`, image));
    }
    if (editing) {
      await API.put(`/admin/projects/${editing}/`, fd);
      flash('Project updated!');
    } else {
      await API.post('/admin/projects/', fd);
      flash('Project added!');
    }
    cancel();
    reload();
  };

  const handleDelete = async (id) => {
    await API.delete(`/admin/projects/${id}/`);
    flash('Project deleted');
    reload();
  };

  return (
    <div>
      <h2 className="tab-heading">{editing ? 'Edit Project' : 'Add Project'}</h2>
      <form className="admin-form" onSubmit={handleSave}>
        <div className="field">
          <label>Title</label>
          <input name="title" value={form.title} required onChange={onChange} />
        </div>
        <div className="field">
          <label>Description</label>
          <textarea name="description" rows={4} value={form.description} onChange={onChange} />
        </div>
        <div className="field">
          <label>Tech Stack (comma separated)</label>
          <input name="tech_stack" value={form.tech_stack} placeholder="React, Django, MongoDB" onChange={onChange} />
        </div>
        <div className="row-2">
          <div className="field">
            <label>GitHub URL</label>
            <input name="github_url" value={form.github_url} onChange={onChange} />
          </div>
          <div className="field">
            <label>Live URL</label>
            <input name="live_url" value={form.live_url} onChange={onChange} />
          </div>
        </div>
        <div className="field">
          <label>Video URL (YouTube embed link)</label>
          <input name="video_url" value={form.video_url} placeholder="https://www.youtube.com/embed/..." onChange={onChange} />
        </div>
        <div className="field">
          <label>Project Images</label>
          <input type="file" accept="image/*" multiple onChange={onImagesChange} />
          <span className="list-meta" style={{ width: 'fit-content' }}>
            {images.length > 0 ? `${images.length} new image${images.length > 1 ? 's' : ''} selected` : 'Upload up to 3 images'}
          </span>
          {editing ? (
            <span className="list-meta" style={{ width: 'fit-content' }}>
              Current gallery: {getProjectImages((data || []).find((project) => project.id === editing)).length} image(s)
            </span>
          ) : null}
        </div>
        <div className="btn-row">
          <button type="submit" className="btn-primary">{editing ? 'Update' : 'Add Project'}</button>
          {editing && <button type="button" className="btn-outline" onClick={cancel}>Cancel</button>}
        </div>
      </form>

      <div className="items-list">
        {(data || []).map((p) => (
          <div key={p.id} className="list-row">
            <span className="list-name">{p.title}</span>
            <span className="list-meta">{getProjectImages(p).length} image(s)</span>
            <div className="list-actions">
              <button className="btn-edit" onClick={() => startEdit(p)}>Edit</button>
              <button className="btn-del"  onClick={() => handleDelete(p.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
