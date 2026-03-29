import React, { useState } from 'react';
import API from '../../../utils/api';

const CATS = ['programming', 'frontend', 'mobile', 'backend', 'database', 'analytics', 'ml', 'tools'];

export default function SkillsTab({ data, reload, flash }) {
  const [form,    setForm]    = useState({ category: 'programming', name: '', level: 80 });
  const [editing, setEditing] = useState(null);

  const startEdit = (skill) => {
    setEditing(skill.id);
    setForm({ category: skill.category, name: skill.name, level: skill.level });
  };

  const cancelEdit = () => {
    setEditing(null);
    setForm({ category: 'programming', name: '', level: 80 });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (editing) {
      await API.put(`/admin/skills/${editing}/`, form);
      flash('Skill updated!');
      setEditing(null);
    } else {
      await API.post('/admin/skills/', form);
      flash('Skill added!');
    }
    setForm({ category: 'programming', name: '', level: 80 });
    reload();
  };

  const handleDelete = async (id) => {
    await API.delete(`/admin/skills/${id}/`);
    flash('Skill deleted');
    reload();
  };

  return (
    <div>
      <h2 className="tab-heading">{editing ? 'Edit Skill' : 'Add Skill'}</h2>
      <form className="admin-form" onSubmit={handleSave}>
        <div className="row-2">
          <div className="field">
            <label>Category</label>
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {CATS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="field">
            <label>Skill Name</label>
            <input value={form.name} required placeholder="e.g. React.js" onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
        </div>
        <div className="field">
          <label>Level (0 – 100)</label>
          <input type="number" min={0} max={100} value={form.level} onChange={(e) => setForm({ ...form, level: Number(e.target.value) })} />
        </div>
        <div className="btn-row">
          <button type="submit" className="btn-primary">{editing ? 'Update' : 'Add Skill'}</button>
          {editing && <button type="button" className="btn-outline" onClick={cancelEdit}>Cancel</button>}
        </div>
      </form>

      <div className="items-list">
        {(data || []).map((skill) => (
          <div key={skill.id} className="list-row">
            <span className="list-meta">{skill.category}</span>
            <span className="list-name">{skill.name}</span>
            <span style={{ color: 'var(--accent)', fontFamily: 'var(--fm)', fontSize: '0.8rem', marginLeft: 'auto' }}>{skill.level}%</span>
            <div className="list-actions">
              <button className="btn-edit" onClick={() => startEdit(skill)}>Edit</button>
              <button className="btn-del"  onClick={() => handleDelete(skill.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
