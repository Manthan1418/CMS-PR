import React, { useState } from 'react';
import './SectionEditor.css';

// Default section templates
const defaultSectionTemplates = {
  hero: {
    title: 'Hero Section',
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'subtitle', label: 'Subtitle', type: 'text' },
      { name: 'ctaText', label: 'CTA Button Text', type: 'text' },
      { name: 'ctaLink', label: 'CTA Button Link', type: 'text' },
      { name: 'backgroundImage', label: 'Background Image URL', type: 'text' },
    ]
  },
  about: {
    title: 'About Section',
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'content', label: 'Content', type: 'textarea', required: true },
      { name: 'imageUrl', label: 'Image URL', type: 'text' },
    ]
  },
  services: {
    title: 'Services Section',
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'items', label: 'Services (JSON)', type: 'textarea' },
    ]
  },
  contact: {
    title: 'Contact Section',
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'email', label: 'Email', type: 'email' },
      { name: 'phone', label: 'Phone', type: 'tel' },
      { name: 'address', label: 'Address', type: 'text' },
    ]
  }
};

// Load custom templates from localStorage
const getCustomTemplates = () => {
  try {
    const stored = localStorage.getItem('customSectionTemplates');
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
};

const getAllSectionTemplates = () => {
  return { ...defaultSectionTemplates, ...getCustomTemplates() };
};

const SectionEditor = ({ sectionName, sectionData, onSave, onCancel, saving }) => {
  const [data, setData] = useState(sectionData);
  const allTemplates = getAllSectionTemplates();
  const template = allTemplates[sectionName] || { title: sectionName, fields: [] };

  const handleChange = (field, value) => {
    setData({ ...data, [field]: value });
  };

  const handleSave = () => {
    onSave(sectionName, data);
  };

  return (
    <div className="section-editor">
      <div className="editor-header">
        <button className="back-btn" onClick={onCancel}>← Back</button>
        <h3>{template.title}</h3>
      </div>

      <div className="editor-form">
        {template.fields.length === 0 ? (
          <p className="no-fields">No editor template for this section. Edit raw data:</p>
        ) : (
          template.fields.map(field => (
            <div key={field.name} className="form-group">
              <label>
                {field.label}
                {field.required && <span className="required">*</span>}
              </label>
              {field.type === 'textarea' ? (
                <textarea
                  value={typeof data[field.name] === 'string' ? data[field.name] : JSON.stringify(data[field.name] || {}, null, 2)}
                  onChange={(e) => {
                    try {
                      const value = field.name === 'items' ? JSON.parse(e.target.value) : e.target.value;
                      handleChange(field.name, value);
                    } catch {
                      handleChange(field.name, e.target.value);
                    }
                  }}
                  rows="6"
                  placeholder={field.name === 'items' ? '[{"name":"Service 1","description":"..."}]' : ''}
                />
              ) : (
                <input
                  type={field.type || 'text'}
                  value={data[field.name] || ''}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  placeholder={`Enter ${field.label.toLowerCase()}`}
                />
              )}
            </div>
          ))
        )}

        <div className="editor-actions">
          <button className="cancel-btn" onClick={onCancel}>Cancel</button>
          <button
            className="save-btn"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Section'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SectionEditor;
export { defaultSectionTemplates, getCustomTemplates, getAllSectionTemplates };
