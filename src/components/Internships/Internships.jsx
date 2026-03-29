import React from 'react';
import useFadeIn from '../../hooks/useFadeIn';
import './Internships.css';

export default function Internships({ data }) {
  const ref = useFadeIn();
  if (!data?.length) return null;
  return (
    <section id="internships" className="internships-section">
      <div className="fade-in" ref={ref}>
        <span className="section-label"><span className="pulse" /> Experience</span>
        <h2 className="section-title">Intern<span>ships</span></h2>
        <p className="section-sub">Real-world professional experience</p>
      </div>
      <div className="timeline">
        {data.map((item, i) => (
          <div key={item.id} className="tl-item">
            <div className="tl-dot">{String(i+1).padStart(2,'0')}</div>
            <div className="tl-card card">
              {item.image_url ? (
                <div className="tl-image-wrap">
                  <img src={item.image_url} alt={`${item.role} internship`} className="tl-image" />
                </div>
              ) : null}
              <div className="tl-top">
                <div>
                  <h3 className="tl-role">{item.role}</h3>
                  <p className="tl-company">{item.company}</p>
                </div>
                <span className="tl-duration">{item.duration}</span>
              </div>
              <p className="tl-desc">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
