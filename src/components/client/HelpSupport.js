import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from './common/ClientNavbar';
import { 
    FaQuestionCircle, 
    FaPhone, 
    FaEnvelope, 
    FaWhatsapp,
    FaCreditCard,
    FaBed,
    FaCalendarAlt,
    FaUserCog,
    FaLock,
    FaCar
} from 'react-icons/fa';
import './ClientStyles/HelpSupport.css';

const HelpSupport = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const isFromHome = new URLSearchParams(location.search).get('from') === 'home';

    const [activeCategory, setActiveCategory] = useState('booking');

    const supportCategories = {
        booking: {
            title: "Booking & Reservations",
            icon: <FaBed />,
            faqs: [
                {
                    question: "How do I make a reservation?",
                    answer: "You can make a reservation through our website by selecting your desired dates and room type, or contact our reservations team directly at +27 12 345 6789."
                },
                {
                    question: "What is your cancellation policy?",
                    answer: "Free cancellation is available up to 48 hours before check-in. Cancellations made within 48 hours of check-in may be subject to a one-night charge."
                },
                {
                    question: "Can I modify my booking?",
                    answer: "Yes, you can modify your booking through your account or by contacting our support team. Changes are subject to availability and rate differences."
                }
            ]
        },
        payment: {
            title: "Payment & Billing",
            icon: <FaCreditCard />,
            faqs: [
                {
                    question: "What payment methods do you accept?",
                    answer: "We accept all major credit cards (Visa, MasterCard, American Express), debit cards, and secure online payment methods."
                },
                {
                    question: "When will I be charged?",
                    answer: "A deposit of one night's stay is required at booking. The remaining balance will be charged upon check-in."
                },
                {
                    question: "Do you offer refunds?",
                    answer: "Refunds are processed according to our cancellation policy. Eligible refunds are typically processed within 5-7 business days."
                }
            ]
        },
        checkin: {
            title: "Check-in & Check-out",
            icon: <FaCalendarAlt />,
            faqs: [
                {
                    question: "What are the check-in/out times?",
                    answer: "Check-in time is from 2:00 PM, and check-out time is by 11:00 AM. Early check-in and late check-out can be arranged based on availability."
                },
                {
                    question: "What documents do I need for check-in?",
                    answer: "Please present a valid government-issued photo ID and the credit card used for booking during check-in."
                }
            ]
        },
        account: {
            title: "Account Management",
            icon: <FaUserCog />,
            faqs: [
                {
                    question: "How do I reset my password?",
                    answer: "Click on 'Forgot Password' on the login page and follow the instructions sent to your registered email address."
                },
                {
                    question: "How can I view my booking history?",
                    answer: "Log into your account and navigate to 'Booking History' to view all your past and upcoming reservations."
                }
            ]
        }
    };

    const contactInfo = [
        {
            icon: <FaPhone />,
            title: "Phone Support",
            detail: "+27 12 345 6789",
            subDetail: "Available 24/7"
        },
        {
            icon: <FaEnvelope />,
            title: "Email Support",
            detail: "support@domicilehotels.com",
            subDetail: "Response within 24 hours"
        },
        {
            icon: <FaWhatsapp />,
            title: "WhatsApp",
            detail: "+27 98 765 4321",
            subDetail: "Instant messaging support"
        }
    ];

    return (
        <div className="help-support-page">
            {!isFromHome && <Navbar />}
            <div className="help-support-content">
                <div className="help-header">
                    <h1>Help & Support Center</h1>
                    <p>How can we assist you today?</p>
                </div>

                <div className="contact-section">
                    <h2>Contact Us</h2>
                    <div className="contact-cards">
                        {contactInfo.map((contact, index) => (
                            <div className="contact-card" key={index}>
                                <div className="contact-icon">{contact.icon}</div>
                                <h3>{contact.title}</h3>
                                <p className="contact-detail">{contact.detail}</p>
                                <p className="contact-subdetail">{contact.subDetail}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="faq-section">
                    <h2>Frequently Asked Questions</h2>
                    <div className="category-buttons">
                        {Object.entries(supportCategories).map(([key, category]) => (
                            <button
                                key={key}
                                className={`category-button ${activeCategory === key ? 'active' : ''}`}
                                onClick={() => setActiveCategory(key)}
                            >
                                {category.icon}
                                {category.title}
                            </button>
                        ))}
                    </div>

                    <div className="faq-list">
                        {supportCategories[activeCategory].faqs.map((faq, index) => (
                            <div className="faq-item" key={index}>
                                <div className="question">
                                    <FaQuestionCircle />
                                    <h3>{faq.question}</h3>
                                </div>
                                <p className="answer">{faq.answer}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="additional-support">
                    <h2>Still Need Help?</h2>
                    <p>Our support team is always ready to assist you with any questions or concerns.</p>
                    <button className="support-button">Contact Support Team</button>
                </div>
            </div>
        </div>
    );
};

export default HelpSupport; 