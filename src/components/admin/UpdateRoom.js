import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../firebase/firebaseConfig';
import { IoArrowBack } from 'react-icons/io5';
import Swal from 'sweetalert2';
import './AdminStyles/UpdateRoom.css';
import AdminNavbar from "./AdminNavbar";

const UpdateRoom = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    type: 'Single',
    price: '',
    description: '',
    capacity: '',
    amenities: '',
    status: 'Available',
    image: null,
    imageUrl: ''
  });

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const roomDoc = await getDoc(doc(db, 'rooms', roomId));
        if (roomDoc.exists()) {
          const data = roomDoc.data();
          setFormData({
            name: data.name || '',
            type: data.type || 'Single',
            price: data.price || '',
            description: data.description || '',
            capacity: data.capacity || '',
            amenities: Array.isArray(data.amenities) ? data.amenities.join(', ') : data.amenities || '',
            status: data.status || 'Available',
            image: null,
            imageUrl: data.imageUrl || ''
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Room not found',
            text: 'The requested room could not be found.',
            background: '#1a1a1a',
            color: '#ffffff',
            confirmButtonColor: '#c0392b',
            customClass: {
              popup: 'swal-dark',
              title: 'swal-title',
              htmlContainer: 'swal-text',
              confirmButton: 'swal-button'
            }
          });
          navigate('/admin-dashboard');
        }
      } catch (error) {
        console.error('Error fetching room:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to fetch room details.',
          background: '#1a1a1a',
          color: '#ffffff',
          confirmButtonColor: '#c0392b',
          customClass: {
            popup: 'swal-dark',
            title: 'swal-title',
            htmlContainer: 'swal-text',
            confirmButton: 'swal-button'
          }
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [roomId, navigate]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setFormData(prev => ({
        ...prev,
        image: files[0]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = formData.imageUrl;

      if (formData.image) {
        const imageRef = ref(storage, `rooms/${roomId}`);
        await uploadBytes(imageRef, formData.image);
        imageUrl = await getDownloadURL(imageRef);
      }

      const amenitiesArray = formData.amenities
        .split(',')
        .map(item => item.trim())
        .filter(item => item !== '');

      const roomRef = doc(db, 'rooms', roomId);
      await updateDoc(roomRef, {
        name: formData.name,
        type: formData.type,
        price: Number(formData.price),
        description: formData.description,
        capacity: Number(formData.capacity),
        amenities: amenitiesArray,
        status: formData.status,
        imageUrl: imageUrl,
        updatedAt: new Date()
      });

      Swal.fire({
        icon: 'success',
        title: 'Room Updated',
        text: 'Room has been updated successfully!',
        background: '#1a1a1a',
        color: '#ffffff',
        confirmButtonColor: '#c0392b',
        customClass: {
          popup: 'swal-dark',
          title: 'swal-title',
          htmlContainer: 'swal-text',
          confirmButton: 'swal-button'
        }
      });

      navigate('/admin-dashboard');
    } catch (error) {
      console.error('Error updating room:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to update room. Please try again.',
        background: '#1a1a1a',
        color: '#ffffff',
        confirmButtonColor: '#c0392b',
        customClass: {
          popup: 'swal-dark',
          title: 'swal-title',
          htmlContainer: 'swal-text',
          confirmButton: 'swal-button'
        }
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="add-room-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="add-room-page">
    <AdminNavbar />
    <div className="add-room-container">
      
      

      <h2>Update Room</h2>

      <form onSubmit={handleSubmit} className="add-room-form">
        <div className="form-group">
          <label>Room Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Room Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
          >
            <option value="Single">Single</option>
            <option value="Double">Double</option>
            <option value="Suite">Suite</option>
            <option value="Deluxe">Deluxe</option>
          </select>
        </div>

        <div className="form-group">
          <label>Price per Night ($)</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            min="0"
          />
        </div>

        <div className="form-group">
          <label>Capacity (persons)</label>
          <input
            type="number"
            name="capacity"
            value={formData.capacity}
            onChange={handleChange}
            required
            min="1"
          />
        </div>

        <div className="form-group">
          <label>Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
          >
            <option value="Available">Available</option>
            <option value="Occupied">Occupied</option>
            <option value="Maintenance">Maintenance</option>
          </select>
        </div>

        <div className="form-group full-width">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="4"
          />
        </div>

        <div className="form-group full-width">
          <label>Amenities (comma-separated)</label>
          <textarea
            name="amenities"
            value={formData.amenities}
            onChange={handleChange}
            required
            rows="3"
            placeholder="WiFi, TV, Air Conditioning, etc."
          />
        </div>

        <div className="form-group full-width">
          <label>Room Image</label>
          {formData.imageUrl && (
            <img
              src={formData.imageUrl}
              alt="Current room"
              className="room-preview"
              style={{ maxWidth: '200px', marginBottom: '10px' }}
            />
          )}
          <input
            type="file"
            name="image"
            onChange={handleChange}
            accept="image/*"
          />
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate('/admin-dashboard')}
            className="cancel-button"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="submit-button"
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update Room'}
          </button>
        </div>
      </form>
    </div>
    </div>
  );
};

export default UpdateRoom; 