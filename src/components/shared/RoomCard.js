import React from 'react';

const RoomCard = ({ room }) => {
  return (
    <div>
      <h3>{room.type}</h3>
      <p>Price: {room.price}</p>
      <p>{room.description}</p>
    </div>
  );
};

export default RoomCard;