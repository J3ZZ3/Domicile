import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { 
    IoPersonCircleOutline, 
    IoLogOutOutline,
    IoBookOutline,
    IoHelpCircleOutline,
} from "react-icons/io5";
import Swal from 'sweetalert2';
import "../ClientStyles/ClientNavbar.css";

const Navbar = () => {
    const [showDropdown, setShowDropdown] = useState(false);
    const navigate = useNavigate();
    const auth = getAuth();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            Swal.fire({
                icon: 'success',
                title: 'Logged Out Successfully',
                text: 'You have been logged out of your account.',
                timer: 2000,
                showConfirmButton: false
            });
            navigate('/');
        } catch (error) {
            console.error('Error logging out:', error);
            Swal.fire({
                icon: 'error',
                title: 'Logout Failed',
                text: 'There was an error logging out. Please try again.',
            });
        }
    };

    return (
        <nav className="navbar">
            <div 
                className="app-name" 
                onClick={() => navigate('/client-dashboard')}
                style={{ cursor: 'pointer' }}
            >
                Domicile Hotels
            </div>
            <div className="nav-links">
                <div className="profile-menu">
                    <div 
                        className="profile-icon" 
                        onClick={() => setShowDropdown(!showDropdown)}
                    >
                        <IoPersonCircleOutline />
                    </div>
                    {showDropdown && (
                        <div className="dropdown-menu">
                            <div className="dropdown-item" onClick={() => navigate('/profile')}>
                                <IoPersonCircleOutline />
                                <span>Profile</span>
                            </div>
                            <div className="dropdown-item" onClick={() => navigate('/booking-history')}>
                                <IoBookOutline />
                                <span>Booking History</span>
                            </div>
                            <div className="dropdown-item" onClick={() => navigate('/help')}>
                                <IoHelpCircleOutline />
                                <span>Help & Support</span>
                            </div>
                            <div className="dropdown-divider"></div>
                            <div className="dropdown-item logout" onClick={handleLogout}>
                                <IoLogOutOutline />
                                <span>Logout</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;