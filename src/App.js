import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext"; // Import AuthProvider
import AdminDashboard from "./components/admin/AdminDashboard";
import AdminLogin from "./components/admin/AdminLogin";
import AddAdmin from "./components/admin/AddAdmin";
import ProtectedRoute from "./components/ProtectedRoute"; // Import ProtectedRoute
import ClientDashboard from "./components/client/ClientDashboard"; // Import ClientDashboard
import ClientLogin from "./components/client/ClientLogin"; // Import ClientLogin
import BookingHistory from "./components/client/BookingHistory"; // Import BookingHistory
import BookingStatus from "./components/client/BookingStatus"; // Import BookingStatus
import ClientRegister from "./components/client/ClientRegister"; // Import ClientRegister
import HomePage from "./components/HomePage"; // Import HomePage
import AdminRegister from './components/admin/AdminRegister';
import RoomDetail from "./components/admin/RoomDetail";  // Add this import
import AddRoom from "./components/admin/AddRoom";  // Add this import
import ManageAdmins from "./components/admin/ManageAdmins";
import EditAdmin from "./components/admin/EditAdmin";
import CustomerBookings from "./components/admin/CustomerBookings";
import ClientRoomDetail from "./components/client/ClientRoomDetail"; // Add this import
import BookingForm from "./components/client/BookingForm"; // Add this import
import BookingDetail from './components/client/BookingDetail';
import UpdateRoom from "./components/admin/UpdateRoom";
import UserProfile from "./components/client/UserProfile"; // Add this import
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
              <ProtectedRoute>style
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
          <Route path="/booking-detail/:bookingId" element={<BookingDetail />} />
          <Route path="/update-room/:roomId" element={<UpdateRoom />} />
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