import React, { useRef, useEffect, useState } from 'react';
import API from '../../utils/api';
import './Gallery.css';

const CAT_COLOR = {
  certificate: '#0f766e',
  internship: '#9b5c17',
  workshop: '#155e75',
  project: '#1f8f5f',
  achievement: '#c56a1a',
};

export default function Gallery() {
  const trackRef = useRef(null);
  const animRef = useRef(null);
  const posRef = useRef(0);
  const isDragging = useRef(false);
  const dragStart = useRef(0);

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    API.get('/gallery/')
      .then((res) => { setImages(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || images.length === 0) return undefined;

    const animate = () => {
      if (!isDragging.current) {
        posRef.current -= 0.5;
        const half = track.scrollWidth / 2;
        if (Math.abs(posRef.current) >= half) posRef.current = 0;
        track.style.transform = `translateX(${posRef.current}px)`;
      }
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);

    const stop = () => cancelAnimationFrame(animRef.current);
    const start = () => { animRef.current = requestAnimationFrame(animate); };

    const onMouseDown = (e) => { isDragging.current = true; dragStart.current = e.clientX - posRef.current; track.style.cursor = 'grabbing'; };
    const onMouseMove = (e) => { if (!isDragging.current) return; posRef.current = e.clientX - dragStart.current; track.style.transform = `translateX(${posRef.current}px)`; };
    const onMouseUp = () => { isDragging.current = false; track.style.cursor = 'grab'; };
    const onTouchStart = (e) => { isDragging.current = true; dragStart.current = e.touches[0].clientX - posRef.current; };
    const onTouchMove = (e) => { if (!isDragging.current) return; posRef.current = e.touches[0].clientX - dragStart.current; track.style.transform = `translateX(${posRef.current}px)`; };
    const onTouchEnd = () => { isDragging.current = false; };

    track.addEventListener('mouseenter', stop);
    track.addEventListener('mouseleave', start);
    track.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    track.addEventListener('touchstart', onTouchStart, { passive: true });
    track.addEventListener('touchmove', onTouchMove, { passive: true });
    track.addEventListener('touchend', onTouchEnd);

    return () => {
      cancelAnimationFrame(animRef.current);
      track.removeEventListener('mouseenter', stop);
      track.removeEventListener('mouseleave', start);
      track.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      track.removeEventListener('touchstart', onTouchStart);
      track.removeEventListener('touchmove', onTouchMove);
      track.removeEventListener('touchend', onTouchEnd);
    };
  }, [images.length]);

  if (loading || images.length === 0) return null;

  const doubled = [...images, ...images];

  return (
    <section className="gallery-section">
      <div className="gallery-head">
        <span className="section-label"><span className="pulse" /> Gallery</span>
        <h2 className="section-title">My <span>Participation</span></h2>
        <p className="section-sub">Snapshots from workshops, achievements, internships, and project milestones.</p>
      </div>

      <div className="gallery-wrapper">
        <div className="fade-l" />
        <div className="fade-r" />
        <div className="gallery-track" ref={trackRef} style={{ cursor: 'grab' }}>
          {doubled.map((item, i) => (
            <div key={i} className="g-card" onClick={() => setLightbox(item)}>
              <div className="g-img-wrap">
                {item.image_url ? (
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="g-img"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentNode.querySelector('.g-fallback').style.display = 'flex';
                    }}
                  />
                ) : null}
                <div
                  className="g-fallback"
                  style={{
                    display: item.image_url ? 'none' : 'flex',
                    background: `${CAT_COLOR[item.category] || '#0f766e'}14`,
                  }}
                >
                  <span className="g-fallback-icon">IMG</span>
                  <span className="g-fallback-text">No image</span>
                </div>
                <div className="g-hover-overlay">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /><line x1="11" y1="8" x2="11" y2="14" /><line x1="8" y1="11" x2="14" y2="11" /></svg>
                </div>
              </div>
              <div className="g-footer">
                <p className="g-title">{item.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {lightbox && (
        <div className="lightbox" onClick={() => setLightbox(null)}>
          <div className="lightbox-box" onClick={(e) => e.stopPropagation()}>
            <button className="lb-close" onClick={() => setLightbox(null)}>X</button>
            {lightbox.image_url && (
              <img src={lightbox.image_url} alt={lightbox.title} className="lb-img" />
            )}
            <div className="lb-info">
              <span
                className="lb-badge"
                style={{
                  background: `${CAT_COLOR[lightbox.category] || '#0f766e'}15`,
                  color: CAT_COLOR[lightbox.category] || '#0f766e',
                  border: `1px solid ${CAT_COLOR[lightbox.category] || '#0f766e'}30`,
                }}
              >
                {lightbox.category}
              </span>
              <h3 className="lb-title">{lightbox.title}</h3>
              {lightbox.caption && <p className="lb-caption">{lightbox.caption}</p>}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
