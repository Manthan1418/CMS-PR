import React, { useState, useEffect } from 'react';
import './EditorStyles.css';

const FooterEditor = ({ data, onUpdate }) => {
  const [formData, setFormData] = useState({
    companyName: '',
    copyright: '',
    socialLinks: []
  });

  useEffect(() => {
    if (data) {
      setFormData({
        companyName: data.companyName || '',
        copyright: data.copyright || '',
        socialLinks: data.socialLinks || []
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

  const addSocialLink = () => {
    const newLinks = [...formData.socialLinks, { icon: '', label: '', url: '' }];
    const newData = { ...formData, socialLinks: newLinks };
    setFormData(newData);
    onUpdate(newData);
  };

  const updateSocialLink = (index, field, value) => {
    const newLinks = [...formData.socialLinks];
    newLinks[index] = { ...newLinks[index], [field]: value };
    const newData = { ...formData, socialLinks: newLinks };
    setFormData(newData);
    onUpdate(newData);
  };

  const removeSocialLink = (index) => {
    const newLinks = formData.socialLinks.filter((_, i) => i !== index);
    const newData = { ...formData, socialLinks: newLinks };
    setFormData(newData);
    onUpdate(newData);
  };

  return (
    <div className="editor-section">
      <h2>Footer Editor</h2>
      <p className="editor-description">Customize your footer content</p>

      <div className="form-group">
        <label>Company Name</label>
        <input
          type="text"
          name="companyName"
          value={formData.companyName}
          onChange={handleChange}
          placeholder="Your Company Name"
        />
      </div>

      <div className="form-group">
        <label>Copyright Text</label>
        <input
          type="text"
          name="copyright"
          value={formData.copyright}
          onChange={handleChange}
          placeholder="e.g., All rights reserved"
        />
        <small>Leave empty to use default text</small>
      </div>

      <div className="form-group">
        <div className="section-header">
          <label>Social Media Links</label>
          <button type="button" className="add-btn" onClick={addSocialLink}>+ Add Social Link</button>
        </div>
        
        <div className="social-links-list">
          {formData.socialLinks.map((social, index) => (
            <div key={index} className="social-link-item">
              <div className="form-row">
                <div className="form-group">
                  <input
                    type="text"
                    value={social.icon}
                    onChange={(e) => updateSocialLink(index, 'icon', e.target.value)}
                    placeholder="Icon emoji (e.g., 📘)"
                    maxLength="2"
                  />
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    value={social.label}
                    onChange={(e) => updateSocialLink(index, 'label', e.target.value)}
                    placeholder="Label (e.g., Facebook)"
                  />
                </div>
              </div>
              
              <input
                type="url"
                value={social.url}
                onChange={(e) => updateSocialLink(index, 'url', e.target.value)}
                placeholder="https://facebook.com/yourpage"
              />
              
              <button
                type="button"
                className="remove-btn"
                onClick={() => removeSocialLink(index)}
              >
                🗑️ Remove
              </button>
            </div>
          ))}
        </div>
        {formData.socialLinks.length === 0 && (
          <p className="empty-state">No social links added. Click "+ Add Social Link" to add your social media.</p>
        )}
      </div>
    </div>
  );
};

export default FooterEditor;
