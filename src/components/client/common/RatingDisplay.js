import React from 'react';
import { IoStar, IoStarHalf, IoStarOutline } from 'react-icons/io5';
import '../ClientStyles/RatingDisplay.css';

const RatingDisplay = ({ 
  rating, 
  totalRatings, 
  showTotal = true,
  size = 'medium' 
}) => {
  const getStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<IoStar key={`full-${i}`} className="star-filled" />);
    }

    // Add half star if needed
    if (hasHalfStar) {
      stars.push(<IoStarHalf key="half" className="star-filled" />);
    }

    // Add empty stars
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<IoStarOutline key={`empty-${i}`} className="star-outline" />);
    }

    return stars;
  };

  return (
    <div className={`rating-display ${size}`}>
      <div className="stars-display">
        {getStars()}
      </div>
      {showTotal && (
        <span className="rating-text">
          {rating.toFixed(1)} ({totalRatings} {totalRatings === 1 ? 'review' : 'reviews'})
        </span>
      )}
    </div>
  );
};

export default RatingDisplay; 