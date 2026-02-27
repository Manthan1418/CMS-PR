import React from 'react';
import './Footer.css';

const Footer = ({ companyName, copyright, socialLinks = [] }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <p className="footer-text">
            &copy; {currentYear} {companyName || 'CMS PR'}. {copyright || 'All rights reserved.'}
          </p>
          
          {socialLinks.length > 0 && (
            <div className="footer-social">
              {socialLinks.map((social, index) => (
                <a key={index} href={social.url} target="_blank" rel="noopener noreferrer">
                  {social.icon && <span className="social-icon">{social.icon}</span>}
                  {social.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
