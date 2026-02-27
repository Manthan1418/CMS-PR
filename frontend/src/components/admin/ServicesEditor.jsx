import React, { useState, useEffect } from 'react';
import './EditorStyles.css';

const ServicesEditor = ({ data, onUpdate }) => {
  const [formData, setFormData] = useState({
    title: '',
    items: []
  });

  useEffect(() => {
    if (data) {
      setFormData({
        title: data.title || '',
        items: data.items || []
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

  const addService = () => {
    const newItems = [...formData.items, { icon: '🔧', title: '', description: '' }];
    const newData = { ...formData, items: newItems };
    setFormData(newData);
    onUpdate(newData);
  };

  const updateService = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    const newData = { ...formData, items: newItems };
    setFormData(newData);
    onUpdate(newData);
  };

  const removeService = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    const newData = { ...formData, items: newItems };
    setFormData(newData);
    onUpdate(newData);
  };

  return (
    <div className="editor-section">
      <h2>Services Editor</h2>
      <p className="editor-description">Manage your services section</p>

      <div className="form-group">
        <label>Section Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g., Our Services"
        />
      </div>

      <div className="form-group">
        <div className="section-header">
          <label>Services</label>
          <button type="button" className="add-btn" onClick={addService}>+ Add Service</button>
        </div>
        
        <div className="services-list">
          {formData.items.map((service, index) => (
            <div key={index} className="service-item-editor">
              <div className="service-header">
                <input
                  type="text"
                  className="icon-input"
                  value={service.icon}
                  onChange={(e) => updateService(index, 'icon', e.target.value)}
                  placeholder="Icon (emoji)"
                  maxLength="2"
                />
                <button
                  type="button"
                  className="remove-btn small"
                  onClick={() => removeService(index)}
                >
                  Remove
                </button>
              </div>
              
              <input
                type="text"
                value={service.title}
                onChange={(e) => updateService(index, 'title', e.target.value)}
                placeholder="Service Title"
              />
              
              <textarea
                rows="3"
                value={service.description}
                onChange={(e) => updateService(index, 'description', e.target.value)}
                placeholder="Service description..."
              />
            </div>
          ))}
        </div>
        {formData.items.length === 0 && (
          <p className="empty-state">No services added yet. Click "+ Add Service" to add your services.</p>
        )}
      </div>
    </div>
  );
};

export default ServicesEditor;
