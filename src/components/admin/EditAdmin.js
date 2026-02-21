import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import AdminNavbar from "./AdminNavbar"; // eslint-disable-line no-unused-vars
import Swal from "sweetalert2";
import "./AdminStyles/EditAdmin.css";

const EditAdmin = () => {
  const { adminId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    role: "",
    status: ""
  });

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const adminDoc = await getDoc(doc(db, "admins", adminId));
        if (adminDoc.exists()) {
          const adminData = adminDoc.data();
          setFormData({
            fullName: adminData.fullName || "",
            email: adminData.email || "",
            phoneNumber: adminData.phoneNumber || "",
            role: adminData.role || "",
            status: adminData.status || ""
          });
        } else {
          setError("Admin not found");
        }
      } catch (err) {
        console.error("Error fetching admin:", err);
        setError("Failed to fetch admin data");
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [adminId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateDoc(doc(db, "admins", adminId), {
        ...formData,
        updatedAt: new Date().toISOString()
      });

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Admin details updated successfully",
      });

      navigate("/manage-admins");
    } catch (err) {
      console.error("Error updating admin:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update admin details",
      });
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading admin data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <button onClick={() => navigate("/admin/manage-admins")} className="back-button">
          Back to Admin List
        </button>
      </div>
    );
  }

  return (
    <div className="edit-admin-container">
      <h2>Edit Admin</h2>
      <form onSubmit={handleSubmit} className="edit-admin-form">
        <div className="form-group">
          <label htmlFor="fullName">Full Name</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="phoneNumber">Phone Number</label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="role">Role</label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
          >
            <option value="">Select Role</option>
            <option value="admin">Admin</option>
            <option value="superadmin">Super Admin</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
          >
            <option value="">Select Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div className="form-actions">
          <button type="button" onClick={() => navigate("/admin/manage-admins")} className="cancel-button">
            Cancel
          </button>
          <button type="submit" className="save-button">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditAdmin; 