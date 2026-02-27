import React from 'react';
import './About.css';

const About = ({ title, content, imageUrl }) => {
  return (
    <section className="about">
      <div className="about-container">
        {imageUrl && (
          <div className="about-image">
            <img src={imageUrl} alt="About us" />
          </div>
        )}
        <div className="about-content">
          <h2>{title || 'About Us'}</h2>
          <p>{content || 'This is the default about section content.'}</p>
        </div>
      </div>
    </section>
  );
};

export default About;
