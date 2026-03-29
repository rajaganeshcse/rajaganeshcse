import React, { useEffect, useState } from 'react';
import useFadeIn from '../../hooks/useFadeIn';
import './Education.css';

function DownloadIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="edu-download-icon">
      <path
        d="M12 3v10m0 0 4-4m-4 4-4-4M5 15v3a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="edu-location-icon">
      <path
        d="M12 21s6-5.33 6-11a6 6 0 1 0-12 0c0 5.67 6 11 6 11Zm0-8.5A2.5 2.5 0 1 0 12 7a2.5 2.5 0 0 0 0 5.5Z"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function buildDocuments(education) {
  if (Array.isArray(education.documents) && education.documents.length > 0) {
    return education.documents.filter((document) => document.pdf_url);
  }

  if (education.result_pdf_url) {
    return [
      {
        id: `${education.id}-legacy-doc`,
        title: education.result_pdf_name || 'Uploaded PDF',
        pdf_url: education.result_pdf_url,
        pdf_download_url: education.result_pdf_download_url || education.result_pdf_url,
        pdf_name: education.result_pdf_name || '',
      },
    ];
  }

  return [];
}

function getResultLabel(count) {
  if (count === 0) {
    return 'Academic details';
  }

  if (count === 1) {
    return '1 result PDF';
  }

  return `${count} result PDFs`;
}

export default function Education({ data }) {
  const ref = useFadeIn();
  const [selectedEducation, setSelectedEducation] = useState(null);
  const [activeDocumentIndex, setActiveDocumentIndex] = useState(0);

  const selectedDocuments = selectedEducation ? buildDocuments(selectedEducation) : [];
  const activeDocument = selectedDocuments[activeDocumentIndex] || selectedDocuments[0] || null;

  useEffect(() => {
    if (!selectedEducation) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setSelectedEducation(null);
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedEducation]);

  return (
    <section id="education" className="education-section">
      <div className="fade-in" ref={ref}>
        <span className="section-label"><span className="pulse" /> Education</span>
        <h2 className="section-title">Academic <span>Background</span></h2>
        <p className="section-sub">My educational journey</p>
      </div>
      <div className="edu-grid">
        {data.map((education) => {
          const documents = buildDocuments(education);

          return (
            <button
              key={education.id}
              type="button"
              className="edu-card card edu-card-clickable"
              aria-haspopup="dialog"
              onClick={() => {
                setSelectedEducation(education);
                setActiveDocumentIndex(0);
              }}
            >
              <div className="edu-card-top">
                <span className="edu-year">{education.year || 'Academic record'}</span>
                <span className="edu-result-pill">{getResultLabel(documents.length)}</span>
              </div>
              <h3 className="edu-degree">{education.degree}</h3>
              <p className="edu-inst">{education.institution}</p>
              {education.location ? (
                <p className="edu-location">
                  <LocationIcon />
                  <span>{education.location}</span>
                </p>
              ) : null}
              <div className="edu-card-footer">
                {education.score ? <span className="edu-score">{education.score}</span> : <span className="edu-card-hint">Click to view details</span>}
                <span className="edu-card-icon" aria-hidden="true">
                  <DownloadIcon />
                </span>
              </div>
            </button>
          );
        })}
      </div>
      {selectedEducation ? (
        <div className="edu-modal-backdrop" onClick={() => setSelectedEducation(null)} role="presentation">
          <div
            className="edu-modal card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="education-result-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="edu-modal-close"
              type="button"
              onClick={() => setSelectedEducation(null)}
              aria-label="Close academic details"
            >
              x
            </button>

            <div className="edu-modal-header">
              <span className="edu-year">{selectedEducation.year || 'Academic record'}</span>
              <h3 id="education-result-title" className="edu-modal-title">{selectedEducation.degree}</h3>
              <p className="edu-inst">{selectedEducation.institution}</p>
              <div className="edu-modal-pills">
                {selectedEducation.score ? <span className="edu-score">{selectedEducation.score}</span> : null}
                <span className="edu-result-pill">{getResultLabel(selectedDocuments.length)}</span>
              </div>
            </div>

            <div className="edu-detail-grid">
              <div className="edu-detail-card">
                <span className="edu-detail-label">Institution</span>
                <p>{selectedEducation.institution || 'Not provided'}</p>
              </div>
              <div className="edu-detail-card">
                <span className="edu-detail-label">Location</span>
                <p>{selectedEducation.location || 'Not provided'}</p>
              </div>
              <div className="edu-detail-card">
                <span className="edu-detail-label">Duration</span>
                <p>{selectedEducation.year || 'Not provided'}</p>
              </div>
              <div className="edu-detail-card">
                <span className="edu-detail-label">Score</span>
                <p>{selectedEducation.score || 'Not provided'}</p>
              </div>
            </div>

            {activeDocument ? (
              <div className="edu-modal-layout">
                <div className="edu-docs-panel">
                  <p className="edu-docs-label">Semester Results</p>
                  <div className="edu-docs-list">
                    {selectedDocuments.map((document, index) => (
                      <div
                        key={document.id || `${selectedEducation.id}-${index}`}
                        className={`edu-doc-row ${index === activeDocumentIndex ? 'active' : ''}`}
                      >
                        <button
                          type="button"
                          className="edu-doc-select"
                          onClick={() => setActiveDocumentIndex(index)}
                        >
                          <span className="edu-doc-index">{String(index + 1).padStart(2, '0')}</span>
                          <span className="edu-doc-copy">
                            <span className="edu-doc-title">{document.title || `Semester ${index + 1} Result`}</span>
                            {document.pdf_name ? (
                              <span className="edu-doc-file">{document.pdf_name}</span>
                            ) : null}
                          </span>
                        </button>
                        <a
                          href={document.pdf_download_url || document.pdf_url}
                          className="edu-doc-download"
                          download
                          onClick={(event) => event.stopPropagation()}
                          aria-label={`Download ${document.title || `semester ${index + 1} result`}`}
                        >
                          <DownloadIcon />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="edu-preview-panel">
                  <div className="edu-modal-actions">
                    <a
                      href={activeDocument.pdf_url}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-outline"
                    >
                      Open PDF
                    </a>
                    <a
                      href={activeDocument.pdf_download_url || activeDocument.pdf_url}
                      className="btn-primary edu-download-btn"
                      download
                    >
                      <DownloadIcon />
                      Download PDF
                    </a>
                  </div>

                  <div className="edu-preview-card">
                    <p className="edu-preview-title">{activeDocument.title || 'Selected Result'}</p>
                    <div className="edu-pdf-frame-wrap">
                      <iframe
                        src={activeDocument.pdf_url}
                        title={`${selectedEducation.degree} ${activeDocument.title} PDF`}
                        className="edu-pdf-frame"
                      />
                    </div>
                    {activeDocument.pdf_name ? (
                      <p className="edu-file-name">File: {activeDocument.pdf_name}</p>
                    ) : null}
                  </div>
                </div>
              </div>
            ) : (
              <div className="edu-empty-state">
                <p className="edu-empty-title">No result PDFs uploaded yet.</p>
                <p className="edu-file-name">The academic details are available, but semester documents have not been added for this record.</p>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </section>
  );
}
