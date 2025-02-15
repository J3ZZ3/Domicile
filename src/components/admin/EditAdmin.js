import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import AdminNavbar from "./AdminNavbar";
import Swal from "sweetalert2";
import "./AdminStyles/EditAdmin.css";

const EditAdmin = () => {
  const { adminId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: ""
  });

  useEffect(() => {
    fetchAdminData();
  }, [fetchAdminData]);

  const fetchAdminData = useCallback(async () => {
    try {
      const adminDoc = await getDoc(doc(db, "admins", adminId));
      if (adminDoc.exists()) {
        const adminData = adminDoc.data();
        setFormData({
          firstName: adminData.firstName || "",
          lastName: adminData.lastName || "",
          email: adminData.email || "",
          phoneNumber: adminData.phoneNumber || ""
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Admin not found",
          confirmButtonColor: '#c0392b',
          background: '#1a1a1a',
          color: '#ffffff',
          customClass: {
            popup: 'dark-theme-popup',
            confirmButton: 'dark-theme-button',
            cancelButton: 'dark-theme-button',
            title: 'dark-theme-title',
            htmlContainer: 'dark-theme-content'
          }
        });
        navigate("/manage-admins");
      }
    } catch (error) {
      console.error("Error fetching admin:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch admin data",
        confirmButtonColor: '#c0392b',
        background: '#1a1a1a',
        color: '#ffffff',
        customClass: {
          popup: 'dark-theme-popup',
          confirmButton: 'dark-theme-button',
          cancelButton: 'dark-theme-button',
          title: 'dark-theme-title',
          htmlContainer: 'dark-theme-content'
        }
      });
    } finally {
      setLoading(false);
    }
  }, [adminId, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const adminRef = doc(db, "admins", adminId);
      await updateDoc(adminRef, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phoneNumber
      });

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Admin updated successfully",
        confirmButtonColor: '#c0392b',
        background: '#1a1a1a',
        color: '#ffffff',
        customClass: {
          popup: 'dark-theme-popup',
          confirmButton: 'dark-theme-button',
          cancelButton: 'dark-theme-button',
          title: 'dark-theme-title',
          htmlContainer: 'dark-theme-content'
        }
      });

      navigate("/manage-admins");
    } catch (error) {
      console.error("Error updating admin:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update admin",
        confirmButtonColor: '#c0392b',
        background: '#1a1a1a',
        color: '#ffffff',
        customClass: {
          popup: 'dark-theme-popup',
          confirmButton: 'dark-theme-button',
          cancelButton: 'dark-theme-button',
          title: 'dark-theme-title',
          htmlContainer: 'dark-theme-content'
        }
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="edit-admin-page">
        <AdminNavbar />
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="edit-admin-page">
      <AdminNavbar />
      <div className="edit-admin-container">
        <h1>Edit Administrator</h1>
        <form onSubmit={handleSubmit} className="edit-admin-form">
          <div className="form-group">
            <label>First Name *</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Enter first name"
              required
            />
          </div>

          <div className="form-group">
            <label>Last Name *</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Enter last name"
              required
            />
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              value={formData.email}
              disabled
              className="disabled-input"
            />
            <small className="helper-text">Email cannot be changed</small>
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Enter phone number"
            />
          </div>

          <div className="button-group">
            <button 
              type="button" 
              className="cancel-button"
              onClick={() => navigate("/manage-admins")}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="save-button" 
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditAdmin; 