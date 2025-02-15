import React from 'react';
import '../AdminStyles/BookingCard.css';
import defaultImage from '../../assets/default.png';

const BookingCard = ({ booking }) => {
  const backgroundStyle = {
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url("${booking.roomImage || defaultImage}")`,
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  };

  return (
    <div 
      className="booking-card"
      style={backgroundStyle}
    >
      <div className="booking-card-header">
        <span className={`status-badge ${booking.status.toLowerCase()}`}>
          {booking.status}
        </span>
        <span className={`payment-badge ${booking.paymentStatus.toLowerCase()}`}>
          {booking.paymentStatus}
        </span>
      </div>
      <div className="booking-card-content">
        <h3 className="room-name">{booking.roomName}</h3>
      </div>
    </div>
  );
};

export default BookingCard; 