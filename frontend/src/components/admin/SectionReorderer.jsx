import React, { useState, useEffect } from 'react';
import './SectionReorderer.css';
import { getCustomTemplates } from './SectionEditor';

const SectionReorderer = ({ pageName, sections, onSave, onEditSection, onCreateCustomSection, sectionData = {}, saving }) => {
  const [orderSections, setOrderSections] = useState(sections || []);
  const [draggedItem, setDraggedItem] = useState(null);
  const [customTemplates, setCustomTemplates] = useState({});

  useEffect(() => {
    // Load custom templates when component mounts or updates
    setCustomTemplates(getCustomTemplates());
  }, []);

  const defaultSections = ['hero', 'about', 'services', 'contact'];
  const allAvailableSections = [...defaultSections, ...Object.keys(customTemplates)];
  const unusedSections = allAvailableSections.filter(s => !orderSections.includes(s));

  const handleDragStart = (e, section, source) => {
    setDraggedItem({ section, source });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDropOnActive = (e, dropIndex) => {
    e.preventDefault();
    if (!draggedItem) return;

    const newOrder = [...orderSections];

    if (draggedItem.source === 'active') {
      // Reorder within active sections
      const dragIndex = newOrder.indexOf(draggedItem.section);
      if (dragIndex !== -1) {
        newOrder.splice(dragIndex, 1);
        newOrder.splice(dropIndex, 0, draggedItem.section);
      }
    } else {
      // Add from unused to active
      newOrder.splice(dropIndex, 0, draggedItem.section);
    }

    setOrderSections(newOrder);
    setDraggedItem(null);
  };

  const handleDropOnUnused = (e) => {
    e.preventDefault();
    if (!draggedItem || draggedItem.source !== 'active') return;

    const newOrder = orderSections.filter(s => s !== draggedItem.section);
    setOrderSections(newOrder);
    setDraggedItem(null);
  };

  const handleRemoveSection = (section) => {
    setOrderSections(orderSections.filter(s => s !== section));
  };

  const handleAddSection = (section) => {
    setOrderSections([...orderSections, section]);
  };

  return (
    <div className="section-reorderer">
      <h3>Manage Sections</h3>
      <p className="info-text">Drag sections to reorder them or remove unused ones. Click Edit to modify section content.</p>

      <div className="sections-container">
        <div className="sections-column">
          <h4>Active Sections</h4>
          <p className="column-hint">Drag to reorder</p>
          <div
            className="sections-list active-sections"
            onDragOver={handleDragOver}
          >
            {orderSections.length === 0 ? (
              <p className="empty-state">No sections selected. Drag sections here.</p>
            ) : (
              orderSections.map((section, index) => (
                <div
                  key={`${section}-${index}`}
                  className="section-item"
                  draggable
                  onDragStart={(e) => handleDragStart(e, section, 'active')}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDropOnActive(e, index)}
                >
                  <span className="drag-handle">⋮</span>
                  <span className="section-name">{section}</span>
                  <div className="section-actions">
                    <button
                      className="edit-btn"
                      onClick={() => onEditSection(section)}
                      title="Edit section"
                    >
                      ✎
                    </button>
                    <button
                      className="remove-btn"
                      onClick={() => handleRemoveSection(section)}
                      title="Remove section"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="sections-column">
          <div className="column-header">
            <div>
              <h4>Available Sections</h4>
              <p className="column-hint">Drag to active sections</p>
            </div>
            <button
              className="create-custom-btn"
              onClick={onCreateCustomSection}
              title="Create new section type"
            >
              + Custom
            </button>
          </div>
          <div
            className="sections-list unused-sections"
            onDragOver={handleDragOver}
            onDrop={handleDropOnUnused}
          >
            {unusedSections.length === 0 ? (
              <p className="empty-state">All sections are active</p>
            ) : (
              unusedSections.map((section) => (
                <div
                  key={section}
                  className="section-item unused"
                  draggable
                  onDragStart={(e) => handleDragStart(e, section, 'unused')}
                >
                  <span className="drag-handle">⋮</span>
                  <span className="section-name">{section}</span>
                  <button
                    className="add-btn"
                    onClick={() => handleAddSection(section)}
                    title="Add section"
                  >
                    +
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="actions">
        <button
          className="save-btn"
          onClick={() => onSave(orderSections)}
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save Sections Order'}
        </button>
      </div>
    </div>
  );
};

export default SectionReorderer;
