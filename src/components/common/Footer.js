import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  IoBedOutline, 
  IoRestaurantOutline, 
  IoWifiOutline, 
  IoCarSportOutline, 
  IoBusinessOutline,
  IoLogoFacebook,
  IoLogoInstagram,
  IoLogoTwitter,
  IoMailOutline,
  IoCallOutline,
  IoLocationOutline
} from 'react-icons/io5';
import './CommonStyles/Footer.css';

const Footer = () => {
  const navigate = useNavigate();

  const handleBookNow = () => {
    navigate('/client-login');
  };

  return (
    <footer className="footer">
      <div className="footer-main">
        <div className="footer-content">
          <div className="footer-brand-section">
            <h3>Domicile Hotels</h3>
            <div className="luxury-container">
              <div className="icon-group">
                <IoBedOutline className="footer-icon" />
                <IoRestaurantOutline className="footer-icon" />
                <IoWifiOutline className="footer-icon" />
                <IoCarSportOutline className="footer-icon" />
                <IoBusinessOutline className="footer-icon" />
              </div>
              <p>Luxury Redefined</p>
              <div className="icon-group">
                <IoBedOutline className="footer-icon" />
                <IoRestaurantOutline className="footer-icon" />
                <IoWifiOutline className="footer-icon" />
                <IoCarSportOutline className="footer-icon" />
                <IoBusinessOutline className="footer-icon" />
              </div>
            </div>
          </div>

          <div className="footer-info-container">
            <div className="footer-contact-section">
              <h3>Contact Us</h3>
              <div className="contact-items">
                <div className="contact-item">
                  <IoCallOutline className="contact-icon" />
                  <div>
                    <p>Reservations</p>
                    <a href="tel:+15551234567">+1 (555) 123-4567</a>
                  </div>
                </div>
                <div className="contact-item">
                  <IoMailOutline className="contact-icon" />
                  <div>
                    <p>Email Us</p>
                    <a href="mailto:info@domicilehotels.com">info@domicilehotels.com</a>
                  </div>
                </div>
                <div className="contact-item">
                  <IoLocationOutline className="contact-icon" />
                  <div>
                    <p>Location</p>
                    <span>123 Luxury Avenue, NY 10001</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="footer-social-section">
              <h3>Connect With Us</h3>
              <div className="social-links">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                  <IoLogoFacebook />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                  <IoLogoInstagram />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                  <IoLogoTwitter />
                </a>
              </div>
            </div>
          </div>
        </div>

        <button onClick={handleBookNow} className="footer-cta">
          Book Your Stay Now
        </button>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <p>&copy; {new Date().getFullYear()} Domicile Hotels. All rights reserved.</p>
          <div className="footer-links">
            <a href="/privacy">Privacy Policy</a>
            <span className="separator">|</span>
            <a href="/terms">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 