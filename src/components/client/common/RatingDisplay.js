import React from 'react';
import { IoStar, IoStarHalf, IoStarOutline } from 'react-icons/io5';
import '../ClientStyles/RatingDisplay.css';

const RatingDisplay = ({ 
  rating = 0, 
  totalRatings = 0, 
  showTotal = true,
  size = 'medium' 
}) => {
  const safeRating = Number(rating) || 0;
  const safeTotalRatings = Number(totalRatings) || 0;

  const getStars = () => {
    const stars = [];
    const fullStars = Math.floor(safeRating);
    const hasHalfStar = safeRating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<IoStar key={`full-${i}`} className="star-filled" />);
    }

    if (hasHalfStar) {
      stars.push(<IoStarHalf key="half" className="star-filled" />);
    }

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
          {safeRating.toFixed(1)} ({safeTotalRatings} {safeTotalRatings === 1 ? 'review' : 'reviews'})
        </span>
      )}
    </div>
  );
};

export default React.memo(RatingDisplay);
