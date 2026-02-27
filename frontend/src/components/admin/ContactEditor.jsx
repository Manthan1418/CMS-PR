import React, { useState, useEffect } from 'react';
import './EditorStyles.css';

const ContactEditor = ({ data, onUpdate }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    email: '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    if (data) {
      setFormData({
        title: data.title || '',
        description: data.description || '',
        email: data.email || '',
        phone: data.phone || '',
        address: data.address || ''
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
      <h2>Contact Section Editor</h2>
      <p className="editor-description">Customize your contact information</p>

      <div className="form-group">
        <label>Section Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g., Contact Us"
        />
      </div>

      <div className="form-group">
        <label>Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="3"
          placeholder="Enter a brief description for your contact section"
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Email Address</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="contact@example.com"
          />
        </div>

        <div className="form-group">
          <label>Phone Number</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+1 234 567 890"
          />
        </div>
      </div>

      <div className="form-group">
        <label>Address</label>
        <textarea
          name="address"
          value={formData.address}
          onChange={handleChange}
          rows="3"
          placeholder="Your business address..."
        />
      </div>
    </div>
  );
};

export default ContactEditor;
