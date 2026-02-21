import React, { useState, useEffect, useCallback, useMemo } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { db, storage } from "../../firebase/firebaseConfig";
import AdminNavbar from "./AdminNavbar";
import "./AdminStyles/AdminDashboard.css";
import Swal from "sweetalert2";
import { IoLogOutOutline } from 'react-icons/io5';
import RoomCard from './RoomCard';
import { useAuth } from '../../context/AuthContext';

const ROOMS_PER_PAGE = 12;

const swalTheme = {
  confirmButtonColor: '#c0392b',
  background: '#1a1a1a',
  color: '#ffffff',
  customClass: {
    popup: 'dark-theme-popup',
    confirmButton: 'dark-theme-button',
    cancelButton: 'dark-theme-button',
    title: 'dark-theme-title',
    htmlContainer: 'dark-theme-content'
  }
};

const AdminDashboard = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(ROOMS_PER_PAGE);
  const { logout } = useAuth();

  useEffect(() => {
    let cancelled = false;

    const fetchRooms = async () => {
      try {
        const roomSnapshot = await getDocs(collection(db, "rooms"));
        if (cancelled) return;
        setRooms(roomSnapshot.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (error) {
        if (cancelled) return;
        console.error("Error fetching rooms:", error);
        Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to fetch rooms.', ...swalTheme });
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchRooms();
    return () => { cancelled = true; };
  }, []);

  const visibleRooms = useMemo(() => rooms.slice(0, visibleCount), [rooms, visibleCount]);
  const hasMore = visibleCount < rooms.length;

  const extractStoragePath = useCallback((url) => {
    try {
      const decodedUrl = decodeURIComponent(url);
      const match = decodedUrl.match(/\/o\/(.+?)\?/);
      return match ? match[1] : null;
    } catch {
      return null;
    }
  }, []);

  const handleDeleteRoom = useCallback(async (roomId, imageUrl) => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        cancelButtonColor: '#34495e',
        confirmButtonText: 'Yes, delete it!',
        ...swalTheme
      });

      if (result.isConfirmed) {
        await deleteDoc(doc(db, "rooms", roomId));

        if (imageUrl) {
          const storagePath = extractStoragePath(imageUrl);
          if (storagePath) {
            await deleteObject(ref(storage, storagePath)).catch(() => {});
          }
        }

        setRooms(prev => prev.filter(room => room.id !== roomId));
        Swal.fire({ icon: 'success', title: 'Deleted!', text: 'Room has been deleted.', ...swalTheme });
      }
    } catch (error) {
      console.error("Error deleting room:", error);
      Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to delete room.', ...swalTheme });
    }
  }, [extractStoragePath]);

  const handleLogout = useCallback(async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Error logging out:", error);
    }
  }, [logout]);

  if (loading) {
    return (
      <div className="admin-dashboard">
        <AdminNavbar />
        <div className="admin-dashboard-content">
          <div className="loading-spinner">Loading rooms...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <AdminNavbar />
      <div className="admin-dashboard-content">
        <h1>Room Management</h1>
        {rooms.length === 0 ? (
          <div className="empty-state">
            <p>No rooms found. Add your first room to get started.</p>
          </div>
        ) : (
          <>
            <div className="admin-room-grid">
              {visibleRooms.map(room => (
                <RoomCard
                  key={room.id}
                  room={room}
                  onClick={() => handleDeleteRoom(room.id, room.imageUrl)}
                />
              ))}
            </div>
            {hasMore && (
              <div className="load-more-container">
                <button className="load-more-btn" onClick={() => setVisibleCount(prev => prev + ROOMS_PER_PAGE)}>
                  Load More ({rooms.length - visibleCount} remaining)
                </button>
              </div>
            )}
          </>
        )}
      </div>
      <button className="fab-button" onClick={handleLogout} aria-label="Sign out">
        <IoLogOutOutline />
      </button>
    </div>
  );
};

export default AdminDashboard;
