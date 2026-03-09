import React, { useState } from 'react';
import './CustomSectionCreator.css';

const CustomSectionCreator = ({ onClose, onCreateSection }) => {
  const [sectionName, setSectionName] = useState('');
  const [fields, setFields] = useState([
    { name: '', label: '', type: 'text', required: false, preview: '' }
  ]);
  const [error, setError] = useState('');

  const fieldTypes = [
    { value: 'text', label: 'Short Text' },
    { value: 'textarea', label: 'Text Block' },
    { value: 'richtext', label: 'Rich Text (HTML)' },
    { value: 'image', label: 'Image URL' },
    { value: 'color', label: 'Color Picker' },
    { value: 'list', label: 'List / Repeater' },
    { value: 'email', label: 'Email' },
    { value: 'tel', label: 'Phone' },
    { value: 'url', label: 'URL' },
    { value: 'number', label: 'Number' },
  ];

  const handleSectionNameChange = (e) => {
    const value = e.target.value.toLowerCase().replace(/\s+/g, '-');
    setSectionName(value);
    setError('');
  };

  const handleFieldChange = (index, key, value) => {
    const updatedFields = [...fields];
    updatedFields[index][key] = value;
    setFields(updatedFields);
  };

  const handleAddField = () => {
    setFields([...fields, { name: '', label: '', type: 'text', required: false, preview: '' }]);
  };

  const handleRemoveField = (index) => {
    if (fields.length > 1) {
      setFields(fields.filter((_, i) => i !== index));
    }
  };

  const validateForm = () => {
    if (!sectionName.trim()) {
      setError('Section name is required');
      return false;
    }

    if (sectionName.length < 2) {
      setError('Section name must be at least 2 characters');
      return false;
    }

    const emptyFields = fields.filter(f => !f.name.trim() || !f.label.trim());
    if (emptyFields.length > 0) {
      setError('All fields must have a name and label');
      return false;
    }

    const duplicateNames = fields.map(f => f.name).filter((v, i, a) => a.indexOf(v) !== i);
    if (duplicateNames.length > 0) {
      setError(`Duplicate field names: ${duplicateNames.join(', ')}`);
      return false;
    }

    return true;
  };

  const handleCreate = () => {
    if (validateForm()) {
      const newSection = {
        name: sectionName,
        title: sectionName
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' '),
        fields: fields.map(f => ({
          name: f.name,
          label: f.label,
          type: f.type,
          required: f.required
        }))
      };

      onCreateSection(newSection);
      setSectionName('');
      setFields([{ name: '', label: '', type: 'text', required: false, preview: '' }]);
      setError('');
    }
  };

  return (
    <div className="custom-section-creator">
      <div className="creator-header">
        <button className="back-btn" onClick={onClose}>← Cancel</button>
        <h2>Create Custom Section</h2>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="creator-content">
        <div className="section-basic">
          <h3>Section Details</h3>
          <div className="form-group">
            <label>Section Name *</label>
            <p className="field-hint">Letters, numbers, and hyphens only (e.g., testimonials, team-members)</p>
            <input
              type="text"
              placeholder="e.g., testimonials"
              value={sectionName}
              onChange={handleSectionNameChange}
            />
          </div>
        </div>

        <div className="section-fields">
          <div className="fields-header">
            <h3>Section Fields</h3>
            <p className="field-hint">Define the editable fields for this section</p>
          </div>

          <div className="fields-list">
            {fields.map((field, index) => (
              <div key={index} className="field-editor">
                <div className="field-inputs">
                  <div className="form-group">
                    <label>Field Name *</label>
                    <input
                      type="text"
                      placeholder="e.g., authorName"
                      value={field.name}
                      onChange={(e) => handleFieldChange(index, 'name', e.target.value.replace(/\s+/g, '-'))}
                    />
                  </div>

                  <div className="form-group">
                    <label>Field Label *</label>
                    <input
                      type="text"
                      placeholder="e.g., Author Name"
                      value={field.label}
                      onChange={(e) => handleFieldChange(index, 'label', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Field Type</label>
                    <select
                      value={field.type}
                      onChange={(e) => handleFieldChange(index, 'type', e.target.value)}
                    >
                      {fieldTypes.map(ft => (
                        <option key={ft.value} value={ft.value}>{ft.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group checkbox">
                    <label>
                      <input
                        type="checkbox"
                        checked={field.required}
                        onChange={(e) => handleFieldChange(index, 'required', e.target.checked)}
                      />
                      Required Field
                    </label>
                  </div>
                </div>

                {/* Type-specific preview */}
                {field.type === 'image' && (
                  <div className="type-preview image-preview-box">
                    <label>Preview: Image URL</label>
                    <input
                      type="url"
                      placeholder="Paste an image URL to preview..."
                      value={field.preview || ''}
                      onChange={(e) => handleFieldChange(index, 'preview', e.target.value)}
                    />
                    {field.preview && (
                      <div className="preview-image-container">
                        <img
                          src={field.preview}
                          alt="Preview"
                          onError={(e) => { e.target.style.display = 'none'; }}
                          onLoad={(e) => { e.target.style.display = 'block'; }}
                        />
                      </div>
                    )}
                  </div>
                )}

                {field.type === 'color' && (
                  <div className="type-preview color-preview-box">
                    <label>Preview: Color Picker</label>
                    <div className="color-preview-row">
                      <input
                        type="color"
                        value={field.preview || '#007bff'}
                        onChange={(e) => handleFieldChange(index, 'preview', e.target.value)}
                      />
                      <span className="color-value">{field.preview || '#007bff'}</span>
                      <span className="color-swatch" style={{ background: field.preview || '#007bff' }}></span>
                    </div>
                  </div>
                )}

                {field.type === 'richtext' && (
                  <div className="type-preview richtext-preview-box">
                    <label>Preview: Rich Text Editor</label>
                    <div className="richtext-sample">
                      <div className="sample-toolbar">
                        <span className="sample-btn"><b>B</b></span>
                        <span className="sample-btn"><i>I</i></span>
                        <span className="sample-btn"><u>U</u></span>
                        <span className="sample-btn">&#8226; List</span>
                        <span className="sample-btn">Link</span>
                        <span className="sample-btn">H2</span>
                      </div>
                      <div className="sample-content">Users will be able to write formatted text with <b>bold</b>, <i>italic</i>, lists, links, and headings here.</div>
                    </div>
                  </div>
                )}

                {field.type === 'textarea' && (
                  <div className="type-preview textarea-preview-box">
                    <label>Preview: Text Block</label>
                    <textarea
                      rows="3"
                      placeholder="This is how the multi-line text area will look..."
                      value={field.preview || ''}
                      onChange={(e) => handleFieldChange(index, 'preview', e.target.value)}
                    />
                  </div>
                )}

                {field.type === 'list' && (
                  <div className="type-preview list-preview-box">
                    <label>Preview: List / Repeater</label>
                    <div className="list-sample">
                      <div className="list-sample-item"><span>Item 1</span><span className="sample-remove">×</span></div>
                      <div className="list-sample-item"><span>Item 2</span><span className="sample-remove">×</span></div>
                      <span className="sample-add">+ Add Item</span>
                    </div>
                  </div>
                )}

                {(field.type === 'text' || field.type === 'email' || field.type === 'tel' || field.type === 'url' || field.type === 'number') && (
                  <div className="type-preview basic-preview-box">
                    <label>Preview: {fieldTypes.find(ft => ft.value === field.type)?.label}</label>
                    <input
                      type={field.type}
                      placeholder={`Sample ${fieldTypes.find(ft => ft.value === field.type)?.label.toLowerCase()} input...`}
                      value={field.preview || ''}
                      onChange={(e) => handleFieldChange(index, 'preview', e.target.value)}
                    />
                  </div>
                )}

                {fields.length > 1 && (
                  <button
                    className="remove-field-btn"
                    onClick={() => handleRemoveField(index)}
                    title="Remove field"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>

          <button className="add-field-btn" onClick={handleAddField}>
            + Add Another Field
          </button>
        </div>

        <div className="creator-actions">
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
          <button
            className="create-btn"
            onClick={handleCreate}
            disabled={!sectionName.trim()}
          >
            Create Section Type
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomSectionCreator;
