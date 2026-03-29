import React from 'react';
import useFadeIn from '../../hooks/useFadeIn';
import './About.css';

export default function About({ data, stats }) {
  const ref = useFadeIn();
  return (
    <section id="about" className="about-section">
      <div className="fade-in" ref={ref}>
        <span className="section-label"><span className="pulse" /> About Me</span>
        <h2 className="section-title">Who <span>I Am</span></h2>
        <div className="about-grid">
          <p className="about-text">{data?.bio}</p>
          <div className="about-stats">
            <div className="stat"><span className="stat-num">{stats?.cgpa || '8.86'}</span><span className="stat-label">CGPA</span></div>
            <div className="stat"><span className="stat-num">{stats?.projectCount || 0}</span><span className="stat-label">Projects</span></div>
            <div className="stat"><span className="stat-num">{stats?.certCount || 0}</span><span className="stat-label">Certifications</span></div>
            <div className="stat"><span className="stat-num">{stats?.workshopCount || 0}</span><span className="stat-label">Workshops</span></div>
          </div>
        </div>
      </div>
    </section>
  );
}
