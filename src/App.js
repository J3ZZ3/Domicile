import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import AdminDashboard from "./components/admin/AdminDashboard";
import AdminLogin from "./components/admin/AdminLogin";
import AddAdmin from "./components/admin/AddAdmin";
import ProtectedRoute from "./components/ProtectedRoute";
import ClientDashboard from "./components/client/ClientDashboard";
import ClientLogin from "./components/client/ClientLogin";
import BookingHistory from "./components/client/BookingHistory";
import BookingStatus from "./components/client/BookingStatus";
import ClientRegister from "./components/client/ClientRegister";
import HomePage from "./components/HomePage";
import AdminRegister from './components/admin/AdminRegister';
import RoomDetail from "./components/admin/RoomDetail";
import AddRoom from "./components/admin/AddRoom";
import ManageAdmins from "./components/admin/ManageAdmins";
import EditAdmin from "./components/admin/EditAdmin";
import CustomerBookings from "./components/admin/CustomerBookings";
import ClientRoomDetail from "./components/client/ClientRoomDetail";
import BookingForm from "./components/client/BookingForm";
import BookingDetail from './components/client/BookingDetail';
import UpdateRoom from "./components/admin/UpdateRoom";
import UserProfile from "./components/client/UserProfile";
import Amenities from "./components/client/Amenities";
import HelpSupport from "./components/client/HelpSupport";
import HotelDetails from "./components/client/HotelDetails";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin-register" element={<AdminRegister />} />
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-admin"
            element={
              <ProtectedRoute>
                <AddAdmin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manage-admins"
            element={
              <ProtectedRoute>
                <ManageAdmins />
              </ProtectedRoute>
            }
          />
          <Route 
            path="/add-room" 
            element={
              <ProtectedRoute>
                <AddRoom />
              </ProtectedRoute>
            }
          />
          <Route 
            path="/edit-room/:roomId" 
            element={
              <ProtectedRoute>
                <RoomDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-admin/:adminId"
            element={
              <ProtectedRoute>
                <EditAdmin />
              </ProtectedRoute>
            }
          />
          <Route path="/client-login" element={<ClientLogin />} />
          <Route path="/client-register" element={<ClientRegister />} />
          <Route
            path="/client-dashboard"
            element={
              <ProtectedRoute>
                <ClientDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/booking-history"
            element={
              <ProtectedRoute>
                <BookingHistory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/booking-status/:roomId"
            element={
              <ProtectedRoute>
                <BookingStatus />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customer-bookings"
            element={
              <ProtectedRoute>
                <CustomerBookings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/room/:roomId"
            element={
              <ProtectedRoute>
                <ClientRoomDetail />
              </ProtectedRoute>
            }
          />
          <Route 
            path="/booking/:roomId" 
            element={
              <ProtectedRoute>
                <BookingForm />
              </ProtectedRoute>
            }
          />
          <Route 
            path="/booking-detail/:bookingId" 
            element={
              <ProtectedRoute>
                <BookingDetail />
              </ProtectedRoute>
            }
          />
          <Route 
            path="/update-room/:roomId" 
            element={
              <ProtectedRoute>
                <UpdateRoom />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            }
          />
          <Route path="/amenities" element={<Amenities />} />
          <Route path="/help" element={<HelpSupport />} />
          <Route path="/virtual-tour" element={<HotelDetails />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;