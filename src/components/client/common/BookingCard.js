import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoCalendar, IoChevronForward, IoHome } from 'react-icons/io5';
import '../ClientStyles/BookingCard.css';

const BookingCard = ({ booking }) => {
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);

  return (
    <div 
      className="booking-card" 
      onClick={() => navigate(`/booking-detail/${booking.id}`)}
      style={{
        backgroundImage: !imageError && booking.roomImage ? `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.7)), url(${booking.roomImage})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative'
      }}
    >
      {imageError && (
        <div className="image-placeholder">
          <IoHome />
        </div>
      )}
      <div className="booking-card-content">
        <h3>{booking.roomName || 'Room Name Not Available'}</h3>
        <div className="booking-dates">
          <IoCalendar />
          <span>
            {booking.checkInDate} - {booking.checkOutDate}
          </span>
        </div>
        <div className="booking-status-badge" data-status={booking.status.toLowerCase()}>
          {booking.status}
        </div>
      </div>
      <IoChevronForward className="view-details-icon" />
    </div>
  );
};

export default BookingCard; 