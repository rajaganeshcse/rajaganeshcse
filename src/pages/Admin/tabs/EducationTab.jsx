import React, { useState } from 'react';
import API from '../../../utils/api';

const EMPTY = { degree: '', institution: '', location: '', year: '', score: '' };

function createDocumentRow(values = {}) {
  return {
    id: '',
    clientId: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    title: '',
    file: null,
    pdf_url: '',
    pdf_name: '',
    ...values,
  };
}

function buildDocumentRows(education) {
  if (Array.isArray(education.documents) && education.documents.length > 0) {
    return education.documents.map((document) =>
      createDocumentRow({
        id: document.id || '',
        title: document.title || '',
        pdf_url: document.pdf_url || '',
        pdf_name: document.pdf_name || '',
      })
    );
  }

  if (education.result_pdf_url) {
    return [
      createDocumentRow({
        title: education.result_pdf_name || 'Result PDF',
        pdf_url: education.result_pdf_url,
        pdf_name: education.result_pdf_name || '',
      }),
    ];
  }

  return [];
}

export default function EducationTab({ data, reload, flash }) {
  const [form, setForm] = useState(EMPTY);
  const [documents, setDocuments] = useState([]);
  const [editing, setEditing] = useState(null);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const cancel = () => {
    setEditing(null);
    setForm(EMPTY);
    setDocuments([]);
  };

  const startEdit = (education) => {
    setEditing(education.id);
    setForm({
      degree: education.degree || '',
      institution: education.institution || '',
      location: education.location || '',
      year: education.year || '',
      score: education.score || '',
    });
    setDocuments(buildDocumentRows(education));
  };

  const addDocument = () =>
    setDocuments((current) => [
      ...current,
      createDocumentRow({
        title: `Semester ${current.length + 1} Result`,
      }),
    ]);

  const updateDocument = (clientId, field, value) => {
    setDocuments((current) =>
      current.map((document) =>
        document.clientId === clientId
          ? {
              ...document,
              [field]: value,
            }
          : document
      )
    );
  };

  const updateDocumentFile = (clientId, file) => {
    setDocuments((current) =>
      current.map((document) =>
        document.clientId === clientId
          ? {
              ...document,
              file,
              pdf_name: file ? file.name : document.pdf_name,
              pdf_url: file ? '' : document.pdf_url,
            }
          : document
      )
    );
  };

  const removeDocument = (clientId) => {
    setDocuments((current) => current.filter((document) => document.clientId !== clientId));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.keys(form).forEach((key) => fd.append(key, form[key]));

    const payloadDocuments = [];
    documents.forEach((document, index) => {
      if (!document.file && !document.pdf_url && !document.id) {
        return;
      }

      const fileField = document.file ? `document_file_${index}` : '';
      if (document.file) {
        fd.append(fileField, document.file);
      }

      payloadDocuments.push({
        id: document.id || '',
        title: document.title.trim() || `Semester ${index + 1} Result`,
        fileField,
        pdf_url: document.file ? '' : document.pdf_url,
        pdf_name: document.file ? document.file.name : document.pdf_name,
      });
    });
    fd.append('documents_json', JSON.stringify(payloadDocuments));

    if (editing) {
      await API.put(`/admin/education/${editing}/`, fd);
      flash('Education updated!');
    } else {
      await API.post('/admin/education/', fd);
      flash('Education added!');
    }

    cancel();
    reload();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this education record?')) {
      return;
    }

    await API.delete(`/admin/education/${id}/`);
    flash('Education deleted');
    reload();
  };

  return (
    <div>
      <h2 className="tab-heading">{editing ? 'Edit Education' : 'Add Education'}</h2>
      <form className="admin-form" onSubmit={handleSave}>
        <div className="field">
          <label>Degree</label>
          <input
            name="degree"
            value={form.degree}
            placeholder="B.E Computer Science and Engineering"
            required
            onChange={onChange}
          />
        </div>
        <div className="row-2">
          <div className="field">
            <label>Institution</label>
            <input
              name="institution"
              value={form.institution}
              placeholder="Dhanalakshmi Srinivasan Engineering College"
              required
              onChange={onChange}
            />
          </div>
          <div className="field">
            <label>Location</label>
            <input
              name="location"
              value={form.location}
              placeholder="Perambalur, Tamil Nadu"
              onChange={onChange}
            />
          </div>
        </div>
        <div className="row-2">
          <div className="field">
            <label>Year Range</label>
            <input name="year" value={form.year} placeholder="2023 - 2027" onChange={onChange} />
          </div>
          <div className="field">
            <label>Score</label>
            <input name="score" value={form.score} placeholder="CGPA: 8.86 / 10" onChange={onChange} />
          </div>
        </div>
        <div className="field">
          <label>Semester Results</label>
          <p style={{ marginBottom: '12px', color: 'var(--muted)', fontSize: '0.92rem' }}>
            Add each semester mark sheet or academic PDF separately. For a college record, you can add all 8 semesters here.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {documents.map((document, index) => (
              <div
                key={document.clientId}
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr) auto',
                  gap: '10px',
                  padding: '12px',
                  border: '1px solid var(--border)',
                  borderRadius: '18px',
                  background: 'var(--admin-hover)',
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <input
                    value={document.title}
                    placeholder={`Semester ${index + 1} Result`}
                    onChange={(e) => updateDocument(document.clientId, 'title', e.target.value)}
                  />
                  <span className="badge" style={{ width: 'fit-content' }}>
                    PDF {index + 1}
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => updateDocumentFile(document.clientId, e.target.files[0] || null)}
                  />
                  {document.pdf_url ? (
                    <a
                      href={document.pdf_url}
                      target="_blank"
                      rel="noreferrer"
                      className="badge"
                      style={{ width: 'fit-content' }}
                    >
                      View current PDF
                    </a>
                  ) : null}
                  {document.pdf_name ? (
                    <span style={{ color: 'var(--muted)', fontSize: '0.82rem', wordBreak: 'break-word' }}>
                      {document.pdf_name}
                    </span>
                  ) : null}
                </div>
                <button type="button" className="btn-del" onClick={() => removeDocument(document.clientId)}>
                  Remove
                </button>
              </div>
            ))}
            <button type="button" className="btn-outline" onClick={addDocument}>
              Add semester result PDF
            </button>
          </div>
        </div>
        <div className="btn-row">
          <button type="submit" className="btn-primary">{editing ? 'Update' : 'Add Education'}</button>
          {editing ? <button type="button" className="btn-outline" onClick={cancel}>Cancel</button> : null}
        </div>
      </form>

      <div className="items-list">
        {(data || []).map((education) => {
          const documentCount = (education.documents || []).length || (education.result_pdf_url ? 1 : 0);

          return (
            <div key={education.id} className="list-row">
              <div>
                <span className="list-name">{education.degree}</span>
                <div style={{ marginTop: '6px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  <span className="list-meta">{education.year || 'No year set'}</span>
                  <span className="list-meta">{education.location || 'No location set'}</span>
                  <span className="list-meta">
                    {documentCount} PDF{documentCount !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
              <div className="list-actions">
                <button className="btn-edit" onClick={() => startEdit(education)}>Edit</button>
                <button className="btn-del" onClick={() => handleDelete(education.id)}>Delete</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
