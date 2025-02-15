import React, { useEffect, useState } from "react";
import { db } from "../../firebase/firebaseConfig";
import { collection, getDocs, query, where, addDoc, doc, updateDoc, getDoc } from "firebase/firestore"; // Import addDoc, doc, and updateDoc
import Swal from "sweetalert2";
import "./ClientStyles/BookingHistory.css";
import { Navigate } from "react-router-dom";
import Navbar from './common/ClientNavbar';
import { useAuth } from '../../context/AuthContext'; // Import the Auth context
import BookingCard from './common/BookingCard';
import './ClientStyles/BookingCard.css';

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [rating, setRating] = useState({});
  const { currentUser } = useAuth(); // Get current user from context

  useEffect(() => {
    if (!currentUser) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "You need to be logged in to view your booking history.",
        confirmButtonText: "OK",
      });
      Navigate("/client-login");
      return;
    }

    const fetchBookings = async () => {
      try {
        const q = query(
          collection(db, "bookings"),
          where("userId", "==", currentUser.uid)
        );
        const querySnapshot = await getDocs(q);

        const bookingsPromises = querySnapshot.docs.map(async (bookingDoc) => {
          const bookingData = bookingDoc.data();
          
          // Fetch room details to get the image
          try {
            const roomDoc = await getDoc(doc(db, "rooms", bookingData.roomId));
            const roomData = roomDoc.exists() ? roomDoc.data() : null;
            
            return {
              id: bookingDoc.id,
              ...bookingData,
              roomImage: roomData?.images?.[0] || roomData?.image || null, // Try both image formats
              formattedCheckIn: new Date(bookingData.checkInDate).toLocaleDateString(),
              formattedCheckOut: new Date(bookingData.checkOutDate).toLocaleDateString(),
              roomName: bookingData.roomName || roomData?.name || 'Room Name Not Available'
            };
          } catch (error) {
            console.error("Error fetching room data:", error);
            return {
              id: bookingDoc.id,
              ...bookingData,
              roomImage: null,
              formattedCheckIn: new Date(bookingData.checkInDate).toLocaleDateString(),
              formattedCheckOut: new Date(bookingData.checkOutDate).toLocaleDateString(),
              roomName: bookingData.roomName || 'Room Name Not Available'
            };
          }
        });

        const userBookings = await Promise.all(bookingsPromises);
        userBookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        setBookings(userBookings);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching bookings: ", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "There was an issue fetching your booking history.",
        });
      }
    };

    fetchBookings();
  }, [currentUser]);

  const handleRatingClick = (bookingId, rate) => {
    setRating((prevRating) => ({
      ...prevRating,
      [bookingId]: rate,
    }));
  };

  const submitRating = async (bookingId, roomId) => {
    const userRating = rating[bookingId];

    if (!userRating || userRating < 1 || userRating > 5) {
      Swal.fire({
        icon: "error",
        title: "Invalid Rating",
        text: "Please select a rating between 1 and 5.",
      });
      return;
    }

    try {
      // Save the rating
      await addDoc(collection(db, "ratings"), {
        userId: currentUser.uid,
        roomId: roomId,
        bookingId: bookingId,
        rating: userRating,
        timestamp: new Date(),
      });

      // Update the room's average rating
      const ratingsQuery = query(collection(db, "ratings"), where("roomId", "==", roomId));
      const ratingsSnapshot = await getDocs(ratingsQuery);
      
      let totalRating = 0;
      let numberOfRatings = 0;
      
      ratingsSnapshot.forEach((doc) => {
        totalRating += doc.data().rating;
        numberOfRatings++;
      });

      const averageRating = totalRating / numberOfRatings;

      // Update room document with new average rating
      const roomRef = doc(db, "rooms", roomId);
      await updateDoc(roomRef, {
        averageRating: averageRating,
        numberOfRatings: numberOfRatings
      });

      Swal.fire({
        icon: "success",
        title: "Thank you!",
        text: "Your rating has been submitted.",
      });
    } catch (error) {
      console.error("Error submitting rating: ", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to submit rating. Please try again.",
      });
    }
  };

  const filterBookings = () => {
    if (activeTab === 'all') return bookings;
    return bookings.filter(booking => booking.status.toLowerCase() === activeTab);
  };

  const getTabCount = (status) => {
    if (status === 'all') return bookings.length;
    return bookings.filter(booking => booking.status.toLowerCase() === status).length;
  };

  const groupBookingsByDate = (bookings) => {
    const groups = {};
    
    bookings.forEach(booking => {
      // Make sure we have a valid date
      const date = booking.createdAt ? 
        (booking.createdAt instanceof Date ? 
          booking.createdAt : 
          new Date(booking.createdAt.seconds ? booking.createdAt.seconds * 1000 : booking.createdAt)
        ) : new Date();

      // Format the month and year
      const monthYear = date.toLocaleString('default', { 
        month: 'long',
        year: 'numeric'
      });
      
      if (!groups[monthYear]) {
        groups[monthYear] = [];
      }
      groups[monthYear].push(booking);
    });

    // Sort the groups by date (most recent first)
    const sortedGroups = {};
    Object.keys(groups)
      .sort((a, b) => {
        const dateA = new Date(a);
        const dateB = new Date(b);
        return dateB - dateA;
      })
      .forEach(key => {
        sortedGroups[key] = groups[key];
      });

    return sortedGroups;
  };

  const refreshBookings = async () => {
    setLoading(true);
    try {
      const q = query(
        collection(db, "bookings"),
        where("userId", "==", currentUser.uid)
      );
      const querySnapshot = await getDocs(q);

      const userBookings = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      userBookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setBookings(userBookings);
    } catch (error) {
      console.error("Error refreshing bookings: ", error);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="booking-history-container">
        <Navbar />
        <div className="booking-history-content">
          <div className="loading-spinner">Loading booking history...</div>
        </div>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="booking-history-container">
        <Navbar />
        <div className="booking-history-content">
          <div className="no-bookings-message">
            You have no bookings in your history.
          </div>
        </div>
      </div>
    );
  }

  const groupedBookings = groupBookingsByDate(filterBookings());

  return (
    <div className="booking-history-container">
      <Navbar />
      <div className="booking-history-content">
        <h2>Your Booking History</h2>
        
        <div className="booking-tabs">
          <button 
            className={`tab-button ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All ({getTabCount('all')})
          </button>
          <button 
            className={`tab-button ${activeTab === 'pending approval' ? 'active' : ''}`}
            onClick={() => setActiveTab('pending approval')}
          >
            Pending ({getTabCount('pending approval')})
          </button>
          <button 
            className={`tab-button ${activeTab === 'approved' ? 'active' : ''}`}
            onClick={() => setActiveTab('approved')}
          >
            Approved ({getTabCount('approved')})
          </button>
          <button 
            className={`tab-button ${activeTab === 'completed' ? 'active' : ''}`}
            onClick={() => setActiveTab('completed')}
          >
            Completed ({getTabCount('completed')})
          </button>
          <button 
            className={`tab-button ${activeTab === 'cancelled' ? 'active' : ''}`}
            onClick={() => setActiveTab('cancelled')}
          >
            Cancelled ({getTabCount('cancelled')})
          </button>
        </div>

        <div className="booking-list">
          {Object.entries(groupedBookings).map(([monthYear, monthBookings]) => (
            <div key={monthYear} className="booking-month-group">
              <h3 className="month-year-header">{monthYear}</h3>
              <div className="booking-cards-grid">
                {monthBookings.map((booking) => (
                  <BookingCard 
                    key={booking.id} 
                    booking={{
                      ...booking,
                      roomName: booking.roomName,
                      checkInDate: booking.formattedCheckIn,
                      checkOutDate: booking.formattedCheckOut,
                      status: booking.status,
                      totalAmount: booking.totalAmount,
                      roomImage: booking.roomImage
                    }}
                    onBookingUpdate={refreshBookings}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookingHistory;