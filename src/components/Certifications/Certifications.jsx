import React, { useState } from 'react';
import useFadeIn from '../../hooks/useFadeIn';
import './Certifications.css';

function CertificationModal({ cert, onClose }) {
  return (
    <div className="cert-modal-bg" onClick={onClose}>
      <div className="cert-modal" onClick={(e) => e.stopPropagation()}>
        <button className="cert-modal-close" onClick={onClose}>X</button>
        {cert.image_url ? (
          <img src={cert.image_url} alt={cert.name} className="cert-modal-img" />
        ) : (
          <div className="cert-placeholder cert-modal-placeholder">
            <div className="cert-placeholder-icon">CERT</div>
            <span className="cert-placeholder-text">Course</span>
          </div>
        )}
        <div className="cert-modal-body">
          <h4 className="cert-modal-title">{cert.name}</h4>
          <p className="cert-issuer">{cert.issuer}</p>
          {cert.year ? <span className="cert-year">{cert.year}</span> : null}
          {cert.description ? <p className="cert-modal-desc">{cert.description}</p> : null}
          {cert.credential_url ? (
            <a href={cert.credential_url} target="_blank" rel="noreferrer" className="plink">Open Certificate Link</a>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default function Certifications({ data }) {
  const ref = useFadeIn();
  const [selectedCert, setSelectedCert] = useState(null);

  return (
    <section id="courses" className="certs-section">
      <div className="fade-in" ref={ref}>
        <span className="section-label"><span className="pulse" /> Courses</span>
        <h2 className="section-title">Completed <span>Courses</span></h2>
        <p className="section-sub">Course certificates, platforms and credential links</p>
      </div>
      <div className="certs-grid">
        {data.map((cert) => (
          <div key={cert.id} className="cert-card card" onClick={() => setSelectedCert(cert)}>
            {cert.image_url ? (
              <img src={cert.image_url} alt={cert.name} className="cert-img" onError={(e) => { e.target.style.display = 'none'; }} />
            ) : (
              <div className="cert-placeholder">
                <div className="cert-placeholder-icon">CERT</div>
                <span className="cert-placeholder-text">Course</span>
              </div>
            )}
            <div className="cert-info">
              <h4 className="cert-name">{cert.name}</h4>
              <p className="cert-issuer">{cert.issuer}</p>
              {cert.year ? <span className="cert-year">{cert.year}</span> : null}
              <span className="cert-card-link">Click to open full course details</span>
            </div>
          </div>
        ))}
      </div>

      {selectedCert ? <CertificationModal cert={selectedCert} onClose={() => setSelectedCert(null)} /> : null}
    </section>
  );
}
