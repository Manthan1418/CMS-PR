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

          // Render image fields
          if (typeof value === 'string' && (value.match(/\.(jpg|jpeg|png|gif|svg|webp)$/i) || value.startsWith('data:image'))) {
            return (
              <div key={key} className="generic-field generic-image">
                <img src={value} alt={key} />
              </div>
            );
          }

          // Render rich text / HTML content
          if (typeof value === 'string' && value.includes('<')) {
            return (
              <div key={key} className="generic-field generic-richtext" dangerouslySetInnerHTML={{ __html: value }} />
            );
          }

          if (typeof value === 'string' || typeof value === 'number') {
            return (
              <div key={key} className="generic-field">
                {value}
              </div>
            );
          }
          if (Array.isArray(value)) {
            return (
              <ul key={key} className="generic-list">
                {value.map((item, idx) => (
                  <li key={idx} className="generic-list-item">
                    {typeof item === 'object' ? JSON.stringify(item) : item}
                  </li>
                ))}
              </ul>
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

  // Render any non-built-in section as a generic section
  if (sectionData) {
    return <GenericSection {...sectionData} />;
  }

  console.warn(`No component found for section: ${sectionName}`);
  return null;
};

export default SectionRenderer;
