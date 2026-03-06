import React, { useState, useEffect } from 'react';
import { getPageContent, updatePageContent, updatePageSectionsOrder } from '../../services/api';
import SectionReorderer from './SectionReorderer';
import SectionEditor from './SectionEditor';
import CustomSectionCreator from './CustomSectionCreator';
import './PageEditor.css';

const PageEditor = ({ page, onPageUpdate }) => {
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('sections');
  const [editingSection, setEditingSection] = useState(null);
  const [showCustomCreator, setShowCustomCreator] = useState(false);

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        setLoading(true);
        const data = await getPageContent(page.name);
        console.log('Fetched page data:', data);
        setPageData(data);
      } catch (err) {
        console.error('Failed to fetch page data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPageData();
  }, [page.name]);

  const handleSavePageData = async (updatedData) => {
    try {
      setSaving(true);
      await updatePageContent(page.name, updatedData);
      setPageData(updatedData);
      alert('Page saved successfully!');
      onPageUpdate();
    } catch (err) {
      console.error('Error saving page:', err);
      alert('Failed to save page');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSectionsOrder = async (newOrder) => {
    try {
      setSaving(true);
      await updatePageSectionsOrder(page.name, newOrder);
      const updatedData = { ...pageData, metadata: { ...pageData.metadata, sections: newOrder } };
      setPageData(updatedData);
      alert('Sections order updated!');
    } catch (err) {
      console.error('Error updating sections order:', err);
      alert('Failed to update sections order');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSection = async (sectionName, sectionData) => {
    try {
      setSaving(true);
      const updatedData = {
        ...pageData,
        sections: {
          ...pageData.sections,
          [sectionName]: sectionData
        }
      };
      await updatePageContent(page.name, updatedData);
      setPageData(updatedData);
      alert(`${sectionName} section updated!`);
      setEditingSection(null);
    } catch (err) {
      console.error('Error saving section:', err);
      alert('Failed to save section');
    } finally {
      setSaving(false);
    }
  };

  const handleCreateCustomSection = (newSection) => {
    // Save the custom section template to localStorage
    const customTemplates = JSON.parse(localStorage.getItem('customSectionTemplates') || '{}');
    customTemplates[newSection.name] = {
      title: newSection.title,
      fields: newSection.fields
    };
    localStorage.setItem('customSectionTemplates', JSON.stringify(customTemplates));

    // Close the creator and show success message
    setShowCustomCreator(false);
    alert(`Custom section type "${newSection.title}" created successfully!`);

    // Force a re-render of section reorderer by updating state
    setPageData({ ...pageData });
  };

  if (loading) {
    return <div className="page-editor">Loading page content...</div>;
  }

  if (!pageData) {
    return <div className="page-editor">Failed to load page data</div>;
  }

  if (showCustomCreator) {
    return (
      <CustomSectionCreator
        onClose={() => setShowCustomCreator(false)}
        onCreateSection={handleCreateCustomSection}
      />
    );
  }

  // Set defaults for missing properties
  const defaultPageData = {
    metadata: pageData.metadata || { title: page.title, sections: [], createdAt: new Date().toISOString() },
    navbar: pageData.navbar || { logo: '', links: [] },
    sections: pageData.sections || {},
    footer: pageData.footer || { companyName: '', copyright: '', socialLinks: [] },
  };

  if (editingSection) {
    return (
      <SectionEditor
        pageName={page.name}
        sectionName={editingSection}
        sectionData={defaultPageData.sections[editingSection] || {}}
        onSave={handleSaveSection}
        onCancel={() => setEditingSection(null)}
        saving={saving}
      />
    );
  }

  return (
    <div className="page-editor">
      <div className="editor-header">
        <h2>{page.title}</h2>
        <p className="page-path">/{page.name}</p>
      </div>

      <div className="editor-tabs">
        <button
          className={`tab ${activeTab === 'sections' ? 'active' : ''}`}
          onClick={() => setActiveTab('sections')}
        >
          Sections
        </button>
        <button
          className={`tab ${activeTab === 'navbar' ? 'active' : ''}`}
          onClick={() => setActiveTab('navbar')}
        >
          Navbar
        </button>
        <button
          className={`tab ${activeTab === 'footer' ? 'active' : ''}`}
          onClick={() => setActiveTab('footer')}
        >
          Footer
        </button>
      </div>

      <div className="editor-content">
        {activeTab === 'sections' && (
          <SectionReorderer
            pageName={page.name}
            sections={defaultPageData.metadata?.sections || []}
            availableSections={Object.keys(defaultPageData.sections || {})}
            onSave={handleSaveSectionsOrder}
            onEditSection={setEditingSection}
            onCreateCustomSection={() => setShowCustomCreator(true)}
            sectionData={defaultPageData.sections}
            saving={saving}
          />
        )}

        {activeTab === 'navbar' && (
          <NavbarEditor
            data={defaultPageData.navbar}
            onSave={(navbar) => handleSavePageData({ ...pageData, navbar })}
            saving={saving}
          />
        )}

        {activeTab === 'footer' && (
          <FooterEditor
            data={defaultPageData.footer}
            onSave={(footer) => handleSavePageData({ ...pageData, footer })}
            saving={saving}
          />
        )}
      </div>
    </div>
  );
};

// Navbar Editor
const NavbarEditor = ({ data, onSave, saving }) => {
  const [navbar, setNavbar] = useState(data || { logo: '', links: [] });

  const handleAddLink = () => {
    const newLinks = [...(navbar.links || []), { label: 'New Link', href: '#' }];
    setNavbar({ ...navbar, links: newLinks });
  };

  const handleUpdateLink = (index, field, value) => {
    const newLinks = [...(navbar.links || [])];
    newLinks[index] = { ...newLinks[index], [field]: value };
    setNavbar({ ...navbar, links: newLinks });
  };

  const handleRemoveLink = (index) => {
    const newLinks = (navbar.links || []).filter((_, i) => i !== index);
    setNavbar({ ...navbar, links: newLinks });
  };

  return (
    <div className="editor-form">
      <div className="form-group">
        <label>Logo Text</label>
        <input
          type="text"
          value={navbar?.logo || ''}
          onChange={(e) => setNavbar({ ...navbar, logo: e.target.value })}
        />
      </div>

      <div className="form-group">
        <label>Navigation Links</label>
        {(navbar?.links || []).map((link, index) => (
          <div key={index} className="link-item">
            <input
              type="text"
              placeholder="Link label"
              value={link.label}
              onChange={(e) => handleUpdateLink(index, 'label', e.target.value)}
            />
            <input
              type="text"
              placeholder="Link URL"
              value={link.href}
              onChange={(e) => handleUpdateLink(index, 'href', e.target.value)}
            />
            <button onClick={() => handleRemoveLink(index)}>Remove</button>
          </div>
        ))}
        <button onClick={handleAddLink} className="add-btn">Add Link</button>
      </div>

      <button
        className="save-btn"
        onClick={() => onSave(navbar)}
        disabled={saving}
      >
        {saving ? 'Saving...' : 'Save'}
      </button>
    </div>
  );
};

// Footer Editor
const FooterEditor = ({ data, onSave, saving }) => {
  const [footer, setFooter] = useState(data || { companyName: '', copyright: '', socialLinks: [] });

  return (
    <div className="editor-form">
      <div className="form-group">
        <label>Company Name</label>
        <input
          type="text"
          value={footer?.companyName || ''}
          onChange={(e) => setFooter({ ...footer, companyName: e.target.value })}
        />
      </div>

      <div className="form-group">
        <label>Copyright Text</label>
        <input
          type="text"
          value={footer?.copyright || ''}
          onChange={(e) => setFooter({ ...footer, copyright: e.target.value })}
        />
      </div>

      <button
        className="save-btn"
        onClick={() => onSave(footer)}
        disabled={saving}
      >
        {saving ? 'Saving...' : 'Save'}
      </button>
    </div>
  );
};

export default PageEditor;
