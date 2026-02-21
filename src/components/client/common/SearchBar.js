import React, { useState, useEffect, useCallback } from 'react';
import '../ClientStyles/SearchBar.css';

const SearchBar = ({ rooms, onSearchResults }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filterRooms = useCallback(() => {
    if (!searchTerm.trim()) {
      onSearchResults(rooms);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = rooms.filter(room =>
      room.name?.toLowerCase().includes(term) ||
      room.type?.toLowerCase().includes(term) ||
      room.description?.toLowerCase().includes(term) ||
      room.price?.toString().includes(term) ||
      room.bedType?.toLowerCase().includes(term) ||
      room.view?.toLowerCase().includes(term)
    );

    onSearchResults(filtered);
  }, [searchTerm, rooms, onSearchResults]);

  useEffect(() => {
    const timeoutId = setTimeout(filterRooms, 300);
    return () => clearTimeout(timeoutId);
  }, [filterRooms]);

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search rooms by name, type, price..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        aria-label="Search rooms"
      />
    </div>
  );
};

export default React.memo(SearchBar);
