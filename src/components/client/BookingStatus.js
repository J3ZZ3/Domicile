import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../../firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import './ClientStyles/BookingStatus.css';
import { useAuth } from '../../context/AuthContext'; // Import the Auth context

const BookingStatus = () => {
  const { roomId } = useParams();
  const [booking, setBooking] = useState(null);
  const navigate = useNavigate(); // Get navigate function from react-router-dom
  const { currentUser } = useAuth(); // Get current user from context

  useEffect(() => {
    if (!currentUser) {
      navigate("/client-login"); // Redirect if not logged in
    }
    const fetchBookingStatus = async () => {
      const bookingDoc = await getDoc(doc(db, "bookings", roomId));
      if (bookingDoc.exists()) {
        setBooking(bookingDoc.data());
      }
    };

    fetchBookingStatus();
  }, [currentUser, navigate, roomId]);

  if (!booking) return <p>Loading booking status...</p>;

  return (
    <div>
      <h2>Booking Status for {booking.roomName}</h2>
      <p>Status: {booking.status}</p>
      {booking.status === "Paid" && <p>Your payment was successful!</p>}
      {booking.status === "Pending" && <p>Your booking is pending approval.</p>}
    </div>
  );
};

export default BookingStatus;
