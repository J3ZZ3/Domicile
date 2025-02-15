import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../../firebase/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { IoCalendar, IoPersonCircle, IoHome, IoCall, IoArrowBack, IoPeople, IoBed, IoExpand, IoEye, IoWallet, IoReload } from 'react-icons/io5';
import './ClientStyles/BookingDetail.css';

const InfoItem = ({ icon: Icon, label, value }) => (
  <div className="info-item">
    <Icon className="info-icon" />
    <div className="info-content">
      <span className="info-label">{label}</span>
      <span className="info-value">{value}</span>
    </div>
  </div>
);

const BookingDetail = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookingAndRoom = async () => {
      try {
        const bookingDoc = await getDoc(doc(db, 'bookings', bookingId));
        if (bookingDoc.exists()) {
          const bookingData = bookingDoc.data();
          
          // Fetch room details to get the image
          const roomDoc = await getDoc(doc(db, 'rooms', bookingData.roomId));
          const roomData = roomDoc.exists() ? roomDoc.data() : null;
          
          setBooking({
            id: bookingDoc.id,
            ...bookingData,
            roomImage: roomData?.images?.[0] || roomData?.image || null, // Try both image formats
            roomName: bookingData.roomName || roomData?.name || 'Room Name Not Available'
          });
        }
      } catch (error) {
        console.error('Error fetching booking:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookingAndRoom();
  }, [bookingId]);

  if (loading) {
    return (
      <div className="loading-screen">
        <IoReload className="loading-icon" />
        <p>Loading booking details...</p>
      </div>
    );
  }
  
  if (!booking) return <div className="error">Booking not found</div>;

  return (
    <div className="booking-detail-page">
      <button className="back-button" onClick={() => navigate(-1)}>
        <IoArrowBack /> Back to Bookings
      </button>

      <div className="booking-detail-container">
        <div className="room-preview">
          {booking.roomImage ? (
            <img src={booking.roomImage} alt={booking.roomName} />
          ) : (
            <div className="no-image-placeholder">No image available</div>
          )}
          <div className="status-overlay" data-status={booking.status.toLowerCase()}>
            {booking.status}
          </div>
        </div>

        <div className="booking-info-sections">
          <section className="booking-section">
            <h2>Room Information</h2>
            <div className="info-grid">
              <h3>{booking.roomName}</h3>
              <InfoItem icon={IoPeople} label="Capacity" value={`${booking.capacity} persons`} />
              <InfoItem icon={IoBed} label="Bed Type" value={booking.bedType} />
              <InfoItem icon={IoEye} label="View" value={booking.view} />
            </div>
          </section>

          <section className="booking-section">
            <h2>Booking Details</h2>
            <div className="info-grid">
              <InfoItem 
                icon={IoCalendar} 
                label="Check-in" 
                value={new Date(booking.checkInDate).toLocaleDateString()} 
              />
              <InfoItem 
                icon={IoCalendar} 
                label="Check-out" 
                value={new Date(booking.checkOutDate).toLocaleDateString()} 
              />
              <InfoItem 
                icon={IoWallet} 
                label="Total Amount" 
                value={`$${booking.totalAmount}`} 
              />
              <InfoItem 
                icon={IoWallet} 
                label="Payment Status" 
                value={booking.paymentStatus} 
              />
            </div>
          </section>

          <section className="booking-section">
            <h2>Guest Information</h2>
            <div className="info-grid">
              <InfoItem icon={IoPersonCircle} label="Full Name" value={booking.fullName} />
              <InfoItem icon={IoHome} label="Email" value={booking.email} />
              <InfoItem icon={IoHome} label="Address" value={booking.address} />
              <InfoItem icon={IoCall} label="Contact" value={booking.contactNumber} />
            </div>
          </section>

          {booking.specialRequests && (
            <section className="booking-section">
              <h2>Special Requests</h2>
              <p className="special-requests">{booking.specialRequests}</p>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingDetail; 