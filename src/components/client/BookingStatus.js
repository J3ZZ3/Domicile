import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import './ClientStyles/BookingStatus.css';
import { useAuth } from '../../context/AuthContext';
import Footer from '../common/Footer';
import Navbar from './common/ClientNavbar';

const BookingStatus = () => {
  const { roomId } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    let cancelled = false;

    const fetchBookingStatus = async () => {
      try {
        const bookingDoc = await getDoc(doc(db, "bookings", roomId));
        if (cancelled) return;

        if (bookingDoc.exists()) {
          const data = bookingDoc.data();
          if (data.userId !== currentUser?.uid) {
            setError("You don't have permission to view this booking.");
          } else {
            setBooking(data);
          }
        } else {
          setError("Booking not found.");
        }
      } catch (err) {
        if (!cancelled) setError("Failed to load booking status.");
        console.error("Error fetching booking:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchBookingStatus();
    return () => { cancelled = true; };
  }, [currentUser, roomId]);

  return (
    <div className="booking-status-container">
      <Navbar />
      <div className="booking-status-content">
        {loading && <div className="loading-spinner">Loading booking status...</div>}
        {error && <p className="error-message">{error}</p>}
        {booking && (
          <>
            <h2>Booking Status for {booking.roomName}</h2>
            <p>Status: {booking.status}</p>
            {booking.status === "Paid" && <p>Your payment was successful!</p>}
            {booking.status === "Pending" && <p>Your booking is pending approval.</p>}
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default BookingStatus;
