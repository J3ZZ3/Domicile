import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../../firebase/firebaseConfig';
import { doc, getDoc, addDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { IoCalendar, IoPersonCircle, IoHome, IoCall, IoArrowBack, IoPeople, IoBed, IoEye, IoWallet, IoReload } from 'react-icons/io5';
import './ClientStyles/BookingDetail.css';
import RatingForm from './common/RatingForm';
import Swal from 'sweetalert2';
import Footer from '../common/Footer';
import Navbar from './common/ClientNavbar';
import { useAuth } from '../../context/AuthContext';

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
  const { currentUser } = useAuth();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showRatingForm, setShowRatingForm] = useState(false);
  const [hasRated, setHasRated] = useState(false);
  const [existingRating, setExistingRating] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const fetchBookingAndRating = async () => {
      try {
        const bookingDoc = await getDoc(doc(db, 'bookings', bookingId));
        if (cancelled) return;

        if (bookingDoc.exists()) {
          const bookingData = bookingDoc.data();

          if (bookingData.userId !== currentUser?.uid) {
            navigate('/booking-history');
            return;
          }

          let finalBookingData = {
            id: bookingDoc.id,
            ...bookingData,
            roomImage: bookingData.roomImage
          };

          if (!finalBookingData.roomImage) {
            const roomDoc = await getDoc(doc(db, 'rooms', bookingData.roomId));
            if (!cancelled && roomDoc.exists()) {
              const roomData = roomDoc.data();
              finalBookingData.roomImage = roomData.images?.[0] || roomData.imageUrl || null;
            }
          }

          const ratingsQuery = query(
            collection(db, 'ratings'),
            where('bookingId', '==', bookingId)
          );
          const ratingsSnapshot = await getDocs(ratingsQuery);
          if (!cancelled && !ratingsSnapshot.empty) {
            setHasRated(true);
            setExistingRating(ratingsSnapshot.docs[0].data());
          }

          if (!cancelled) setBooking(finalBookingData);
        }
      } catch (error) {
        console.error('Error fetching booking:', error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchBookingAndRating();
    return () => { cancelled = true; };
  }, [bookingId, currentUser, navigate]);

  const handleRatingSubmit = async ({ rating, feedback }) => {
    try {
      await addDoc(collection(db, 'ratings'), {
        bookingId,
        roomId: booking.roomId,
        userId: currentUser.uid,
        rating,
        feedback,
        createdAt: new Date().toISOString(),
      });

      Swal.fire({ icon: 'success', title: 'Thank You!', text: 'Your rating has been submitted.' });
      setHasRated(true);
      setShowRatingForm(false);
      setExistingRating({ rating, feedback });
    } catch (error) {
      console.error('Error submitting rating:', error);
      Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to submit rating.' });
    }
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <IoReload className="loading-icon" />
        <p>Loading booking details...</p>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="booking-detail-container">
        <Navbar />
        <div className="booking-detail-content">
          <div className="error">
            <p>Booking not found</p>
            <button onClick={() => navigate('/booking-history')} className="back-button">
              <IoArrowBack /> Back to Bookings
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="booking-detail-container">
      <Navbar />
      <div className="booking-detail-content">
        <div className="booking-detail-page">
          <button className="back-button" onClick={() => navigate(-1)}>
            <IoArrowBack /> Back to Bookings
          </button>

          <div className="booking-detail-container">
            <div className="room-preview">
              {booking.roomImage ? (
                <img src={booking.roomImage} alt={booking.roomName} loading="lazy" />
              ) : (
                <div className="no-image-placeholder">No image available</div>
              )}
              <div className="status-overlay" data-status={booking.status?.toLowerCase()}>
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
                  <InfoItem icon={IoCalendar} label="Check-in" value={new Date(booking.checkInDate).toLocaleDateString()} />
                  <InfoItem icon={IoCalendar} label="Check-out" value={new Date(booking.checkOutDate).toLocaleDateString()} />
                  <InfoItem icon={IoWallet} label="Total Amount" value={`$${booking.totalAmount}`} />
                  <InfoItem icon={IoWallet} label="Payment Status" value={booking.paymentStatus} />
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

            {booking?.status?.toLowerCase() === 'completed' && (
              <div className="rating-section">
                {hasRated ? (
                  <div className="existing-rating">
                    <h3>Your Rating</h3>
                    <RatingForm initialRating={existingRating?.rating || 0} readonly={true} showFeedback={false} />
                    {existingRating?.feedback && <p className="feedback-text">{existingRating.feedback}</p>}
                  </div>
                ) : (
                  <>
                    {showRatingForm ? (
                      <div className="rating-form-wrapper">
                        <h3>Rate Your Stay</h3>
                        <RatingForm onSubmit={handleRatingSubmit} />
                        <button className="cancel-rating-button" onClick={() => setShowRatingForm(false)}>Cancel</button>
                      </div>
                    ) : (
                      <button className="rate-stay-button" onClick={() => setShowRatingForm(true)}>Rate Your Stay</button>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BookingDetail;
