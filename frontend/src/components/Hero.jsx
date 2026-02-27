import React from 'react';
import './Hero.css';

const Hero = ({ title, subtitle, ctaText, ctaLink, backgroundImage }) => {
  console.log('Hero props:', { title, subtitle, ctaText, ctaLink, backgroundImage });
  
  return (
    <section className="hero" style={{ backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none' }}>
      <div className="hero-content">
        <h1>{title}</h1>
        <p>{subtitle}</p>
        {ctaText && (
          <a href={ctaLink || '#'} className="cta-button">
            {ctaText}
          </a>
        )}
      </div>
    </section>
  );
};

export default Hero;
