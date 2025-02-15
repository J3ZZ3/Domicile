import React, { useState, useEffect } from "react";
import { db } from "../../firebase/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import RoomCard from '../admin/RoomCard';
import "./ClientStyles/ClientDashboard.css";
import Navbar from "./common/ClientNavbar";
import SearchBar from "./common/SearchBar";
import HeroCarousel from './common/HeroCarousel';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import hotelFront from '../assets/hotel-front.jpg';
import lobby from '../assets/lobby.jpg';
import pool from '../assets/pool.jpg';
import RoomFilters from './common/RoomFilters';

const ClientDashboard = () => {
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [activeFilters, setActiveFilters] = useState({
    priceRange: { min: 0, max: 5000 },
    roomType: 'all',
    capacity: 'all',
    amenities: [],
    viewType: 'all',
    floor: 'all',
    availability: false,
    sortBy: 'recommended'
  });

  const carouselSlides = [
    {
      url: hotelFront,
      title: "Welcome to Domicile Hotels",
      description: "Experience luxury at its finest",
      actionButton: {
        text: "Book Now",
        onClick: () => {
          const roomsGrid = document.querySelector('.rooms-grid');
          roomsGrid.scrollIntoView({ behavior: 'smooth' });
        }
      }
    },
    {
      url: lobby,
      title: "Elegant Lobby",
      description: "Where your journey begins",
      actionButton: {
        text: "Take a Tour",
        onClick: () => navigate('/virtual-tour')
      }
    },
    {
      url: pool,
      title: "Infinity Pool",
      description: "Relax and unwind in our world-class facilities",
      actionButton: {
        text: "View Amenities",
        onClick: () => navigate('/amenities')
      }
    }
  ];

  useEffect(() => {
    if (!currentUser) {
      // Redirect if not logged in
    }
    const fetchRooms = async () => {
      try {
        const roomsRef = collection(db, "rooms");
        const querySnapshot = await getDocs(roomsRef);
        const roomsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRooms(roomsData);
        setFilteredRooms(roomsData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching rooms: ", error);
        setLoading(false);
      }
    };

    fetchRooms();
  }, [currentUser]);

  const handleRoomClick = (room) => {
    navigate(`/room/${room.id}`, { state: { room } });
  };

  const applyFilters = (rooms, filters) => {
    return rooms.filter(room => {
      // Price Range Filter
      if (room.price < filters.priceRange.min || room.price > filters.priceRange.max) {
        return false;
      }

      // Room Type Filter
      if (filters.roomType !== 'all' && room.type.toLowerCase() !== filters.roomType) {
        return false;
      }

      // Capacity Filter
      if (filters.capacity !== 'all') {
        const capacityNum = parseInt(filters.capacity);
        if (capacityNum === 5) {
          if (room.capacity < 5) return false;
        } else if (room.capacity !== capacityNum) {
          return false;
        }
      }

      // View Type Filter
      if (filters.viewType !== 'all' && room.view.toLowerCase() !== filters.viewType) {
        return false;
      }

      // Floor Filter
      if (filters.floor !== 'all') {
        const floorNum = parseInt(room.floor);
        switch (filters.floor) {
          case 'ground':
            if (floorNum !== 0) return false;
            break;
          case 'low':
            if (floorNum < 1 || floorNum > 3) return false;
            break;
          case 'mid':
            if (floorNum < 4 || floorNum > 7) return false;
            break;
          case 'high':
            if (floorNum < 8) return false;
            break;
          default:
            break;
        }
      }

      // Amenities Filter
      if (filters.amenities.length > 0) {
        const roomAmenities = room.amenities.map(a => a.toLowerCase());
        if (!filters.amenities.every(a => roomAmenities.includes(a.toLowerCase()))) {
          return false;
        }
      }

      // Availability Filter
      if (filters.availability && (room.currentBookings >= room.maxBookings || room.status !== "Available")) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      // Sorting logic
      switch (filters.sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return (b.averageRating || 0) - (a.averageRating || 0);
        case 'size':
          return b.capacity - a.capacity;
        default:
          return 0; 
      }
    });
  };

  const handleFilterChange = (newFilters) => {
    setActiveFilters(newFilters);
    const filteredResults = applyFilters(rooms, newFilters);
    setFilteredRooms(filteredResults);
  };

  const handleSearchResults = (searchResults) => {
    const filteredResults = applyFilters(searchResults, activeFilters);
    setFilteredRooms(filteredResults);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="client-dashboard">
      <Navbar />
      <HeroCarousel 
        slides={carouselSlides} 
        height="70vh"
        autoPlay={true}
      />
      <div className="dashboard-content">
        <h1>Discover Your Perfect Stay</h1>
        <div className="welcome-message">
          <strong>Domicile Hotels</strong>, where luxury meets comfort. 
          Experience our carefully curated selection of rooms, each designed to 
          provide you with an <strong>unforgettable stay</strong>.
        </div>
        
        <div className="search-and-filter">
          <div className="search-container">
            <SearchBar rooms={rooms} onSearchResults={handleSearchResults} />
          </div>
          <div className="filter-container">
            <RoomFilters onFilterChange={handleFilterChange} />
          </div>
        </div>

        <div className="rooms-section">
          <div className="rooms-grid">
            {filteredRooms.length > 0 ? (
              filteredRooms.map(room => (
                <RoomCard 
                  key={room.id} 
                  room={room} 
                  onClick={() => handleRoomClick(room)}
                />
              ))
            ) : (
              <div className="no-results">
                <h3>No rooms found</h3>
                <p>Try adjusting your filters or search criteria</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;