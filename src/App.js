import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AdminRoute, ClientRoute } from "./components/ProtectedRoute";

const HomePage = lazy(() => import("./components/HomePage"));
const AdminLogin = lazy(() => import("./components/admin/AdminLogin"));
const AdminRegister = lazy(() => import("./components/admin/AdminRegister"));
const AdminDashboard = lazy(() => import("./components/admin/AdminDashboard"));
const AddAdmin = lazy(() => import("./components/admin/AddAdmin"));
const ManageAdmins = lazy(() => import("./components/admin/ManageAdmins"));
const AddRoom = lazy(() => import("./components/admin/AddRoom"));
const UpdateRoom = lazy(() => import("./components/admin/UpdateRoom"));
const EditAdmin = lazy(() => import("./components/admin/EditAdmin"));
const CustomerBookings = lazy(() => import("./components/admin/CustomerBookings"));
const ClientLogin = lazy(() => import("./components/client/ClientLogin"));
const ClientRegister = lazy(() => import("./components/client/ClientRegister"));
const ClientDashboard = lazy(() => import("./components/client/ClientDashboard"));
const BookingHistory = lazy(() => import("./components/client/BookingHistory"));
const BookingStatus = lazy(() => import("./components/client/BookingStatus"));
const ClientRoomDetail = lazy(() => import("./components/client/ClientRoomDetail"));
const BookingForm = lazy(() => import("./components/client/BookingForm"));
const BookingDetail = lazy(() => import("./components/client/BookingDetail"));
const UserProfile = lazy(() => import("./components/client/UserProfile"));
const Amenities = lazy(() => import("./components/client/Amenities"));
const HelpSupport = lazy(() => import("./components/client/HelpSupport"));
const HotelDetails = lazy(() => import("./components/client/HotelDetails"));

const LoadingFallback = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#1a1a1a', color: '#fff' }}>
    <div style={{ textAlign: 'center' }}>
      <div className="loading-spinner" />
      <p>Loading...</p>
    </div>
  </div>
);

const NotFound = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#1a1a1a', color: '#fff', flexDirection: 'column', gap: '1rem' }}>
    <h1 style={{ fontSize: '4rem', margin: 0 }}>404</h1>
    <p style={{ fontSize: '1.2rem', color: '#999' }}>Page not found</p>
    <a href="/" style={{ color: '#c0392b', textDecoration: 'none', fontSize: '1rem' }}>Go back home</a>
  </div>
);

const App = () => {
  return (
    <Router>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin-register" element={<AdminRegister />} />
          <Route path="/client-login" element={<ClientLogin />} />
          <Route path="/client-register" element={<ClientRegister />} />
          <Route path="/amenities" element={<Amenities />} />
          <Route path="/help" element={<HelpSupport />} />
          <Route path="/virtual-tour" element={<HotelDetails />} />

          {/* Admin-only routes */}
          <Route path="/admin-dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/add-admin" element={<AdminRoute><AddAdmin /></AdminRoute>} />
          <Route path="/manage-admins" element={<AdminRoute><ManageAdmins /></AdminRoute>} />
          <Route path="/add-room" element={<AdminRoute><AddRoom /></AdminRoute>} />
          <Route path="/update-room/:roomId" element={<AdminRoute><UpdateRoom /></AdminRoute>} />
          <Route path="/edit-admin/:adminId" element={<AdminRoute><EditAdmin /></AdminRoute>} />
          <Route path="/customer-bookings" element={<AdminRoute><CustomerBookings /></AdminRoute>} />

          {/* Client-only routes */}
          <Route path="/client-dashboard" element={<ClientRoute><ClientDashboard /></ClientRoute>} />
          <Route path="/booking-history" element={<ClientRoute><BookingHistory /></ClientRoute>} />
          <Route path="/booking-status/:roomId" element={<ClientRoute><BookingStatus /></ClientRoute>} />
          <Route path="/room/:roomId" element={<ClientRoute><ClientRoomDetail /></ClientRoute>} />
          <Route path="/booking/:roomId" element={<ClientRoute><BookingForm /></ClientRoute>} />
          <Route path="/booking-detail/:bookingId" element={<ClientRoute><BookingDetail /></ClientRoute>} />
          <Route path="/profile" element={<ClientRoute><UserProfile /></ClientRoute>} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
