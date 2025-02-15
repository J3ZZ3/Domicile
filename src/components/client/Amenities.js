import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from './common/ClientNavbar';
import { FaSwimmingPool, FaWifi, FaParking, FaCoffee, FaDumbbell, 
         FaConciergeBell, FaSpa, FaGlassMartini, FaShuttleVan, FaBed,
         FaSnowflake, FaWheelchair, FaBabyCarriage, FaLock, FaUmbrella,
         FaPhoneAlt } from 'react-icons/fa';
import { MdRestaurant, MdLocalLaundryService, MdMeetingRoom, 
         MdRoomService, MdPets, MdChildCare, MdLocalBar, MdPool,
         MdBusinessCenter } from 'react-icons/md';
import { GiCardExchange, GiLockers } from 'react-icons/gi';
import { BiSolidFirstAid } from 'react-icons/bi';
import './ClientStyles/Amenities.css';

const Amenities = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isFromHome = new URLSearchParams(location.search).get('from') === 'home';

  const amenitiesList = [
    {
      icon: <FaSwimmingPool />,
      title: "Infinity Pool",
      description: "Luxurious rooftop pool with panoramic city views and heated water"
    },
    {
      icon: <FaWifi />,
      title: "High-Speed WiFi",
      description: "Complimentary high-speed internet throughout the hotel premises"
    },
    {
      icon: <MdRestaurant />,
      title: "Fine Dining",
      description: "24/7 restaurant serving international cuisine and local delicacies"
    },
    {
      icon: <FaDumbbell />,
      title: "Fitness Center",
      description: "State-of-the-art gym equipment with personal trainers available"
    },
    {
      icon: <FaSpa />,
      title: "Luxury Spa",
      description: "Full-service spa offering massage, facial, and wellness treatments"
    },
    {
      icon: <FaParking />,
      title: "Valet Parking",
      description: "Secure underground parking with 24/7 valet service"
    },
    {
      icon: <MdMeetingRoom />,
      title: "Conference Facilities",
      description: "Modern meeting spaces with latest AV equipment"
    },
    {
      icon: <FaCoffee />,
      title: "Coffee Shop",
      description: "Artisanal coffee, fresh pastries, and light snacks"
    },
    {
      icon: <MdLocalLaundryService />,
      title: "Laundry Service",
      description: "Same-day laundry, dry cleaning, and pressing services"
    },
    {
      icon: <FaConciergeBell />,
      title: "Concierge",
      description: "24/7 concierge service for reservations and arrangements"
    },
    {
      icon: <MdRoomService />,
      title: "Room Service",
      description: "24-hour in-room dining with extensive menu options"
    },
    {
      icon: <FaGlassMartini />,
      title: "Rooftop Bar",
      description: "Exclusive bar featuring craft cocktails and stunning views"
    },
    {
      icon: <FaShuttleVan />,
      title: "Airport Shuttle",
      description: "Complimentary airport pickup and drop-off service"
    },
    {
      icon: <MdPets />,
      title: "Pet Friendly",
      description: "Welcome amenities and services for your furry friends"
    },
    {
      icon: <FaBed />,
      title: "Turndown Service",
      description: "Evening turndown service with premium chocolates"
    },
    {
      icon: <MdChildCare />,
      title: "Childcare Services",
      description: "Professional babysitting and children's activities"
    },
    {
      icon: <FaSnowflake />,
      title: "Climate Control",
      description: "Individual climate control in all rooms"
    },
    {
      icon: <MdLocalBar />,
      title: "Mini Bar",
      description: "In-room mini bar with premium selections"
    },
    {
      icon: <GiCardExchange />,
      title: "Currency Exchange",
      description: "Foreign currency exchange service available"
    },
    {
      icon: <MdBusinessCenter />,
      title: "Business Center",
      description: "24/7 business center with printing services"
    },
    {
      icon: <FaWheelchair />,
      title: "Accessibility",
      description: "Wheelchair accessible rooms and facilities"
    },
    {
      icon: <BiSolidFirstAid />,
      title: "Medical Services",
      description: "24/7 on-call medical assistance"
    },
    {
      icon: <FaBabyCarriage />,
      title: "Baby Amenities",
      description: "Cribs, high chairs, and baby care items available"
    },
    {
      icon: <GiLockers />,
      title: "Safety Deposit",
      description: "In-room safes and central safety deposit boxes"
    }
  ];

  return (
    <div className="amenities-page">
      {!isFromHome && <Navbar />}
      <div className="amenities-content">
        <div className="amenities-header">
          <h1>Luxury Amenities</h1>
          <p>Experience unparalleled comfort and convenience at Domicile Hotels</p>
        </div>
        <div className="amenities-grid">
          {amenitiesList.map((amenity, index) => (
            <div className="amenity-card" key={index}>
              <div className="amenity-icon">{amenity.icon}</div>
              <h3>{amenity.title}</h3>
              <p>{amenity.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Amenities; 