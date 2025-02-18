import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoCalendar, IoChevronForward, IoHome } from 'react-icons/io5';
import '../ClientStyles/BookingCard.css';
import { db } from '../../../firebase/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

const BookingCard = ({ booking }) => {
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);
  const [roomImage, setRoomImage] = useState(booking.roomImage || null);

  useEffect(() => {
    const fetchRoomImage = async () => {
      if (!roomImage && booking.roomId) {
        try {
          const roomDoc = await getDoc(doc(db, 'rooms', booking.roomId));
          if (roomDoc.exists()) {
            const roomData = roomDoc.data();
            const image = roomData.images?.[0] || roomData.imageUrl;
            if (image) {
              setRoomImage(image);
            }
          }
        } catch (error) {
          console.error('Error fetching room image:', error);
          setImageError(true);
        }
      }
    };

    fetchRoomImage();
  }, [booking.roomId, roomImage]);

  const handleImageError = () => {
    setImageError(true);
    setRoomImage(null);
  };

  return (
    <div 
      className="booking-card" 
      onClick={() => navigate(`/booking-detail/${booking.id}`)}
      style={{
        backgroundImage: !imageError && roomImage ? 
          `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.7)), url(${roomImage})` : 
          'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative'
      }}
    >
      {/* Hidden image element to detect loading errors */}
      {roomImage && (
        <img 
          src={roomImage}
          alt=""
          style={{ display: 'none' }}
          onError={handleImageError}
        />
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