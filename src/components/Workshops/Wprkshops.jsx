import React, { useState, useEffect } from 'react';
import useFadeIn from '../../hooks/useFadeIn';
import './Workshops.css';

function buildImages(ws) {
  const imgs = [];
  if (ws.image_url)  imgs.push(ws.image_url);
  if (ws.image_url2) imgs.push(ws.image_url2);
  if (ws.image_url3) imgs.push(ws.image_url3);
  return imgs;
}

function WorkshopCard({ ws, onClick }) {
  const images  = buildImages(ws);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const t = setInterval(() => setCurrent((c) => (c + 1) % images.length), 2500);
    return () => clearInterval(t);
  }, [images.length]);

  return (
    <div className="ws-card card" onClick={onClick}>
      {images.length > 0 && (
        <div className="ws-img-wrap">
          {images.map((src, i) => (
            <img
              key={i}
              src={src}
              alt={ws.title}
              className={`ws-img ${i === current ? 'ws-img-active' : ''}`}
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          ))}
          {images.length > 1 && (
            <div className="ws-dots">
              {images.map((_, i) => (
                <span
                  key={i}
                  className={`ws-dot ${i === current ? 'active' : ''}`}
                  onClick={(e) => { e.stopPropagation(); setCurrent(i); }}
                />
              ))}
            </div>
          )}
          <div className="ws-overlay"><span>Click for details</span></div>
        </div>
      )}
      <div className="ws-body">
        <h3 className="ws-title">{ws.title}</h3>
        <p className="ws-org">{ws.organizer}</p>
        <p className="ws-date">{ws.date}</p>
        <p className="ws-desc">{ws.description}</p>
      </div>
    </div>
  );
}

function WorkshopModal({ ws, onClose }) {
  const images = buildImages(ws);
  const [current, setCurrent] = useState(0);

  const prev = (e) => { e.stopPropagation(); setCurrent((c) => (c - 1 + images.length) % images.length); };
  const next = (e) => { e.stopPropagation(); setCurrent((c) => (c + 1) % images.length); };

  return (
    <div className="ws-modal-bg" onClick={onClose}>
      <div className="ws-modal" onClick={(e) => e.stopPropagation()}>
        <button className="ws-modal-close" onClick={onClose}>✕</button>

        {images.length > 0 && (
          <div className="ws-modal-gallery">
            <img
              src={images[current]}
              alt={ws.title}
              className="ws-modal-img"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            {images.length > 1 && (
              <>
                <button className="ws-nav ws-nav-l" onClick={prev}>‹</button>
                <button className="ws-nav ws-nav-r" onClick={next}>›</button>
                <div className="ws-modal-dots">
                  {images.map((_, i) => (
                    <span
                      key={i}
                      className={`ws-dot ${i === current ? 'active' : ''}`}
                      onClick={(e) => { e.stopPropagation(); setCurrent(i); }}
                    />
                  ))}
                </div>
                <span className="ws-counter">{current + 1} / {images.length}</span>
              </>
            )}
          </div>
        )}

        <div className="ws-modal-body">
          <h2 className="ws-modal-title">{ws.title}</h2>
          <p className="ws-modal-org">{ws.organizer}</p>
          <p className="ws-modal-date">{ws.date}</p>
          <p className="ws-modal-desc">{ws.description}</p>
        </div>
      </div>
    </div>
  );
}

export default function Workshops({ data }) {
  const ref = useFadeIn();
  const [selected, setSelected] = useState(null);

  return (
    <section id="workshops" className="workshops-section">
      <div className="fade-in" ref={ref}>
        <span className="section-label"><span className="pulse" /> Learning</span>
        <h2 className="section-title">Work<span>shops</span></h2>
        <p className="section-sub">Hands-on learning beyond the classroom</p>
      </div>

      <div className="workshops-grid">
        {data.map((ws) => (
          <WorkshopCard key={ws.id} ws={ws} onClick={() => setSelected(ws)} />
        ))}
      </div>

      {selected && <WorkshopModal ws={selected} onClose={() => setSelected(null)} />}
    </section>
  );
}