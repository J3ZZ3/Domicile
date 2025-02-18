import React from 'react';
import { useNavigate } from 'react-router-dom';
import './CommonStyles/UnauthorizedPage.css';

const UnauthorizedPage = () => {
  const navigate = useNavigate();

  return (
    <div className="unauthorized-container">
      <h1>Unauthorized Access</h1>
      <p>You don't have permission to access this page.</p>
      <div className="button-group">
        <button onClick={() => navigate(-1)} className="back-button">
          Go Back
        </button>
        <button onClick={() => navigate('/')} className="home-button">
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default UnauthorizedPage; 