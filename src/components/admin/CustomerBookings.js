import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/firebaseConfig';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';
import './AdminStyles/CustomerBookings.css';
import Swal from 'sweetalert2';

const CustomerBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchBookings = async () => {
      if (!currentUser?.uid) {
        setError('No user profile found');
        setLoading(false);
        return;
      }

      try {
        const q = query(
          collection(db, 'bookings'),
          where('userId', '==', currentUser.uid),
          orderBy('createdAt', 'desc')
        );
        
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          setBookings([]);
          setLoading(false);
          return;
        }

        const bookingsData = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            checkInDate: data.checkInDate ? new Date(data.checkInDate).toLocaleDateString() : 'N/A',
            checkOutDate: data.checkOutDate ? new Date(data.checkOutDate).toLocaleDateString() : 'N/A',
            totalAmount: data.totalAmount ? parseFloat(data.totalAmount).toFixed(2) : '0.00',
            status: data.status || 'Pending',
            paymentStatus: data.paymentStatus || 'Pending'
          };
        });

        setBookings(bookingsData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setError('Failed to fetch bookings');
        setLoading(false);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to fetch bookings. Please try again later.',
        });
      }
    };

    fetchBookings();
  }, [currentUser]);

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>Loading your bookings...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error">
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className="retry-button">
          Retry
        </button>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="no-bookings">
        <h2>No Bookings Found</h2>
        <p>You haven't made any bookings yet.</p>
      </div>
    );
  }

  return (
    <div className="customer-bookings">
      <h2>Your Bookings</h2>
      <div className="bookings-grid">
        {bookings.map(booking => (
          <div key={booking.id} className="booking-card">
            <div className="booking-header">
              <h3>{booking.roomName || 'Room'}</h3>
              <span className={`status ${booking.status.toLowerCase()}`}>
                {booking.status}
              </span>
            </div>
            <div className="booking-details">
              <p>
                <strong>Check-in:</strong> {booking.checkInDate}
              </p>
              <p>
                <strong>Check-out:</strong> {booking.checkOutDate}
              </p>
              <p>
                <strong>Total Amount:</strong> ${booking.totalAmount}
              </p>
              <p>
                <strong>Payment Status:</strong> {booking.paymentStatus}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerBookings;
