import React, { useState, useEffect } from 'react';
import { getAllPages, createPage, deletePage, getAllPagesData, updatePageContent } from '../../services/api';
import PageEditor from './PageEditor';
import NavbarManager from './NavbarManager';
import './PageManager.css';

const PageManager = () => {
  const [pages, setPages] = useState([]);
  const [selectedPage, setSelectedPage] = useState(null);
  const [newPageName, setNewPageName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeView, setActiveView] = useState('pages'); // 'pages', 'navbar', or 'editor'

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      setLoading(true);
      const data = await getAllPages();
      setPages(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      setError('Failed to fetch pages');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePage = async () => {
    if (!newPageName.trim()) {
      alert('Please enter a page name');
      return;
    }

    try {
      const newPage = {
        metadata: {
          title: newPageName,
          sections: ['hero', 'about', 'services', 'contact'],
          createdAt: new Date().toISOString(),
        },
        navbar: {
          logo: 'Logo',
          links: [],
        },
        sections: {
          hero: { title: 'Welcome', subtitle: 'Your page subtitle' },
          about: { title: 'About', content: 'Add about content' },
          services: { title: 'Services', items: [] },
          contact: { title: 'Contact', email: '', phone: '' },
        },
        footer: {
          companyName: 'Your Company',
          copyright: '© 2025 Your Company',
          socialLinks: [],
        },
      };

      await createPage(newPageName, newPage);
      setNewPageName('');
      await fetchPages();
      alert('Page created successfully!');
    } catch (err) {
      setError('Failed to create page');
      console.error(err);
    }
  };

  const handleDeletePage = async (pageName) => {
    if (!window.confirm(`Are you sure you want to delete page "${pageName}"?`)) {
      return;
    }

    try {
      await deletePage(pageName);
      await fetchPages();
      if (selectedPage?.name === pageName) {
        setSelectedPage(null);
      }
      alert('Page deleted successfully!');
    } catch (err) {
      setError('Failed to delete page');
      console.error(err);
    }
  };

  if (loading) {
    return <div className="page-manager">Loading pages...</div>;
  }

  return (
    <div className="page-manager">
      {/* Left Sidebar */}
      <div className="pages-list">
        <h2>Pages</h2>

        <div className="create-page">
          <input
            type="text"
            placeholder="New page name"
            value={newPageName}
            onChange={(e) => setNewPageName(e.target.value)}
          />
          <button onClick={handleCreatePage}>Create</button>
        </div>

        <div className="pages-items">
          {pages.length === 0 ? (
            <p>No pages created yet.</p>
          ) : (
            pages.map((page) => (
              <div
                key={page.name}
                className={`page-item ${selectedPage?.name === page.name && activeView === 'editor' ? 'active' : ''}`}
                onClick={() => {
                  setSelectedPage(page);
                  setActiveView('editor');
                }}
              >
                <div className="page-info">
                  <h4>{page.title}</h4>
                  <p className="page-name">/{page.name}</p>
                </div>
                <button
                  className="delete-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeletePage(page.name);
                  }}
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>

        {/* Global Navbar Manager Button */}
        <div className="global-section">
          <button
            className={`global-btn ${activeView === 'navbar' ? 'active' : ''}`}
            onClick={() => setActiveView('navbar')}
          >
            🧭 Global Navigation
          </button>
        </div>
      </div>

      {/* Right Content Area */}
      <div className="editor-container">
        {activeView === 'navbar' ? (
          <NavbarManager onClose={() => {
            setActiveView('pages');
            fetchPages();
          }} />
        ) : selectedPage ? (
          <PageEditor page={selectedPage} onPageUpdate={fetchPages} />
        ) : (
          <div className="no-selection">
            <p>Select a page to edit its content and sections</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PageManager;
