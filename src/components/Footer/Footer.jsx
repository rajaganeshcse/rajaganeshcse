import React from 'react';
import './Footer.css';

export default function Footer({ hero }) {
  return (
    <footer className="footer">
      <div className="footer-left">
        <span className="footer-logo">{hero?.name || 'Rajaganesh T'}</span>
        <span className="footer-tagline">{hero?.title || 'Aspiring Android App Developer'}</span>
      </div>
      <span className="footer-center">{hero?.college || 'Dhanalakshmi Srinivasan Engineering College, Perambalur - B.E CSE (2023 - 2027)'}</span>
      <span className="footer-right">Built with React and Node.js</span>
    </footer>
  );
}
