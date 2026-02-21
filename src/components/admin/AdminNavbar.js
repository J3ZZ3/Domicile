import React from "react";
import "./AdminStyles/AdminNavbar.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { IoGridOutline, IoAddCircleOutline, IoPeopleOutline, IoCalendarOutline } from 'react-icons/io5';

const AdminNavbar = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const isActive = (path) => location.pathname === path ? 'active' : '';

    return (
        <nav className="admin-navbar">
            <div
                className="admin-app"
                onClick={() => navigate('/admin-dashboard')}
            >
                Domicile Hotels
            </div>
            <div className="nav-links">
                <Link to="/admin-dashboard" className={isActive('/admin-dashboard')}>
                    <IoGridOutline />
                    <span>Dashboard</span>
                </Link>
                <Link to="/add-room" className={isActive('/add-room')}>
                    <IoAddCircleOutline />
                    <span>Add Room</span>
                </Link>
                <Link to="/manage-admins" className={isActive('/manage-admins')}>
                    <IoPeopleOutline />
                    <span>Manage Admins</span>
                </Link>
                <Link to="/customer-bookings" className={isActive('/customer-bookings')}>
                    <IoCalendarOutline />
                    <span>Bookings</span>
                </Link>
            </div>
        </nav>
    );
};

export default AdminNavbar;
