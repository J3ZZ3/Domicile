import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from './common/ClientNavbar';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, 
         FaParking, FaWifi, FaSwimmingPool, FaConciergeBell } from 'react-icons/fa';
import hotelExterior from '../assets/hotel-front.jpg';
import lobby from '../assets/lobby.jpg';
import pool from '../assets/pool.jpg';
import 'leaflet/dist/leaflet.css';
import './ClientStyles/HotelDetails.css';
import L from 'leaflet';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const HotelDetails = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const isFromHome = new URLSearchParams(location.search).get('from') === 'home';

    const [activeImage, setActiveImage] = useState(0);

    const hotelLocation = {
        lat: -25.7479,  // Pretoria, South Africa coordinates
        lng: 28.0473,
        zoom: 15
    };

    const images = [
        { url: hotelExterior, title: "Hotel Exterior" },
        { url: lobby, title: "Grand Lobby" },
        { url: pool, title: "Infinity Pool" }
    ];

    const highlights = [
        { icon: <FaParking />, text: "Free Secure Parking" },
        { icon: <FaWifi />, text: "High-Speed WiFi" },
        { icon: <FaSwimmingPool />, text: "Rooftop Pool" },
        { icon: <FaConciergeBell />, text: "24/7 Concierge" }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setActiveImage((prevIndex) => 
                prevIndex === images.length - 1 ? 0 : prevIndex + 1
            );
        }, 5000);
        return () => clearInterval(timer);
    }, [images.length]);

    return (
        <div className="hotel-details-page">
            {!isFromHome && <Navbar />}
            <div className="hotel-content">
                <div className="hotel-info-section">
                    <h1>Welcome to Domicile Hotels</h1>
                    <p className="hotel-description">
                        Experience unparalleled luxury in the heart of Pretoria. Our five-star hotel 
                        combines elegant design, world-class amenities, and exceptional service to 
                        create unforgettable stays for our guests.
                    </p>

                    <div className="highlights-grid">
                        {highlights.map((highlight, index) => (
                            <div key={index} className="highlight-item">
                                {highlight.icon}
                                <span>{highlight.text}</span>
                            </div>
                        ))}
                    </div>

                    <div className="contact-info">
                        <div className="info-item">
                            <FaMapMarkerAlt />
                            <span>123 Luxury Avenue, Pretoria, South Africa</span>
                        </div>
                        <div className="info-item">
                            <FaPhone />
                            <span>+27 12 345 6789</span>
                        </div>
                        <div className="info-item">
                            <FaEnvelope />
                            <span>info@domicilehotels.com</span>
                        </div>
                        <div className="info-item">
                            <FaClock />
                            <span>Check-in: 2:00 PM | Check-out: 11:00 AM</span>
                        </div>
                    </div>
                </div>

                <div className="map-section">
                    <h2>Our Location</h2>
                    <MapContainer 
                        center={[hotelLocation.lat, hotelLocation.lng]} 
                        zoom={hotelLocation.zoom} 
                        scrollWheelZoom={false}
                        style={{ height: '400px', width: '100%', borderRadius: '12px' }}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={[hotelLocation.lat, hotelLocation.lng]}>
                            <Popup>
                                <b>Domicile Hotels</b><br />
                                Luxury Stays
                            </Popup>
                        </Marker>
                    </MapContainer>
                </div>
            </div>
        </div>
    );
};

export default HotelDetails; 