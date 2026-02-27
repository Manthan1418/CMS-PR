import React from 'react';
import './Services.css';

const Services = ({ title, services = [] }) => {
  const defaultServices = [
    {
      icon: '🚀',
      title: 'Fast Performance',
      description: 'Lightning fast load times for the best user experience.'
    },
    {
      icon: '🔒',
      title: 'Secure & Reliable',
      description: 'Your data is safe with enterprise-grade security.'
    },
    {
      icon: '💡',
      title: 'Easy to Use',
      description: 'Intuitive interface designed for everyone.'
    }
  ];

  const displayServices = services.length > 0 ? services : defaultServices;

  return (
    <section className="services">
      <div className="services-container">
        <h2>{title || 'Our Services'}</h2>
        <div className="services-grid">
          {displayServices.map((service, index) => (
            <div key={index} className="service-card">
              <div className="service-icon">{service.icon}</div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
