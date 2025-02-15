import React, { useState, useEffect, useCallback } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import AdminNavbar from "./AdminNavbar";
import BookingCard from "./components/BookingCard";
import Swal from "sweetalert2";
import "./AdminStyles/CustomerBookings.css";

const CustomerBookings = () => {
  const [bookings, setBookings] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const fetchBookings = useCallback(async () => {
    try {
      const bookingsQuery = query(
        collection(db, "bookings"),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(bookingsQuery);
      const bookingsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      const groupedBookings = groupBookingsByMonth(bookingsList);
      setBookings(groupedBookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch bookings",
        confirmButtonColor: '#c0392b',
        background: '#1a1a1a',
        color: '#ffffff'
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const groupBookingsByMonth = (bookingsList) => {
    return bookingsList.reduce((groups, booking) => {
      const date = new Date(booking.checkInDate);
      const monthYear = date.toLocaleString('default', { month: 'long', year: 'numeric' });
      
      if (!groups[monthYear]) {
        groups[monthYear] = [];
      }
      groups[monthYear].push(booking);
      return groups;
    }, {});
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="customer-bookings-page">
      <AdminNavbar />
      <div className="customer-bookings-container">
        <h1>Customer Bookings</h1>
        
        {Object.keys(bookings).length === 0 ? (
          <p className="no-bookings">No bookings found</p>
        ) : (
          Object.entries(bookings).map(([monthYear, monthBookings]) => (
            <div key={monthYear} className="month-group">
              <h2 className="month-header">{monthYear}</h2>
              <div className="bookings-grid">
                {monthBookings.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CustomerBookings;
