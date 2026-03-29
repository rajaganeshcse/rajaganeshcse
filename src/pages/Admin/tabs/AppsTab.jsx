import React, { useState } from 'react';
import API from '../../../utils/api';

const EMPTY = {
  title: '',
  description: '',
  dashboard_url: '',
  github_url: '',
  playstore_url: '',
};

function getAppScreenshots(app) {
  return app?.screenshot_urls?.length
    ? app.screenshot_urls
    : [app?.screenshot_url1, app?.screenshot_url2, app?.screenshot_url3].filter(Boolean);
}

export default function AppsTab({ data, reload, flash }) {
  const [form, setForm] = useState(EMPTY);
  const [coverImage, setCoverImage] = useState(null);
  const [screenshots, setScreenshots] = useState([]);
  const [apkFile, setApkFile] = useState(null);
  const [editing, setEditing] = useState(null);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const onScreenshotsChange = (e) => setScreenshots(Array.from(e.target.files || []).slice(0, 3));

  const cancel = () => {
    setEditing(null);
    setForm(EMPTY);
    setCoverImage(null);
    setScreenshots([]);
    setApkFile(null);
  };

  const startEdit = (app) => {
    setEditing(app.id);
    setForm({
      title: app.title || '',
      description: app.description || '',
      dashboard_url: app.dashboard_url || '',
      github_url: app.github_url || '',
      playstore_url: app.playstore_url || '',
    });
    setCoverImage(null);
    setScreenshots([]);
    setApkFile(null);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.keys(form).forEach((key) => fd.append(key, form[key]));
    if (coverImage) fd.append('cover_image', coverImage);
    if (screenshots.length > 0) {
      fd.append('replace_app_screenshots', '1');
      screenshots.forEach((file, index) => fd.append(`screenshot${index + 1}`, file));
    }
    if (apkFile) fd.append('apk', apkFile);

    if (editing) {
      await API.put(`/admin/apps/${editing}/`, fd);
      flash('App updated!');
    } else {
      await API.post('/admin/apps/', fd);
      flash('App added!');
    }

    cancel();
    reload();
  };

  const handleDelete = async (id) => {
    await API.delete(`/admin/apps/${id}/`);
    flash('App deleted');
    reload();
  };

  return (
    <div>
      <h2 className="tab-heading">{editing ? 'Edit My App' : 'Add My App'}</h2>

      <form className="admin-form" onSubmit={handleSave}>
        <div className="field">
          <label>App Title</label>
          <input name="title" value={form.title} required onChange={onChange} />
        </div>

        <div className="field">
          <label>Description</label>
          <textarea name="description" rows={4} value={form.description} onChange={onChange} />
        </div>

        <div className="row-2">
          <div className="field">
            <label>Dashboard / Website Link</label>
            <input name="dashboard_url" value={form.dashboard_url} placeholder="https://..." onChange={onChange} />
          </div>
          <div className="field">
            <label>GitHub Link</label>
            <input name="github_url" value={form.github_url} placeholder="https://github.com/..." onChange={onChange} />
          </div>
        </div>

        <div className="field">
          <label>Play Store Link</label>
          <input name="playstore_url" value={form.playstore_url} placeholder="https://play.google.com/..." onChange={onChange} />
        </div>

        <div className="row-2">
          <div className="field">
            <label>Cover Image</label>
            <input type="file" accept="image/*" onChange={(e) => setCoverImage(e.target.files?.[0] || null)} />
            <span className="list-meta" style={{ width: 'fit-content' }}>
              {coverImage ? coverImage.name : 'Main app image for the card and modal'}
            </span>
          </div>
          <div className="field">
            <label>APK Upload</label>
            <input type="file" accept=".apk,application/vnd.android.package-archive" onChange={(e) => setApkFile(e.target.files?.[0] || null)} />
            <span className="list-meta" style={{ width: 'fit-content' }}>
              {apkFile ? apkFile.name : 'Best if APK stays under 15 MB'}
            </span>
          </div>
        </div>

        <div className="field">
          <label>App Screenshots</label>
          <input type="file" accept="image/*" multiple onChange={onScreenshotsChange} />
          <span className="list-meta" style={{ width: 'fit-content' }}>
            {screenshots.length > 0 ? `${screenshots.length} new screenshot${screenshots.length > 1 ? 's' : ''} selected` : 'Upload up to 3 screenshots'}
          </span>
          {editing ? (
            <span className="list-meta" style={{ width: 'fit-content' }}>
              Current screenshots: {getAppScreenshots((data || []).find((app) => app.id === editing)).length}
            </span>
          ) : null}
        </div>

        <div className="btn-row">
          <button type="submit" className="btn-primary">{editing ? 'Update App' : 'Add App'}</button>
          {editing ? <button type="button" className="btn-outline" onClick={cancel}>Cancel</button> : null}
        </div>
      </form>

      <div className="items-list">
        {(data || []).map((app) => (
          <div key={app.id} className="list-row">
            <div>
              <span className="list-name">{app.title}</span>
              <div style={{ marginTop: '6px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                <span className="list-meta">{getAppScreenshots(app).length} screenshot(s)</span>
                <span className="list-meta">{app.cover_image_url ? 'Cover ready' : 'No cover'}</span>
                <span className="list-meta">{app.apk_url ? 'APK uploaded' : 'No APK'}</span>
              </div>
            </div>
            <div className="list-actions">
              <button className="btn-edit" onClick={() => startEdit(app)}>Edit</button>
              <button className="btn-del" onClick={() => handleDelete(app.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
