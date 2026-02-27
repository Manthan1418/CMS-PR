import React, { useState, useEffect } from 'react';
import './EditorStyles.css';

const HeroEditor = ({ data, onUpdate }) => {
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    ctaText: '',
    ctaLink: '',
    backgroundImage: ''
  });

  useEffect(() => {
    if (data) {
      setFormData({
        title: data.title || '',
        subtitle: data.subtitle || '',
        ctaText: data.ctaText || '',
        ctaLink: data.ctaLink || '',
        backgroundImage: data.backgroundImage || ''
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

  return (
    <div className="editor-section">
      <h2>Hero Section Editor</h2>
      <p className="editor-description">Customize your main hero/banner section</p>

      <div className="form-group">
        <label>Hero Title * <span>(Required)</span></label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter your main headline"
        />
        <small>This is the main headline that appears on your homepage</small>
      </div>

      <div className="form-group">
        <label>Subtitle</label>
        <textarea
          name="subtitle"
          value={formData.subtitle}
          onChange={handleChange}
          rows="3"
          placeholder="Enter your subtitle or tagline"
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Call-to-Action Text</label>
          <input
            type="text"
            name="ctaText"
            value={formData.ctaText}
            onChange={handleChange}
            placeholder="e.g., Get Started"
          />
        </div>

        <div className="form-group">
          <label>Call-to-Action Link</label>
          <input
            type="text"
            name="ctaLink"
            value={formData.ctaLink}
            onChange={handleChange}
            placeholder="e.g., #contact or /about"
          />
        </div>
      </div>

      <div className="form-group">
        <label>Background Image URL</label>
        <input
          type="text"
          name="backgroundImage"
          value={formData.backgroundImage}
          onChange={handleChange}
          placeholder="https://example.com/image.jpg"
        />
        <small>Leave empty to use gradient background</small>
      </div>
    </div>
  );
};

export default HeroEditor;
