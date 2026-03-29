import React, { useState } from 'react';
import API from '../../../utils/api';

const EMPTY = { title: '', details: '' };

export default function JournalTab({ data, reload, flash }) {
  const [form, setForm] = useState(EMPTY);
  const [pdf, setPdf] = useState(null);
  const [editing, setEditing] = useState(null);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const cancel = () => {
    setEditing(null);
    setForm(EMPTY);
    setPdf(null);
  };

  const startEdit = (journal) => {
    setEditing(journal.id);
    setForm({
      title: journal.title || '',
      details: journal.details || '',
    });
    setPdf(null);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.keys(form).forEach((key) => fd.append(key, form[key]));
    if (pdf) {
      fd.append('pdf', pdf);
    }

    if (editing) {
      await API.put(`/admin/journals/${editing}/`, fd);
      flash('Journal updated!');
    } else {
      await API.post('/admin/journals/', fd);
      flash('Journal added!');
    }

    cancel();
    reload();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this journal item?')) {
      return;
    }

    await API.delete(`/admin/journals/${id}/`);
    flash('Journal deleted');
    reload();
  };

  const currentRecord = (data || []).find((item) => item.id === editing);

  return (
    <div>
      <h2 className="tab-heading">{editing ? 'Edit Journal' : 'Add Journal'}</h2>
      <form className="admin-form" onSubmit={handleSave}>
        <div className="field">
          <label>Title</label>
          <input
            name="title"
            value={form.title}
            placeholder="Journal title"
            required
            onChange={onChange}
          />
        </div>
        <div className="field">
          <label>Details</label>
          <textarea
            name="details"
            rows={5}
            value={form.details}
            placeholder="Add journal description or summary"
            onChange={onChange}
          />
        </div>
        <div className="field">
          <label>Journal PDF</label>
          <input type="file" accept=".pdf" onChange={(e) => setPdf(e.target.files[0] || null)} />
          {currentRecord?.pdf_url ? (
            <a
              href={currentRecord.pdf_url}
              target="_blank"
              rel="noreferrer"
              className="badge"
              style={{ width: 'fit-content', marginTop: '10px' }}
            >
              View current PDF
            </a>
          ) : null}
        </div>
        <div className="btn-row">
          <button type="submit" className="btn-primary">{editing ? 'Update' : 'Add Journal'}</button>
          {editing ? <button type="button" className="btn-outline" onClick={cancel}>Cancel</button> : null}
        </div>
      </form>

      <div className="items-list">
        {(data || []).map((journal) => (
          <div key={journal.id} className="list-row">
            <div>
              <span className="list-name">{journal.title}</span>
              <div style={{ marginTop: '6px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {journal.pdf_name ? <span className="list-meta">{journal.pdf_name}</span> : null}
                {journal.details ? (
                  <span className="list-meta">
                    {journal.details.length > 70 ? `${journal.details.slice(0, 70)}...` : journal.details}
                  </span>
                ) : null}
              </div>
            </div>
            <div className="list-actions">
              <button className="btn-edit" onClick={() => startEdit(journal)}>Edit</button>
              <button className="btn-del" onClick={() => handleDelete(journal.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
