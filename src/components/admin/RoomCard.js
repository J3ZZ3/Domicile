import React from 'react';
import './AdminStyles/RoomCard.css';

const RoomCard = ({ room, onClick }) => {
  const availableBookings = (room.maxBookings || 0) - (room.currentBookings || 0);

  let statusText, statusClass;
  if (room.status === "Maintenance") {
    statusText = "Under Maintenance";
    statusClass = "maintenance";
  } else if (availableBookings <= 0) {
    statusText = "Fully Booked";
    statusClass = "unavailable";
  } else {
    statusText = `${availableBookings} Bookings Available`;
    statusClass = "available";
  }

  return (
    <div
      className="admin-room-card"
      onClick={() => onClick?.(room)}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => { if (onClick && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); onClick(room); } }}
    >
      <div className="admin-room-image-container">
        <img
          src={room.imageUrl || '/placeholder-room.jpg'}
          alt={room.name || 'Room'}
          className="admin-room-image"
          loading="lazy"
        />
      </div>
      <div className="admin-room-info">
        <h3 className="admin-room-name">{room.name}</h3>
        <div className={`room-status ${statusClass}`}>
          {statusText}
        </div>
      </div>
    </div>
  );
};

export default React.memo(RoomCard);
