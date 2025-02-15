import React from 'react';
import './AdminStyles/RoomCard.css';

const RoomCard = ({ room, onClick }) => {
  const getAvailabilityStatus = (room) => {
    const availableBookings = room.maxBookings - room.currentBookings;
    
    if (room.status === "Maintenance") {
      return {
        text: "Under Maintenance",
        class: "maintenance"
      };
    }
    
    if (availableBookings <= 0) {
      return {
        text: "Fully Booked",
        class: "unavailable"
      };
    }
    
    return {
      text: `${availableBookings} Bookings Available`,
      class: "available"
    };
  };

  const status = getAvailabilityStatus(room);

  return (
    <div className="admin-room-card" onClick={() => onClick(room)}>
      <div className="admin-room-image-container">
        <img 
          src={room.imageUrl} 
          alt={room.name} 
          className="admin-room-image"
        />
      </div>
      <div className="admin-room-info">
        <h3 className="admin-room-name">{room.name}</h3>
        <div className={`room-status ${status.class}`}>
          {status.text}
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
