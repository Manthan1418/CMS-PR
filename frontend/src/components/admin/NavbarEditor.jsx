import React, { useState, useEffect } from 'react';
import './EditorStyles.css';

const NavbarEditor = ({ data, onUpdate }) => {
  const [formData, setFormData] = useState({
    logo: '',
    links: []
  });

  useEffect(() => {
    if (data) {
      setFormData({
        logo: data.logo || '',
        links: data.links || []
      });
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      onUpdate(newData);
      return newData;
    });
  };

  const addLink = () => {
    const newLinks = [...formData.links, { label: 'New Link', href: '#' }];
    const newData = { ...formData, links: newLinks };
    setFormData(newData);
    onUpdate(newData);
  };

  const updateLink = (index, field, value) => {
    const newLinks = [...formData.links];
    newLinks[index] = { ...newLinks[index], [field]: value };
    const newData = { ...formData, links: newLinks };
    setFormData(newData);
    onUpdate(newData);
  };

  const removeLink = (index) => {
    const newLinks = formData.links.filter((_, i) => i !== index);
    const newData = { ...formData, links: newLinks };
    setFormData(newData);
    onUpdate(newData);
  };

  return (
    <div className="editor-section">
      <h2>Navigation Editor</h2>
      <p className="editor-description">Customize your navigation bar</p>

      <div className="form-group">
        <label>Logo Text</label>
        <input
          type="text"
          name="logo"
          value={formData.logo}
          onChange={handleChange}
          placeholder="Enter your logo text"
        />
      </div>

      <div className="form-group">
        <div className="section-header">
          <label>Navigation Links</label>
          <button type="button" className="add-btn" onClick={addLink}>+ Add Link</button>
        </div>
        
        <div className="links-list">
          {formData.links.map((link, index) => (
            <div key={index} className="link-item">
              <input
                type="text"
                value={link.label}
                onChange={(e) => updateLink(index, 'label', e.target.value)}
                placeholder="Link Label"
              />
              <input
                type="text"
                value={link.href}
                onChange={(e) => updateLink(index, 'href', e.target.value)}
                placeholder="Link URL (e.g., #home)"
              />
              <button
                type="button"
                className="remove-btn"
                onClick={() => removeLink(index)}
              >
                🗑️
              </button>
            </div>
          ))}
        </div>
        {formData.links.length === 0 && (
          <p className="empty-state">No links added yet. Click "+ Add Link" to add navigation links.</p>
        )}
      </div>
    </div>
  );
};

export default NavbarEditor;
