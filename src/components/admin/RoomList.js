import React from "react";
import { Link } from "react-router-dom";

const RoomList = ({ rooms }) => {
  return (
    <div className="room-list">
      {rooms.length === 0 ? (
        <p>No rooms available</p>
      ) : (
        <ul>
          {rooms.map((room) => (
            <li key={room.id}>
              <h3>{room.name}</h3>
              {room.imageUrl && <img src={room.imageUrl} alt={room.name} width={300} />}
              <p>{room.description}</p>
              <p>Amenities: {room.amenities}</p>
              <p>Price: ${room.price}</p>
              <p>Status: {room.isBooked ? "Booked" : "Available"}</p>
              {!room.isBooked && (
                <Link to={`/book-room/${room.id}`} state={{ room }}>
                  <button>Book Now</button>
                </Link>
              )}
              {room.isBooked && <p>This room is currently booked.</p>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RoomList;
