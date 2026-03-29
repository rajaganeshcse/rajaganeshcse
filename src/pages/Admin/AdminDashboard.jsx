import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import API from '../../utils/api';
import HeroTab        from './tabs/HeroTab';
import SkillsTab      from './tabs/SkillsTab';
import ProjectsTab    from './tabs/ProjectsTab';
import AppsTab        from './tabs/AppsTab';
import EducationTab   from './tabs/EducationTab';
import JournalTab     from './tabs/JournalTab';
import InternshipsTab from './tabs/InternshipsTab';
import CertsTab       from './tabs/CertsTab';
import WorkshopsTab   from './tabs/WorkshopsTab';
import MessagesTab    from './tabs/MessagesTab';
import GalleryTab     from './tabs/GalleryTab';
import './AdminDashboard.css';

const TABS = ['Hero','Skills','Projects','My Apps','Education','Journal','Internships','Courses','Workshops','Gallery','Messages'];
const THEME_STORAGE_KEY = 'portfolio-admin-theme';

export default function AdminDashboard() {
  const { isAdmin, logout } = useAuth();
  const navigate            = useNavigate();
  const [tab,   setTab]     = useState('Hero');
  const [data,  setData]    = useState({});
  const [flash, setFlash]   = useState('');
  const [theme, setTheme]   = useState(() => {
    if (typeof window === 'undefined') return 'light';
    const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    return savedTheme === 'dark' ? 'dark' : 'light';
  });

  useEffect(() => { if (!isAdmin) navigate('/admin'); }, [isAdmin, navigate]);
  useEffect(() => { loadAll(); }, []);
  useEffect(() => {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const loadAll = async () => {
    const [port, msgs, gallery] = await Promise.all([
      API.get('/portfolio/'),
      API.get('/admin/messages/'),
      API.get('/admin/gallery/'),
    ]);
    setData({ ...port.data, messages: msgs.data, gallery: gallery.data });
  };

  const showFlash = (msg) => { setFlash(msg); setTimeout(() => setFlash(''), 2800); };
  const handleLogout = () => { logout(); navigate('/'); };
  const unread = (data.messages || []).filter((m) => !m.is_read).length;

  return (
    <div className={`dashboard theme-${theme}`}>
      <aside className="sidebar">
        <div className="sidebar-brand">Profile Admin</div>
        <nav className="sidebar-nav">
          {TABS.map((t) => (
            <button key={t} className={`sidebar-item ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
              {t}
              {t === 'Messages' && unread > 0 && <span className="unread-dot">{unread}</span>}
            </button>
          ))}
        </nav>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </aside>

      <main className="dash-content">
        <div className="admin-actions">
          <div className="admin-panel-pill">Admin Panel</div>
          <div className="theme-switch" role="group" aria-label="Admin theme switcher">
            <button
              type="button"
              className={theme === 'light' ? 'active' : ''}
              onClick={() => setTheme('light')}
            >
              Normal
            </button>
            <button
              type="button"
              className={theme === 'dark' ? 'active' : ''}
              onClick={() => setTheme('dark')}
            >
              Dark
            </button>
          </div>
        </div>
        {flash && <div className="flash">{flash}</div>}
        {tab === 'Hero'           && <HeroTab        data={data.hero}           reload={loadAll} flash={showFlash} />}
        {tab === 'Skills'         && <SkillsTab       data={data.skills}         reload={loadAll} flash={showFlash} />}
        {tab === 'Projects'       && <ProjectsTab     data={data.projects}       reload={loadAll} flash={showFlash} />}
        {tab === 'My Apps'        && <AppsTab         data={data.apps}           reload={loadAll} flash={showFlash} />}
        {tab === 'Education'      && <EducationTab    data={data.education}      reload={loadAll} flash={showFlash} />}
        {tab === 'Journal'        && <JournalTab      data={data.journals}       reload={loadAll} flash={showFlash} />}
        {tab === 'Internships'    && <InternshipsTab  data={data.internships}    reload={loadAll} flash={showFlash} />}
        {tab === 'Courses'        && <CertsTab        data={data.certifications} reload={loadAll} flash={showFlash} />}
        {tab === 'Workshops'      && <WorkshopsTab    data={data.workshops}      reload={loadAll} flash={showFlash} />}
        {tab === 'Gallery'        && <GalleryTab      data={data.gallery}        reload={loadAll} flash={showFlash} />}
        {tab === 'Messages'       && <MessagesTab     data={data.messages} />}
      </main>
    </div>
  );
}
