import React from 'react';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Contact Us</h3>
          <p>Email: info@digitalmonk.com</p>
          <p>Phone: +1 (555) 123-4567</p>
          <p>Address: 123 Tech Street, San Francisco, CA 94105</p>
        </div>
        <div className="footer-section">
          <h3>Follow Us</h3>
          <div className="social-links">
            <a href="https://twitter.com/digitalmonk" target="_blank" rel="noopener noreferrer">Twitter</a>
            <a href="https://facebook.com/digitalmonk" target="_blank" rel="noopener noreferrer">Facebook</a>
            <a href="https://linkedin.com/company/digitalmonk" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {currentYear} Digital Monk. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;