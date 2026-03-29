import React, { useState } from 'react';
import API from '../../utils/api';
import useFadeIn from '../../hooks/useFadeIn';
import './Contact.css';

function Icon({ children, className = '' }) {
  return (
    <span className={`contact-icon ${className}`.trim()} aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        {children}
      </svg>
    </span>
  );
}

function UserIcon() {
  return (
    <Icon>
      <path d="M20 21a8 8 0 0 0-16 0" />
      <circle cx="12" cy="8" r="4" />
    </Icon>
  );
}

function MailIcon() {
  return (
    <Icon>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </Icon>
  );
}

function PhoneIcon() {
  return (
    <Icon>
      <path d="M22 16.92v2a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07A19.5 19.5 0 0 1 5.15 11.8 19.8 19.8 0 0 1 2.08 3.18 2 2 0 0 1 4.07 1h2a2 2 0 0 1 2 1.72c.12.9.33 1.79.62 2.64a2 2 0 0 1-.45 2.11L7.1 8.91a16 16 0 0 0 8 8l1.44-1.14a2 2 0 0 1 2.11-.45c.85.29 1.74.5 2.64.62A2 2 0 0 1 22 16.92Z" />
    </Icon>
  );
}

function MapPinIcon() {
  return (
    <Icon>
      <path d="M12 21s6-5.33 6-11a6 6 0 1 0-12 0c0 5.67 6 11 6 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </Icon>
  );
}

function HomeIcon() {
  return (
    <Icon>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.5V21h14V9.5" />
    </Icon>
  );
}

function CollegeIcon() {
  return (
    <Icon>
      <path d="M2 9 12 4l10 5-10 5L2 9Z" />
      <path d="M6 11.5V16c0 1.1 2.69 2 6 2s6-.9 6-2v-4.5" />
    </Icon>
  );
}

function GlobeIcon() {
  return (
    <Icon>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3a15 15 0 0 1 0 18" />
      <path d="M12 3a15 15 0 0 0 0 18" />
    </Icon>
  );
}

function FileIcon() {
  return (
    <Icon>
      <path d="M14 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v5h5" />
      <path d="M9 13h6" />
      <path d="M9 17h6" />
    </Icon>
  );
}

function GithubIcon() {
  return (
    <Icon className="contact-icon-compact">
      <path d="M9 19c-4 1.5-4-2.5-6-3" />
      <path d="M15 22v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 19 4.77 5.07 5.07 0 0 0 18.91 1S17.73.65 15 2.48a13.38 13.38 0 0 0-6 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77 5.44 5.44 0 0 0 3.5 8.53c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    </Icon>
  );
}

function LinkedinIcon() {
  return (
    <Icon className="contact-icon-compact">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4V9h4v2" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </Icon>
  );
}

function CodeIcon() {
  return (
    <Icon className="contact-icon-compact">
      <path d="m8 9-4 3 4 3" />
      <path d="m16 9 4 3-4 3" />
      <path d="m14 5-4 14" />
    </Icon>
  );
}

function InstagramIcon() {
  return (
    <Icon className="contact-icon-compact">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <path d="M17.5 6.5h.01" />
    </Icon>
  );
}

function InfoRow({ icon, label, children }) {
  return (
    <div className="info-row">
      <div className="info-head">
        {icon}
        <span className="info-label">{label}</span>
      </div>
      <div className="info-content">{children}</div>
    </div>
  );
}

function SocialLink({ href, icon, label }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className="social-pill">
      {icon}
      <span>{label}</span>
    </a>
  );
}

export default function Contact({ hero }) {
  const ref = useFadeIn();
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post('/contact/', form);
      setStatus('success');
      setForm({ name: '', email: '', message: '' });
    } catch {
      setStatus('error');
    }
    setLoading(false);
  };

  return (
    <section id="contact" className="contact-section">
      <div className="fade-in" ref={ref}>
        <span className="section-label"><span className="pulse" /> Contact</span>
        <h2 className="section-title">Let's <span>Connect</span></h2>
        <p className="section-sub">Open to internships, collaborations and opportunities</p>
      </div>
      <div className="contact-grid">
        <div className="contact-info">
          <div className="contact-panel card">
            <InfoRow icon={<UserIcon />} label="Name">
              <span className="info-val">{hero?.name || 'Rajaganesh T'}</span>
            </InfoRow>
            <InfoRow icon={<MailIcon />} label="Email">
              <a href={`mailto:${hero?.email || 'rajaganeshcse2005@gmail.com'}`} className="info-val">
                {hero?.email || 'rajaganeshcse2005@gmail.com'}
              </a>
            </InfoRow>
            <InfoRow icon={<PhoneIcon />} label="Phone">
              <a href={`tel:${hero?.phone || '+91 6382641748'}`} className="info-val">
                {hero?.phone || '+91 6382641748'}
              </a>
            </InfoRow>
            <InfoRow icon={<MapPinIcon />} label="Location">
              <span className="info-val">{hero?.location || 'Vanrasankuppam, Cuddalore, Tamil Nadu, India'}</span>
            </InfoRow>
            <InfoRow icon={<HomeIcon />} label="Address">
              <span className="info-val">{hero?.address || '70, MaariAmman Kovil Street, Vanrasankuppam, Cuddalore (TK), Cuddalore (DT) - 607102'}</span>
            </InfoRow>
            <InfoRow icon={<CollegeIcon />} label="College">
              <span className="info-val">{hero?.college || 'Dhanalakshmi Srinivasan Engineering College, Perambalur - B.E CSE (2023 - 2027)'}</span>
            </InfoRow>
            {hero?.portfolio ? (
              <InfoRow icon={<GlobeIcon />} label="Website">
                <a href={hero.portfolio} target="_blank" rel="noreferrer" className="resume-link">
                  <GlobeIcon />
                  <span>Open Portfolio</span>
                </a>
              </InfoRow>
            ) : null}
            {hero?.resume_url ? (
              <InfoRow icon={<FileIcon />} label="Resume">
                <a href={hero.resume_url} target="_blank" rel="noreferrer" className="resume-link">
                  <FileIcon />
                  <span>Open Resume</span>
                </a>
              </InfoRow>
            ) : null}
            <div className="contact-socials">
              <SocialLink href={hero?.github || 'https://github.com/rajaganeshcse'} icon={<GithubIcon />} label="GitHub" />
              <SocialLink href={hero?.linkedin || 'https://www.linkedin.com/in/rajaganesh-t-835a21364'} icon={<LinkedinIcon />} label="LinkedIn" />
              {hero?.leetcode ? (
                <SocialLink href={hero.leetcode} icon={<CodeIcon />} label="LeetCode" />
              ) : null}
              {hero?.instagram ? (
                <SocialLink href={hero.instagram} icon={<InstagramIcon />} label="Instagram" />
              ) : null}
            </div>
          </div>
        </div>
        <form className="contact-form card" onSubmit={handleSubmit}>
          <div className="form-field">
            <label>Your Name</label>
            <input name="name" value={form.name} placeholder="Your name" required onChange={onChange} />
          </div>
          <div className="form-field">
            <label>Email Address</label>
            <input name="email" type="email" value={form.email} placeholder="you@example.com" required onChange={onChange} />
          </div>
          <div className="form-field">
            <label>Message</label>
            <textarea name="message" rows={5} value={form.message} placeholder="Tell me about your opportunity or project..." required onChange={onChange} />
          </div>
          {status === 'success' && <p className="form-ok">Message sent successfully.</p>}
          {status === 'error' && <p className="form-err">Something went wrong. Please try again.</p>}
          <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
            {loading ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </div>
    </section>
  );
}
