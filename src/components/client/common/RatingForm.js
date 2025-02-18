import React, { useState } from 'react';
import { IoStar, IoStarOutline } from 'react-icons/io5';
import '../ClientStyles/RatingForm.css';

const RatingForm = ({ 
  onSubmit, 
  initialRating = 0, 
  readonly = false,
  showFeedback = true 
}) => {
  const [rating, setRating] = useState(initialRating);
  const [feedback, setFeedback] = useState('');
  const [hoveredStar, setHoveredStar] = useState(0);

  const handleStarClick = (value) => {
    if (readonly) return;
    setRating(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ rating, feedback });
    setFeedback('');
  };

  return (
    <div className="rating-form-container">
      <div className="stars-container">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className={`star-button ${readonly ? 'readonly' : ''}`}
            onClick={() => handleStarClick(star)}
            onMouseEnter={() => !readonly && setHoveredStar(star)}
            onMouseLeave={() => !readonly && setHoveredStar(0)}
            disabled={readonly}
          >
            {star <= (hoveredStar || rating) ? (
              <IoStar className="star-filled" />
            ) : (
              <IoStarOutline className="star-outline" />
            )}
          </button>
        ))}
      </div>
      
      {showFeedback && !readonly && (
        <form onSubmit={handleSubmit} className="feedback-form">
          <textarea
            placeholder="Share your experience (optional)"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="feedback-input"
            rows="4"
          />
          <button 
            type="submit" 
            className="submit-button"
            disabled={rating === 0}
          >
            Submit Review
          </button>
        </form>
      )}
    </div>
  );
};

export default RatingForm; 