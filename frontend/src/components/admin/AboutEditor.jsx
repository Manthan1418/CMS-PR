import React, { useState, useEffect } from 'react';
import './EditorStyles.css';

const AboutEditor = ({ data, onUpdate }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    imageUrl: ''
  });

  useEffect(() => {
    if (data) {
      setFormData({
        title: data.title || '',
        content: data.content || '',
        imageUrl: data.imageUrl || ''
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
      <h2>About Section Editor</h2>
      <p className="editor-description">Customize your about section content</p>

      <div className="form-group">
        <label>Section Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g., About Us"
        />
      </div>

      <div className="form-group">
        <label>Content * <span>(Required)</span></label>
        <textarea
          name="content"
          value={formData.content}
          onChange={handleChange}
          rows="8"
          placeholder="Enter your about content here..."
        />
        <small>Tell your story and describe your business</small>
      </div>

      <div className="form-group">
        <label>Image URL</label>
        <input
          type="text"
          name="imageUrl"
          value={formData.imageUrl}
          onChange={handleChange}
          placeholder="https://example.com/about-image.jpg"
        />
        <small>Image will appear on the left side of the content</small>
      </div>
    </div>
  );
};

export default AboutEditor;
