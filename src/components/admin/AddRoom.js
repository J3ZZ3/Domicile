import React, { useState } from "react";
import { db, storage } from "../../firebase/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";
import Swal from "sweetalert2";
import "./AdminStyles/AddRoom.css";

const AddRoom = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    amenities: "",
    price: "",
    roomType: "",
    bedType: "",
    capacity: "",
    view: "",
    smoking: "no",
    floor: "",
    roomNumber: "",
    imageFile: null,
    maxBookings: "",
    currentBookings: 0,
    status: "Available"
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({
      ...prev,
      imageFile: file
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!formData.name || !formData.description || !formData.amenities || 
        !formData.price || !formData.roomType || !formData.imageFile) {
      setError("Please fill out all required fields and upload an image.");
      setLoading(false);
      return;
    }

    try {
      const imageRef = ref(storage, `rooms/${formData.imageFile.name + Date.now()}`);
      await uploadBytes(imageRef, formData.imageFile);
      const imageUrl = await getDownloadURL(imageRef);

      await addDoc(collection(db, "rooms"), {
        name: formData.name,
        description: formData.description,
        amenities: formData.amenities.split(',').map(item => item.trim()),
        price: parseFloat(formData.price),
        type: formData.roomType,
        bedType: formData.bedType,
        capacity: parseInt(formData.capacity) || 0,
        view: formData.view,
        smoking: formData.smoking,
        floor: formData.floor,
        roomNumber: formData.roomNumber,
        imageUrl,
        maxBookings: parseInt(formData.maxBookings) || 0,
        currentBookings: 0,
        status: "Available",
        availableBookings: parseInt(formData.maxBookings) || 0
      });

      Swal.fire({
        icon: "success",
        title: "Room Added",
        text: "The room has been added successfully.",
        confirmButtonColor: '#c0392b',
        customClass: {
          popup: 'custom-popup'
        }
      });

      navigate('/admin-dashboard');
    } catch (err) {
      console.error("Error adding room: ", err);
      setError("Failed to add room. Please try again.");
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to add room. Please try again.",
        confirmButtonColor: '#c0392b',
        customClass: {
          popup: 'custom-popup'
        }
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-room-page">
      <AdminNavbar />
      <div className="add-room-container">
        <h1>Add New Room</h1>
        <form onSubmit={handleSubmit} className="add-room-form">
          <div className="form-group">
            <label>Room Number *</label>
            <input
              type="text"
              name="roomNumber"
              value={formData.roomNumber}
              onChange={handleChange}
              placeholder="e.g., 101"
              required
            />
          </div>

          <div className="form-group">
            <label>Room Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter room name"
              required
            />
          </div>

          <div className="form-group">
            <label>Room Type *</label>
            <select
              name="roomType"
              value={formData.roomType}
              onChange={handleChange}
              required
            >
              <option value="">Select Room Type</option>
              <option value="Standard">Standard</option>
              <option value="Deluxe">Deluxe</option>
              <option value="Suite">Suite</option>
              <option value="Executive">Executive</option>
              <option value="Presidential">Presidential</option>
            </select>
          </div>

          <div className="form-group">
            <label>Bed Type *</label>
            <select
              name="bedType"
              value={formData.bedType}
              onChange={handleChange}
              required
            >
              <option value="">Select Bed Type</option>
              <option value="Single">Single</option>
              <option value="Twin">Twin</option>
              <option value="Double">Double</option>
              <option value="Queen">Queen</option>
              <option value="King">King</option>
              <option value="California King">California King</option>
            </select>
          </div>

          <div className="form-group">
            <label>Maximum Capacity (persons) *</label>
            <input
              type="number"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              placeholder="Enter maximum capacity"
              required
            />
          </div>

          <div className="form-group">
            <label>Floor Number</label>
            <input
              type="number"
              name="floor"
              value={formData.floor}
              onChange={handleChange}
              placeholder="Enter floor number"
            />
          </div>

          <div className="form-group">
            <label>View</label>
            <select
              name="view"
              value={formData.view}
              onChange={handleChange}
            >
              <option value="">Select View Type</option>
              <option value="City">City View</option>
              <option value="Ocean">Ocean View</option>
              <option value="Garden">Garden View</option>
              <option value="Pool">Pool View</option>
              <option value="Mountain">Mountain View</option>
            </select>
          </div>

          <div className="form-group">
            <label>Smoking</label>
            <select
              name="smoking"
              value={formData.smoking}
              onChange={handleChange}
            >
              <option value="no">Non-Smoking</option>
              <option value="yes">Smoking</option>
            </select>
          </div>

          <div className="form-group">
            <label>Price per Night (USD) *</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Enter price"
              required
            />
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter room description"
              required
            />
          </div>

          <div className="form-group">
            <label>Amenities (comma-separated) *</label>
            <input
              type="text"
              name="amenities"
              value={formData.amenities}
              onChange={handleChange}
              placeholder="e.g., WiFi, TV, Mini Bar, Air Conditioning, Safe"
              required
            />
          </div>

          <div className="form-group">
            <label>Room Image *</label>
            <input
              type="file"
              onChange={handleImageChange}
              accept="image/*"
              required
            />
          </div>

          <div className="form-group">
            <label>Maximum Bookings Allowed *</label>
            <input
              type="number"
              name="maxBookings"
              value={formData.maxBookings}
              onChange={handleChange}
              placeholder="Enter maximum number of bookings"
              min="1"
              required
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Adding Room..." : "Add Room"}
          </button>

          {error && <p className="error-message">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default AddRoom;