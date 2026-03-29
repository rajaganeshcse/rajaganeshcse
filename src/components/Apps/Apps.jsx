import React, { useState } from 'react';
import useFadeIn from '../../hooks/useFadeIn';
import './Apps.css';

function buildAppImages(app) {
  const screenshots = app?.screenshot_urls?.length
    ? app.screenshot_urls
    : [app?.screenshot_url1, app?.screenshot_url2, app?.screenshot_url3].filter(Boolean);

  return Array.from(new Set([app?.cover_image_url, ...screenshots].filter(Boolean)));
}

function AppModal({ app, onClose }) {
  const [currentImage, setCurrentImage] = useState(0);
  const images = buildAppImages(app);

  const previousImage = (e) => {
    e.stopPropagation();
    setCurrentImage((value) => (value - 1 + images.length) % images.length);
  };

  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentImage((value) => (value + 1) % images.length);
  };

  return (
    <div className="app-modal-bg" onClick={onClose}>
      <div className="app-modal" onClick={(e) => e.stopPropagation()}>
        <button className="app-modal-close" onClick={onClose}>X</button>

        <div className="app-modal-media">
          {images.length ? (
            <>
              <img src={images[currentImage]} alt={`${app.title} preview ${currentImage + 1}`} />
              {images.length > 1 ? (
                <>
                  <button className="app-nav app-nav-left" type="button" onClick={previousImage}>&lt;</button>
                  <button className="app-nav app-nav-right" type="button" onClick={nextImage}>&gt;</button>
                  <span className="app-image-count">{currentImage + 1} / {images.length}</span>
                </>
              ) : null}
            </>
          ) : (
            <div className="app-empty">
              <div className="app-empty-inner">
                <span className="app-empty-icon">APK</span>
                <span className="app-empty-label">App Preview</span>
              </div>
            </div>
          )}
        </div>

        <div className="app-modal-body">
          <div className="app-modal-top">
            <div>
              <h3 className="app-modal-title">{app.title}</h3>
              <p className="app-modal-sub">App links, screenshots, and APK in one place</p>
            </div>
          </div>

          {images.length > 1 ? (
            <div className="app-thumbs">
              {images.map((image, index) => (
                <button
                  key={image}
                  type="button"
                  className={`app-thumb ${index === currentImage ? 'active' : ''}`}
                  onClick={() => setCurrentImage(index)}
                >
                  <img src={image} alt={`${app.title} thumbnail ${index + 1}`} />
                </button>
              ))}
            </div>
          ) : null}

          <p className="app-modal-desc">{app.description}</p>

          <div className="app-links">
            {app.dashboard_url ? <a href={app.dashboard_url} target="_blank" rel="noreferrer" className="alink">Dashboard</a> : null}
            {app.github_url ? <a href={app.github_url} target="_blank" rel="noreferrer" className="alink">GitHub</a> : null}
            {app.playstore_url ? <a href={app.playstore_url} target="_blank" rel="noreferrer" className="alink">Play Store</a> : null}
            {app.apk_url ? <a href={app.apk_url} target="_blank" rel="noreferrer" className="alink" download>Download APK</a> : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Apps({ data }) {
  const ref = useFadeIn();
  const [selectedApp, setSelectedApp] = useState(null);

  return (
    <section id="apps" className="apps-section">
      <div className="fade-in" ref={ref}>
        <span className="section-label"><span className="pulse" /> My Apps</span>
        <h2 className="section-title">Apps I&apos;ve <span>Released</span></h2>
        <p className="section-sub">Android apps with cover images, screenshots, APK downloads, and live links.</p>
      </div>

      <div className="apps-grid">
        {data.map((app) => {
          const images = buildAppImages(app);

          return (
            <div key={app.id} className="app-card card" onClick={() => setSelectedApp(app)}>
              <div className="app-media">
                {images.length ? (
                  <>
                    <img src={images[0]} alt={app.title} onError={(e) => { e.target.style.display = 'none'; }} />
                    {images.length > 1 ? <span className="app-media-count">{images.length} shots</span> : null}
                  </>
                ) : (
                  <div className="app-empty">
                    <div className="app-empty-inner">
                      <span className="app-empty-icon">APK</span>
                      <span className="app-empty-label">App Package</span>
                    </div>
                  </div>
                )}
                <div className="app-hover-overlay">
                  <span>Open Details</span>
                </div>
              </div>

              <div className="app-body">
                <div className="app-card-top">
                  <h3 className="app-title">{app.title}</h3>
                  <div className="app-status-row">
                    {app.apk_url ? <span className="app-chip">APK</span> : null}
                    {app.playstore_url ? <span className="app-chip">Play Store</span> : null}
                    {app.dashboard_url ? <span className="app-chip">Web</span> : null}
                  </div>
                </div>
                <p className="app-desc">{app.description}</p>
                <div className="app-card-footer">
                  <span className="app-card-link">Click to view screenshots and links</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selectedApp ? <AppModal app={selectedApp} onClose={() => setSelectedApp(null)} /> : null}
    </section>
  );
}
