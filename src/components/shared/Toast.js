import React from 'react';
import './Toast.css';

const Toast = ({ message, onClose }) => {
    return (
        <div className="toast">
            <span>{message}</span>
            <button onClick={onClose}>Close</button>
        </div>
    );
};

export default Toast; 