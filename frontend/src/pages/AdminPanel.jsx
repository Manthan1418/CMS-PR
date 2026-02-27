import React, { useState, useEffect } from 'react';
import { getAllPages, savePageContent } from '../services/api';
import HeroEditor from '../components/admin/HeroEditor';
import AboutEditor from '../components/admin/AboutEditor';
import ServicesEditor from '../components/admin/ServicesEditor';
import ContactEditor from '../components/admin/ContactEditor';
import NavbarEditor from '../components/admin/NavbarEditor';
import FooterEditor from '../components/admin/FooterEditor';
import './AdminPanel.css';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('hero');
  const [pageData, setPageData] = useState({
    navbar: {},
    hero: {},
    about: {},
    services: {},
    contact: {},
    footer: {}
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPageData();
  }, []);

  const fetchPageData = async () => {
    try {
      setLoading(true);
      const data = await getAllPages();
      if (data && data.home) {
        setPageData(data.home);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching page data:', error);
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage(null);
      await savePageContent('home', pageData);
      setMessage({ type: 'success', text: 'Content saved successfully!' });
      setSaving(false);
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save content' });
      setSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const updateSection = (section, data) => {
    setPageData(prev => ({
      ...prev,
      [section]: data
    }));
  };

  const tabs = [
    { id: 'navbar', label: 'Navigation', icon: '🧭' },
    { id: 'hero', label: 'Hero Section', icon: '🏠' },
    { id: 'about', label: 'About Section', icon: 'ℹ️' },
    { id: 'services', label: 'Services', icon: '🛠️' },
    { id: 'contact', label: 'Contact', icon: '📧' },
    { id: 'footer', label: 'Footer', icon: '🦶' }
  ];

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="spinner"></div>
        <p>Loading admin panel...</p>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h1>🎛️ Content Management System</h1>
        <div className="admin-actions">
          <a href="/" target="_blank" className="view-site-btn">
            View Site
          </a>
          <button
            className="save-btn"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Saving...' : '💾 Save Changes'}
          </button>
        </div>
      </div>

      {message && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="admin-body">
        <div className="admin-sidebar">
          <nav className="admin-nav">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="nav-icon">{tab.icon}</span>
                <span className="nav-label">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="admin-content">
          <div className="content-wrapper">
            {activeTab === 'navbar' && (
              <NavbarEditor
                data={pageData.navbar}
                onUpdate={(data) => updateSection('navbar', data)}
              />
            )}
            {activeTab === 'hero' && (
              <HeroEditor
                data={pageData.hero}
                onUpdate={(data) => updateSection('hero', data)}
              />
            )}
            {activeTab === 'about' && (
              <AboutEditor
                data={pageData.about}
                onUpdate={(data) => updateSection('about', data)}
              />
            )}
            {activeTab === 'services' && (
              <ServicesEditor
                data={pageData.services}
                onUpdate={(data) => updateSection('services', data)}
              />
            )}
            {activeTab === 'contact' && (
              <ContactEditor
                data={pageData.contact}
                onUpdate={(data) => updateSection('contact', data)}
              />
            )}
            {activeTab === 'footer' && (
              <FooterEditor
                data={pageData.footer}
                onUpdate={(data) => updateSection('footer', data)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
