import React from "react";
import RoomCard from "./RoomCard";

const RoomList = ({ rooms }) => {
  return (
    <div>
      <h2>Manage Rooms</h2>
      <div className="room-list-container">
        {rooms.length > 0 ? (
          rooms.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))
        ) : (
          <p>No rooms available.</p>
        )}
      </div>
    </div>
  );
};

export default RoomList;