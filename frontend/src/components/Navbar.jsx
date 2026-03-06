import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getAllPages } from '../services/api';
import './Navbar.css';

const Navbar = ({ logo, links = [] }) => {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const fetchPages = async () => {
      try {
        const pagesList = await getAllPages();
        setPages(Array.isArray(pagesList) ? pagesList : []);
      } catch (err) {
        console.error('Error fetching pages for navbar:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPages();
  }, []);

  // Use provided links or default to page navigation
  const navLinks = links.length > 0 ? links : pages.map(page => ({
    label: page.title || page.name,
    href: `/${page.name}`
  }));

  const isActive = (href) => {
    if (href === '/' || href === '/home') {
      return location.pathname === '/' || location.pathname === '/home';
    }
    return location.pathname === href;
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          {logo || 'CMS'}
        </Link>
        <ul className="navbar-links">
          {navLinks.map((link, index) => (
            <li key={index}>
              {link.href.startsWith('/') ? (
                <Link
                  to={link.href}
                  className={isActive(link.href) ? 'active' : ''}
                >
                  {link.label}
                </Link>
              ) : (
                <a href={link.href}>{link.label}</a>
              )}
            </li>
          ))}
          <li>
            <Link to="/admin" className="admin-link">Admin</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
