import React from "react";
import "./AdminStyles/AdminNavbar.css";
import { Link, useLocation, useNavigate } from "react-router-dom";

const AdminNavbar = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const isActive = (path) => {
        return location.pathname === path ? 'active' : '';
    };

    return (
        <nav className="admin-navbar">
            <div 
                className="admin-app" 
                onClick={() => navigate('/admin-dashboard')}
            >
                Domicile Hotels
            </div>
            <div className="nav-links">
                <Link 
                    to="/admin-dashboard" 
                    className={isActive('/admin-dashboard')}
                >
                    <ion-icon name="grid-outline"></ion-icon>
                    <span>Dashboard</span>
                </Link>
                <Link 
                    to="/add-room" 
                    className={isActive('/add-room')}
                >
                    <ion-icon name="add-circle-outline"></ion-icon>
                    <span>Add Room</span>
                </Link>
                <Link 
                    to="/manage-admins" 
                    className={isActive('/manage-admins')}
                >
                    <ion-icon name="people-outline"></ion-icon>
                    <span>Manage Admins</span>
                </Link>
                <Link 
                    to="/customer-bookings" 
                    className={isActive('/customer-bookings')}
                >
                    <ion-icon name="calendar-outline"></ion-icon>
                    <span>Bookings</span>
                </Link>
            </div>
        </nav>
    );
};

export default AdminNavbar;