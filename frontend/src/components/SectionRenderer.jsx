import React from 'react';
import Hero from './Hero';
import About from './About';
import Services from './Services';
import Contact from './Contact';

// Map of section types to components
const sectionComponents = {
  hero: Hero,
  about: About,
  services: Services,
  contact: Contact,
};

// Generic section component for custom sections
const GenericSection = ({ title, ...props }) => {
  return (
    <section className="generic-section">
      {title && <h2>{title}</h2>}
      <div className="generic-content">
        {Object.entries(props).map(([key, value]) => {
          if (key === 'title') return null;
          if (typeof value === 'string' || typeof value === 'number') {
            return (
              <div key={key} className="generic-field">
                {value}
              </div>
            );
          }
          if (Array.isArray(value)) {
            return (
              <div key={key} className="generic-array">
                {value.map((item, idx) => (
                  <div key={idx} className="generic-item">
                    {typeof item === 'object' ? JSON.stringify(item) : item}
                  </div>
                ))}
              </div>
            );
          }
          return null;
        })}
      </div>
    </section>
  );
};

const SectionRenderer = ({ sectionName, sectionData }) => {
  const Component = sectionComponents[sectionName];

  if (Component) {
    return <Component {...sectionData} />;
  }

  // Check if it's a custom section
  try {
    const customTemplates = JSON.parse(localStorage.getItem('customSectionTemplates') || '{}');
    if (customTemplates[sectionName]) {
      // Render as generic section
      return <GenericSection {...sectionData} />;
    }
  } catch {
    // Silently fail if localStorage access fails
  }

  console.warn(`No component found for section: ${sectionName}`);
  return null;
};

export default SectionRenderer;
