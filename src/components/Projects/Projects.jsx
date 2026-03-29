import React, { useState } from 'react';
import useFadeIn from '../../hooks/useFadeIn';
import './Projects.css';

function buildProjectImages(project) {
  return project?.image_urls?.length
    ? project.image_urls
    : [project?.image_url, project?.image_url2, project?.image_url3].filter(Boolean);
}

function ProjectModal({ project, onClose }) {
  const [showVideo, setShowVideo] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const images = buildProjectImages(project);

  const previousImage = (e) => {
    e.stopPropagation();
    setCurrentImage((value) => (value - 1 + images.length) % images.length);
  };

  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentImage((value) => (value + 1) % images.length);
  };

  return (
    <div className="project-modal-bg" onClick={onClose}>
      <div className="project-modal" onClick={(e) => e.stopPropagation()}>
        <button className="project-modal-close" onClick={onClose}>X</button>

        <div className="project-modal-media">
          {showVideo && project.video_url ? (
            <iframe src={project.video_url} title={project.title} frameBorder="0" allowFullScreen />
          ) : images.length ? (
            <>
              <img src={images[currentImage]} alt={`${project.title} preview ${currentImage + 1}`} />
              {images.length > 1 ? (
                <>
                  <button className="project-nav project-nav-left" type="button" onClick={previousImage}>&lt;</button>
                  <button className="project-nav project-nav-right" type="button" onClick={nextImage}>&gt;</button>
                  <span className="project-image-count">{currentImage + 1} / {images.length}</span>
                </>
              ) : null}
            </>
          ) : (
            <div className="project-empty">
              <div className="project-empty-inner">
                <span className="project-empty-icon">&lt;/&gt;</span>
                <span className="project-empty-label">Project Preview</span>
              </div>
            </div>
          )}
        </div>

        <div className="project-modal-body">
          <div className="project-modal-top">
            <h3 className="project-modal-title">{project.title}</h3>
            {project.video_url ? (
              <button type="button" className="play-btn" onClick={() => setShowVideo((value) => !value)}>
                {showVideo ? 'Show Images' : 'Watch Demo'}
              </button>
            ) : null}
          </div>
          {!showVideo && images.length > 1 ? (
            <div className="project-thumbs">
              {images.map((image, index) => (
                <button
                  key={image}
                  type="button"
                  className={`project-thumb ${index === currentImage ? 'active' : ''}`}
                  onClick={() => setCurrentImage(index)}
                >
                  <img src={image} alt={`${project.title} thumbnail ${index + 1}`} />
                </button>
              ))}
            </div>
          ) : null}
          <p className="project-modal-desc">{project.description}</p>
          {(project.tech_list || []).length ? (
            <div className="project-tech">
              {project.tech_list.map((tech, index) => (
                <span key={index} className="badge">{tech}</span>
              ))}
            </div>
          ) : null}
          <div className="project-links">
            {project.github_url ? <a href={project.github_url} target="_blank" rel="noreferrer" className="plink">GitHub</a> : null}
            {project.live_url ? <a href={project.live_url} target="_blank" rel="noreferrer" className="plink">Live Demo</a> : null}
            {project.video_url ? <a href={project.video_url} target="_blank" rel="noreferrer" className="plink">Video Link</a> : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Projects({ data }) {
  const ref = useFadeIn();
  const [selectedProject, setSelectedProject] = useState(null);

  return (
    <section id="projects" className="projects-section">
      <div className="fade-in" ref={ref}>
        <span className="section-label"><span className="pulse" /> Projects</span>
        <h2 className="section-title">What I've <span>Built</span></h2>
        <p className="section-sub">Real-world projects with modern tech stacks</p>
      </div>
      <div className="projects-grid">
        {data.map((project) => (
          <div key={project.id} className="project-card card" onClick={() => setSelectedProject(project)}>
            {(() => {
              const images = buildProjectImages(project);
              return (
            <div className="project-media">
              {images.length ? (
                <>
                  <img src={images[0]} alt={project.title} onError={(e) => { e.target.style.display = 'none'; }} />
                  {images.length > 1 ? <span className="project-media-count">{images.length} photos</span> : null}
                </>
              ) : (
                <div className="project-empty">
                  <div className="project-empty-inner">
                    <span className="project-empty-icon">&lt;/&gt;</span>
                    <span className="project-empty-label">Source Code</span>
                  </div>
                </div>
              )}
              <div className="project-hover-overlay">
                <span>View Details</span>
              </div>
            </div>
              );
            })()}
            <div className="project-body">
              <h3 className="project-title">{project.title}</h3>
              <p className="project-desc">{project.description}</p>
              <div className="project-tech">
                {(project.tech_list || []).slice(0, 4).map((tech, index) => (
                  <span key={index} className="badge">{tech}</span>
                ))}
              </div>
              <div className="project-card-footer">
                <span className="project-card-link">Click to open full details</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedProject ? <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} /> : null}
    </section>
  );
}
