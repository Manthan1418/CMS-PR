import React from 'react';
import './Navbar.css';

const Navbar = ({ logo, links = [] }) => {
  const defaultLinks = [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Services', href: '#services' },
    { label: 'Contact', href: '#contact' }
  ];

  const navLinks = links.length > 0 ? links : defaultLinks;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          {logo || 'CMS PR'}
        </div>
        <ul className="navbar-links">
          {navLinks.map((link, index) => (
            <li key={index}>
              <a href={link.href}>{link.label}</a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
