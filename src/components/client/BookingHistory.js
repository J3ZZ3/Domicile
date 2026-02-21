import React, { useEffect, useState, useCallback } from "react";
import { db } from "../../firebase/firebaseConfig";
import { collection, query, where, orderBy, limit, startAfter, getDocs, doc, getDoc } from "firebase/firestore";
import "./ClientStyles/BookingHistory.css";
import { useNavigate } from "react-router-dom";
import Navbar from './common/ClientNavbar';
import { useAuth } from '../../context/AuthContext';
import BookingCard from './common/BookingCard';
import './ClientStyles/BookingCard.css';
import Footer from '../common/Footer';

const BOOKINGS_PER_PAGE = 15;

const roomImageCache = new Map();

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [lastDoc, setLastDoc] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const enrichBookingsWithRooms = useCallback(async (bookingDocs) => {
    const roomIds = [...new Set(bookingDocs.map(b => b.roomId).filter(Boolean))];
    const uncachedIds = roomIds.filter(id => !roomImageCache.has(id));

    if (uncachedIds.length > 0) {
      await Promise.all(
        uncachedIds.map(async (roomId) => {
          try {
            const roomDoc = await getDoc(doc(db, "rooms", roomId));
            roomImageCache.set(roomId, roomDoc.exists() ? roomDoc.data() : null);
          } catch {
            roomImageCache.set(roomId, null);
          }
        })
      );
    }

    return bookingDocs.map(booking => {
      const roomData = roomImageCache.get(booking.roomId);
      return {
        ...booking,
        roomImage: roomData?.images?.[0] || roomData?.imageUrl || null,
        formattedCheckIn: new Date(booking.checkInDate).toLocaleDateString(),
        formattedCheckOut: new Date(booking.checkOutDate).toLocaleDateString(),
        roomName: booking.roomName || roomData?.name || 'Room Name Not Available'
      };
    });
  }, []);

  const fetchBookings = useCallback(async (afterDoc = null) => {
    if (!currentUser) {
      navigate("/client-login");
      return;
    }

    if (afterDoc) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }

    try {
      let q = query(
        collection(db, "bookings"),
        where("userId", "==", currentUser.uid),
        orderBy("createdAt", "desc"),
        limit(BOOKINGS_PER_PAGE)
      );

      if (afterDoc) {
        q = query(
          collection(db, "bookings"),
          where("userId", "==", currentUser.uid),
          orderBy("createdAt", "desc"),
          startAfter(afterDoc),
          limit(BOOKINGS_PER_PAGE)
        );
      }

      const snapshot = await getDocs(q);
      const newDocs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      const enriched = await enrichBookingsWithRooms(newDocs);

      if (afterDoc) {
        setBookings(prev => [...prev, ...enriched]);
      } else {
        setBookings(enriched);
      }

      setLastDoc(snapshot.docs[snapshot.docs.length - 1] || null);
      setHasMore(snapshot.docs.length === BOOKINGS_PER_PAGE);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [currentUser, navigate, enrichBookingsWithRooms]);

  useEffect(() => {
    let cancelled = false;
    fetchBookings().then(() => { if (cancelled) return; });
    return () => { cancelled = true; };
  }, [fetchBookings]);

  const handleLoadMore = useCallback(() => {
    if (lastDoc && hasMore && !loadingMore) {
      fetchBookings(lastDoc);
    }
  }, [lastDoc, hasMore, loadingMore, fetchBookings]);

  const filterBookings = () => {
    if (activeTab === 'all') return bookings;
    return bookings.filter(b => b.status?.toLowerCase() === activeTab);
  };

  const getTabCount = (status) => {
    if (status === 'all') return bookings.length;
    return bookings.filter(b => b.status?.toLowerCase() === status).length;
  };

  const groupBookingsByDate = (items) => {
    const groups = {};
    items.forEach(booking => {
      const date = booking.createdAt
        ? (booking.createdAt instanceof Date
          ? booking.createdAt
          : new Date(booking.createdAt.seconds ? booking.createdAt.seconds * 1000 : booking.createdAt))
        : new Date();
      const monthYear = date.toLocaleString('default', { month: 'long', year: 'numeric' });
      if (!groups[monthYear]) groups[monthYear] = [];
      groups[monthYear].push(booking);
    });
    const sorted = {};
    Object.keys(groups)
      .sort((a, b) => new Date(b) - new Date(a))
      .forEach(key => { sorted[key] = groups[key]; });
    return sorted;
  };

  const tabs = [
    { key: 'all', label: 'All' },
    { key: 'pending approval', label: 'Pending' },
    { key: 'approved', label: 'Approved' },
    { key: 'completed', label: 'Completed' },
    { key: 'cancelled', label: 'Cancelled' },
  ];

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
            <p>You have no bookings in your history.</p>
            <button onClick={() => navigate('/client-dashboard')} className="browse-rooms-btn">
              Browse Rooms
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const filtered = filterBookings();
  const groupedBookings = groupBookingsByDate(filtered);

  return (
    <div className="booking-history-container">
      <Navbar />
      <div className="booking-history-content">
        <h2>Your Booking History</h2>

        <div className="booking-tabs">
          {tabs.map(tab => (
            <button
              key={tab.key}
              className={`tab-button ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label} ({getTabCount(tab.key)})
            </button>
          ))}
        </div>

        <div className="booking-list">
          {Object.entries(groupedBookings).map(([monthYear, monthBookings]) => (
            <div key={monthYear} className="booking-month-group">
              <h3 className="month-year-header">{monthYear}</h3>
              <div className="booking-cards-grid">
                {monthBookings.map(booking => (
                  <BookingCard
                    key={booking.id}
                    booking={{
                      ...booking,
                      checkInDate: booking.formattedCheckIn,
                      checkOutDate: booking.formattedCheckOut,
                    }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {hasMore && (
          <div className="load-more-container">
            <button
              className="load-more-btn"
              onClick={handleLoadMore}
              disabled={loadingMore}
            >
              {loadingMore ? 'Loading...' : 'Load More Bookings'}
            </button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default BookingHistory;
