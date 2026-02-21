import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoCalendar, IoChevronForward, IoHome } from 'react-icons/io5';
import '../ClientStyles/BookingCard.css';

const BookingCard = ({ booking }) => {
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);
  const roomImage = booking.roomImage || null;

  return (
    <div
      className="booking-card"
      onClick={() => navigate(`/booking-detail/${booking.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigate(`/booking-detail/${booking.id}`); } }}
      style={{
        backgroundImage: !imageError && roomImage
          ? `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.7)), url(${roomImage})`
          : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative'
      }}
    >
      {roomImage && (
        <img src={roomImage} alt="" style={{ display: 'none' }} onError={() => setImageError(true)} />
      )}

      {(!roomImage || imageError) && (
        <div className="image-placeholder">
          <IoHome />
        </div>
      )}

      <div className="booking-card-content">
        <h3>{booking.roomName || 'Room Name Not Available'}</h3>
        <div className="booking-dates">
          <IoCalendar />
          <span>{booking.checkInDate} - {booking.checkOutDate}</span>
        </div>
        <div className="booking-status-badge" data-status={booking.status?.toLowerCase()}>
          {booking.status}
        </div>
      </div>
      <IoChevronForward className="view-details-icon" />
    </div>
  );
};

export default React.memo(BookingCard);
