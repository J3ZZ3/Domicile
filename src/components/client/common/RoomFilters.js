import React, { useState } from 'react';
import { FaFilter, FaWifi, FaTv, FaSnowflake, FaSmokingBan } from 'react-icons/fa';
import '../ClientStyles/RoomFilters.css';

const RoomFilters = ({ onFilterChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [filters, setFilters] = useState({
        priceRange: {
            min: 0,
            max: 5000
        },
        roomType: 'all',
        capacity: 'all',
        amenities: [],
        viewType: 'all',
        floor: 'all',
        availability: false,
        sortBy: 'recommended'
    });

    const roomTypes = [
        { value: 'all', label: 'All Types' },
        { value: 'standard', label: 'Standard Room' },
        { value: 'deluxe', label: 'Deluxe Room' },
        { value: 'suite', label: 'Suite' },
        { value: 'executive', label: 'Executive Suite' },
        { value: 'presidential', label: 'Presidential Suite' }
    ];

    const capacityOptions = [
        { value: 'all', label: 'Any Capacity' },
        { value: '1', label: 'Single (1 Person)' },
        { value: '2', label: 'Double (2 People)' },
        { value: '3', label: 'Triple (3 People)' },
        { value: '4', label: 'Family (4 People)' },
        { value: '5+', label: '5+ People' }
    ];

    const amenitiesOptions = [
        { value: 'wifi', label: 'WiFi', icon: <FaWifi /> },
        { value: 'tv', label: 'Smart TV', icon: <FaTv /> },
        { value: 'ac', label: 'Air Conditioning', icon: <FaSnowflake /> },
        { value: 'nonsmoking', label: 'Non-Smoking', icon: <FaSmokingBan /> },
        { value: 'balcony', label: 'Balcony' },
        { value: 'minibar', label: 'Mini Bar' },
        { value: 'bathtub', label: 'Bathtub' },
        { value: 'cityview', label: 'City View' }
    ];

    const viewTypes = [
        { value: 'all', label: 'Any View' },
        { value: 'city', label: 'City View' },
        { value: 'garden', label: 'Garden View' },
        { value: 'pool', label: 'Pool View' },
        { value: 'mountain', label: 'Mountain View' }
    ];

    const floorOptions = [
        { value: 'all', label: 'Any Floor' },
        { value: 'ground', label: 'Ground Floor' },
        { value: 'low', label: 'Lower Floors (1-3)' },
        { value: 'mid', label: 'Middle Floors (4-7)' },
        { value: 'high', label: 'High Floors (8+)' }
    ];

    const sortOptions = [
        { value: 'recommended', label: 'Recommended' },
        { value: 'price-low', label: 'Price: Low to High' },
        { value: 'price-high', label: 'Price: High to Low' },
        { value: 'rating', label: 'Guest Rating' },
        { value: 'size', label: 'Room Size' }
    ];

    const handleFilterChange = (key, value) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    const handleAmenityToggle = (amenity) => {
        const newAmenities = filters.amenities.includes(amenity)
            ? filters.amenities.filter(a => a !== amenity)
            : [...filters.amenities, amenity];
        
        handleFilterChange('amenities', newAmenities);
    };

    const handlePriceChange = (type, value) => {
        const newPriceRange = { ...filters.priceRange, [type]: parseInt(value) };
        handleFilterChange('priceRange', newPriceRange);
    };

    const clearFilters = () => {
        const defaultFilters = {
            priceRange: { min: 0, max: 5000 },
            roomType: 'all',
            capacity: 'all',
            amenities: [],
            viewType: 'all',
            floor: 'all',
            availability: false,
            sortBy: 'recommended'
        };
        setFilters(defaultFilters);
        onFilterChange(defaultFilters);
    };

    return (
        <div className="room-filters">
            <button 
                className="filter-toggle"
                onClick={() => setIsOpen(!isOpen)}
            >
                <FaFilter /> Filters
            </button>

            <div className={`filters-panel ${isOpen ? 'open' : ''}`}>
                <div className="filters-header">
                    <h3>Filter Rooms</h3>
                    <button className="clear-filters" onClick={clearFilters}>
                        Clear All
                    </button>
                </div>

                <div className="filters-content">
                    {/* Price Range Filter */}
                    <div className="filter-section">
                        <h4>Price Range ($)</h4>
                        <div className="price-range">
                            <input
                                type="number"
                                value={filters.priceRange.min}
                                onChange={(e) => handlePriceChange('min', e.target.value)}
                                min="0"
                                max={filters.priceRange.max}
                            />
                            <span>to</span>
                            <input
                                type="number"
                                value={filters.priceRange.max}
                                onChange={(e) => handlePriceChange('max', e.target.value)}
                                min={filters.priceRange.min}
                            />
                        </div>
                    </div>

                    {/* Room Type Filter */}
                    <div className="filter-section">
                        <h4>Room Type</h4>
                        <select
                            value={filters.roomType}
                            onChange={(e) => handleFilterChange('roomType', e.target.value)}
                        >
                            {roomTypes.map(type => (
                                <option key={type.value} value={type.value}>
                                    {type.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Capacity Filter */}
                    <div className="filter-section">
                        <h4>Capacity</h4>
                        <select
                            value={filters.capacity}
                            onChange={(e) => handleFilterChange('capacity', e.target.value)}
                        >
                            {capacityOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Amenities Filter */}
                    <div className="filter-section">
                        <h4>Amenities</h4>
                        <div className="amenities-grid">
                            {amenitiesOptions.map(amenity => (
                                <label 
                                    key={amenity.value} 
                                    className={`amenity-checkbox ${
                                        filters.amenities.includes(amenity.value) ? 'selected' : ''
                                    }`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={filters.amenities.includes(amenity.value)}
                                        onChange={() => handleAmenityToggle(amenity.value)}
                                    />
                                    {amenity.icon && <span className="amenity-icon">{amenity.icon}</span>}
                                    {amenity.label}
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* View Type Filter */}
                    <div className="filter-section">
                        <h4>View</h4>
                        <select
                            value={filters.viewType}
                            onChange={(e) => handleFilterChange('viewType', e.target.value)}
                        >
                            {viewTypes.map(view => (
                                <option key={view.value} value={view.value}>
                                    {view.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Floor Filter */}
                    <div className="filter-section">
                        <h4>Floor Level</h4>
                        <select
                            value={filters.floor}
                            onChange={(e) => handleFilterChange('floor', e.target.value)}
                        >
                            {floorOptions.map(floor => (
                                <option key={floor.value} value={floor.value}>
                                    {floor.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Availability Filter */}
                    <div className="filter-section">
                        <label className="availability-toggle">
                            <input
                                type="checkbox"
                                checked={filters.availability}
                                onChange={(e) => handleFilterChange('availability', e.target.checked)}
                            />
                            Show Available Rooms Only
                        </label>
                    </div>

                    {/* Sort By */}
                    <div className="filter-section">
                        <h4>Sort By</h4>
                        <select
                            value={filters.sortBy}
                            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                        >
                            {sortOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoomFilters; 