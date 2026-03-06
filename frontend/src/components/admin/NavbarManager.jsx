import React, { useState, useEffect } from 'react';
import { getAllPagesData, updatePageContent } from '../../services/api';
import './NavbarManager.css';

const NavbarManager = ({ onClose }) => {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [globalNavbar, setGlobalNavbar] = useState({
    logo: 'CMS',
    links: []
  });

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      setLoading(true);
      const allPages = await getAllPagesData();
      setPages(Object.keys(allPages) || []);

      // Get navbar from first page or use defaults
      const firstPageKey = Object.keys(allPages)[0];
      if (firstPageKey && allPages[firstPageKey]?.navbar) {
        setGlobalNavbar(allPages[firstPageKey].navbar);
      }
    } catch (err) {
      console.error('Failed to fetch pages:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNavbar = async () => {
    try {
      setSaving(true);

      // Update navbar on all pages
      const allPages = await getAllPagesData();

      for (const pageName of Object.keys(allPages)) {
        const pageData = allPages[pageName];
        pageData.navbar = globalNavbar;
        await updatePageContent(pageName, pageData);
      }

      alert('Navigation updated on all pages!');
      setSaving(false);
    } catch (err) {
      console.error('Error saving navbar:', err);
      alert('Failed to save navigation');
      setSaving(false);
    }
  };

  const handleAddLink = () => {
    const newLinks = [...(globalNavbar.links || []), { label: 'New Link', href: '#' }];
    setGlobalNavbar({ ...globalNavbar, links: newLinks });
  };

  const handleUpdateLink = (index, field, value) => {
    const newLinks = [...(globalNavbar.links || [])];
    newLinks[index] = { ...newLinks[index], [field]: value };
    setGlobalNavbar({ ...globalNavbar, links: newLinks });
  };

  const handleRemoveLink = (index) => {
    const newLinks = (globalNavbar.links || []).filter((_, i) => i !== index);
    setGlobalNavbar({ ...globalNavbar, links: newLinks });
  };

  if (loading) {
    return <div className="navbar-manager">Loading...</div>;
  }

  return (
    <div className="navbar-manager">
      <div className="navbar-header">
        <button className="back-btn" onClick={onClose}>← Back to Pages</button>
        <h2>🧭 Global Navigation</h2>
      </div>

      <div className="navbar-content">
        <div className="navbar-section">
          <h3>Logo & Branding</h3>
          <div className="form-group">
            <label>Logo Text</label>
            <input
              type="text"
              value={globalNavbar?.logo || ''}
              onChange={(e) => setGlobalNavbar({ ...globalNavbar, logo: e.target.value })}
              placeholder="Enter logo text"
            />
          </div>
        </div>

        <div className="navbar-section">
          <h3>Navigation Links</h3>
          <p className="section-hint">These links appear in the navbar on all pages</p>

          <div className="links-list">
            {(globalNavbar?.links || []).length === 0 ? (
              <p className="no-links">No navigation links yet. Add one below.</p>
            ) : (
              (globalNavbar?.links || []).map((link, index) => (
                <div key={index} className="link-editor">
                  <div className="link-fields">
                    <div className="form-group">
                      <label>Label</label>
                      <input
                        type="text"
                        placeholder="e.g., Home, About, Services"
                        value={link.label}
                        onChange={(e) => handleUpdateLink(index, 'label', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label>URL / Path</label>
                      <input
                        type="text"
                        placeholder="e.g., /home, /about, #section"
                        value={link.href}
                        onChange={(e) => handleUpdateLink(index, 'href', e.target.value)}
                      />
                    </div>
                  </div>
                  <button
                    className="remove-link-btn"
                    onClick={() => handleRemoveLink(index)}
                    title="Remove link"
                  >
                    ✕
                  </button>
                </div>
              ))
            )}
          </div>

          <button className="add-link-btn" onClick={handleAddLink}>
            + Add Navigation Link
          </button>
        </div>

        <div className="navbar-section">
          <h3>Available Pages</h3>
          <p className="section-hint">These pages are automatically included in navigation</p>
          <div className="pages-reference">
            {pages.length === 0 ? (
              <p>No pages created yet</p>
            ) : (
              <ul>
                {pages.map(page => (
                  <li key={page}>
                    <code>/{page}</code>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="navbar-actions">
          <button
            className="cancel-btn"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="save-btn"
            onClick={handleSaveNavbar}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Navigation'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NavbarManager;
