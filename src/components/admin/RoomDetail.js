import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';
import Swal from 'sweetalert2';
import './AdminStyles/RoomDetail.css';

const RoomDetail = ({ room, onClose }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape' && onClose) onClose(); };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!room) return null;

  const handleEdit = () => navigate(`/update-room/${room.id}`);

  const handleDelete = async () => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#c0392b',
        cancelButtonColor: '#666',
        confirmButtonText: 'Yes, delete it!',
      });

      if (result.isConfirmed) {
        await deleteDoc(doc(db, 'rooms', room.id));
        await Swal.fire({ title: 'Deleted!', text: 'The room has been deleted.', icon: 'success', confirmButtonColor: '#c0392b' });
        if (onClose) onClose();
        navigate('/admin-dashboard');
      }
    } catch (error) {
      console.error("Error deleting room:", error);
      Swal.fire({ title: 'Error!', text: 'Failed to delete the room.', icon: 'error', confirmButtonColor: '#c0392b' });
    }
  };

  const amenitiesList = room.amenities
    ? (Array.isArray(room.amenities) ? room.amenities : [room.amenities])
    : [];

  return (
    <div className="room-detail-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="Room details">
      <div className="room-detail-content" onClick={e => e.stopPropagation()}>
        <button className="close-button" onClick={onClose} aria-label="Close">&times;</button>

        <div className="room-detail-image-container">
          <img src={room.imageUrl || '/placeholder-room.jpg'} alt={room.name || 'Room'} className="room-detail-image" loading="lazy" />
        </div>

        <div className="room-detail-info">
          <h2>{room.name || 'Unnamed Room'}</h2>

          <div className="detail-section">
            <h3>Room Details</h3>
            <p><strong>Type:</strong> {room.type || 'N/A'}</p>
            <p><strong>Price:</strong> ${room.price || 'N/A'} per night</p>
            <p><strong>Capacity:</strong> {room.capacity || 'N/A'} persons</p>
            <p><strong>Status:</strong> <span className={`status ${(room.status || '').toLowerCase()}`}>{room.status || 'N/A'}</span></p>
          </div>

          <div className="detail-section">
            <h3>Amenities</h3>
            <div className="amenities-list">
              {amenitiesList.length > 0
                ? amenitiesList.map((amenity, index) => <span key={amenity || index} className="amenity-tag">{amenity}</span>)
                : <span className="amenity-tag">No amenities listed</span>
              }
            </div>
          </div>

          <div className="detail-section">
            <h3>Description</h3>
            <p>{room.description || 'No description available'}</p>
          </div>

          <div className="room-detail-actions">
            <button className="delete-button" onClick={handleDelete}>Delete Room</button>
            <button className="edit-button" onClick={handleEdit}>Edit Room</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetail;
