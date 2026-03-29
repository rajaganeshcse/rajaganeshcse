import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const NAV_LINKS = [
  { label: 'About', id: 'about' },
  { label: 'Skills', id: 'skills' },
  { label: 'Projects', id: 'projects' },
  { label: 'My Apps', id: 'apps' },
  { label: 'Internships', id: 'internships' },
  { label: 'Education', id: 'education' },
  { label: 'Journal', id: 'journal' },
  { label: 'Courses', id: 'courses' },
  { label: 'Workshops', id: 'workshops' },
  { label: 'Contact', id: 'contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active,   setActive]   = useState('');
  const [open,     setOpen]     = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60);
      NAV_LINKS.forEach((link) => {
        const el = document.getElementById(link.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) setActive(link.id);
        }
      });
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setOpen(false);
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <span className="nav-logo">RajaGanesh</span>

      <ul className="nav-links">
        {NAV_LINKS.map((link) => (
          <li key={link.id}>
            <button
              className={active === link.id ? 'active' : ''}
              onClick={() => scrollTo(link.id)}
            >
              {link.label}
            </button>
          </li>
        ))}
      </ul>

      <Link to="/admin" className="nav-admin">Admin</Link>

      <button className="hamburger" onClick={() => setOpen(!open)}>
        <span className={open ? 'open' : ''} />
        <span className={open ? 'open' : ''} />
        <span className={open ? 'open' : ''} />
      </button>

      {open && (
        <div className="mobile-menu">
          {NAV_LINKS.map((link) => (
            <button key={link.id} onClick={() => scrollTo(link.id)}>{link.label}</button>
          ))}
          <Link to="/admin" onClick={() => setOpen(false)}>Admin Panel</Link>
        </div>
      )}
    </nav>
  );
}
