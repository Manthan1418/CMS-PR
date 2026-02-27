import React from 'react';
import './Contact.css';

const Contact = ({ title, description, email, phone, address }) => {
  return (
    <section className="contact">
      <div className="contact-container">
        <div className="contact-content">
          <h2>{title || 'Contact Us'}</h2>
          <p>{description || 'Get in touch with us for any questions or inquiries.'}</p>
          
          <div className="contact-info">
            {email && (
              <div className="contact-item">
                <span className="contact-label">Email:</span>
                <a href={`mailto:${email}`}>{email}</a>
              </div>
            )}
            {phone && (
              <div className="contact-item">
                <span className="contact-label">Phone:</span>
                <a href={`tel:${phone}`}>{phone}</a>
              </div>
            )}
            {address && (
              <div className="contact-item">
                <span className="contact-label">Address:</span>
                <span>{address}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
