import React, { useEffect, useState } from 'react';
import useFadeIn from '../../hooks/useFadeIn';
import './Journal.css';

function DocumentIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="journal-action-icon">
      <path
        d="M8 3h6l5 5v11a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm5 1.5V9h4.5"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="journal-action-icon">
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

export default function Journal({ data }) {
  const ref = useFadeIn();
  const [selectedJournal, setSelectedJournal] = useState(null);

  useEffect(() => {
    if (!selectedJournal) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setSelectedJournal(null);
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedJournal]);

  return (
    <section id="journal" className="journal-section">
      <div className="fade-in" ref={ref}>
        <span className="section-label"><span className="pulse" /> Journal</span>
        <h2 className="section-title">Study <span>Journal</span></h2>
        <p className="section-sub">Uploaded journal notes, reports, and reference PDFs from the admin panel.</p>
      </div>

      <div className="journal-grid">
        {(data || []).length > 0 ? (
          data.map((journal) => (
            <article key={journal.id} className="journal-card card">
              <div className="journal-card-top">
                <span className="badge">PDF Upload</span>
                {journal.pdf_name ? <span className="journal-file-chip">{journal.pdf_name}</span> : null}
              </div>
              <h3 className="journal-title">{journal.title}</h3>
              <p className="journal-details">{journal.details || 'No journal details added yet.'}</p>
              <div className="journal-actions">
                {journal.pdf_url ? (
                  <>
                    <button type="button" className="btn-outline" onClick={() => setSelectedJournal(journal)}>
                      <DocumentIcon />
                      View PDF
                    </button>
                    <a href={journal.pdf_download_url || journal.pdf_url} className="btn-primary">
                      <DownloadIcon />
                      Download
                    </a>
                  </>
                ) : (
                  <span className="journal-empty-pill">PDF not uploaded yet</span>
                )}
              </div>
            </article>
          ))
        ) : (
          <article className="journal-card card journal-empty-card">
            <span className="badge">Coming Soon</span>
            <h3 className="journal-title">Journal uploads will appear here</h3>
            <p className="journal-details">
              Add a journal title, details, and PDF from the admin panel to show it in this section.
            </p>
          </article>
        )}
      </div>

      {selectedJournal ? (
        <div className="journal-modal-backdrop" onClick={() => setSelectedJournal(null)} role="presentation">
          <div
            className="journal-modal card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="journal-preview-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="journal-modal-close"
              type="button"
              onClick={() => setSelectedJournal(null)}
              aria-label="Close journal preview"
            >
              x
            </button>
            <div className="journal-modal-header">
              <span className="badge">Journal PDF</span>
              <h3 id="journal-preview-title" className="journal-modal-title">{selectedJournal.title}</h3>
              {selectedJournal.details ? <p className="journal-details">{selectedJournal.details}</p> : null}
            </div>
            <div className="journal-actions">
              <a href={selectedJournal.pdf_url} target="_blank" rel="noreferrer" className="btn-outline">
                <DocumentIcon />
                Open PDF
              </a>
              <a href={selectedJournal.pdf_download_url || selectedJournal.pdf_url} className="btn-primary">
                <DownloadIcon />
                Download
              </a>
            </div>
            <div className="journal-pdf-wrap">
              <iframe
                src={selectedJournal.pdf_url}
                title={`${selectedJournal.title} PDF`}
                className="journal-pdf-frame"
              />
            </div>
            {selectedJournal.pdf_name ? <p className="journal-file-name">File: {selectedJournal.pdf_name}</p> : null}
          </div>
        </div>
      ) : null}
    </section>
  );
}
