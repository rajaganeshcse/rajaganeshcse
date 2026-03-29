import React from 'react';
import useFadeIn from '../../hooks/useFadeIn';
import './Skills.css';

const CAT_LABELS = {
  programming: 'Programming',
  frontend:    'Frontend',
  mobile:      'Mobile Development',
  backend:     'Backend',
  database:    'Database',
  analytics:   'Data Analytics',
  ml:          'Machine Learning',
  tools:       'Tools & Platforms',
};

export default function Skills({ data }) {
  const ref = useFadeIn();
  const grouped = data.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {});

  return (
    <section id="skills" className="skills-section">
      <div className="fade-in" ref={ref}>
        <span className="section-label"><span className="pulse" /> Skills</span>
        <h2 className="section-title">Technical <span>Expertise</span></h2>
        <p className="section-sub">Technologies I use to build things</p>
      </div>
      <div className="skills-grid">
        {Object.entries(grouped).map(([cat, items]) => (
          <div key={cat} className="skill-card card">
            <h3 className="skill-cat">{CAT_LABELS[cat] || cat}</h3>
            {items.map((skill) => (
              <div key={skill.id} className="skill-row">
                <div className="skill-meta">
                  <span className="skill-name">{skill.name}</span>
                  <span className="skill-pct">{skill.level}%</span>
                </div>
                <div className="skill-track">
                  <div className="skill-fill" style={{ '--w': `${skill.level}%` }} />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
