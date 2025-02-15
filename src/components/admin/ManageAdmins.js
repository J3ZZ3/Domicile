import React, { useState, useEffect } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";
import Swal from "sweetalert2";
import "./AdminStyles/ManageAdmins.css";

const ManageAdmins = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAdmins, setSelectedAdmins] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "admins"));
      const adminList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setAdmins(adminList);
    } catch (error) {
      console.error("Error fetching admins:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch admin list"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAdmin = (adminId) => {
    setSelectedAdmins(prev => {
      if (prev.includes(adminId)) {
        return prev.filter(id => id !== adminId);
      } else {
        return [...prev, adminId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedAdmins.length === admins.length) {
      setSelectedAdmins([]);
    } else {
      setSelectedAdmins(admins.map(admin => admin.id));
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedAdmins.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "No Selection",
        text: "Please select admins to delete"
      });
      return;
    }

    const result = await Swal.fire({
      title: "Are you sure?",
      text: `You are about to delete ${selectedAdmins.length} admin${selectedAdmins.length > 1 ? "s" : ""}. This action cannot be undone!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete them!"
    });

    if (result.isConfirmed) {
      try {
        await Promise.all(
          selectedAdmins.map(adminId => 
            deleteDoc(doc(db, "admins", adminId))
          )
        );

        Swal.fire(
          "Deleted!",
          "Selected admins have been deleted.",
          "success"
        );

        setSelectedAdmins([]);
        fetchAdmins();
      } catch (error) {
        console.error("Error deleting admins:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to delete selected admins"
        });
      }
    }
  };

  const handleAddAdmin = () => {
    navigate("/add-admin");
  };

  const handleEditAdmin = (adminId) => {
    navigate(`/edit-admin/${adminId}`);
  };

  const handleDeleteAdmin = async (adminId, adminEmail) => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: `You are about to delete admin: ${adminEmail}`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#c0392b',
        cancelButtonColor: '#666',
        confirmButtonText: 'Yes, delete it!',
        customClass: {
          popup: 'custom-popup'
        }
      });

      if (result.isConfirmed) {
        await deleteDoc(doc(db, "admins", adminId));
        setAdmins(admins.filter(admin => admin.id !== adminId));
        
        Swal.fire({
          title: 'Deleted!',
          text: 'Admin has been deleted.',
          icon: 'success',
          confirmButtonColor: '#c0392b',
          customClass: {
            popup: 'custom-popup'
          }
        });
      }
    } catch (error) {
      console.error("Error deleting admin:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to delete admin",
        confirmButtonColor: '#c0392b',
        customClass: {
          popup: 'custom-popup'
        }
      });
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="manage-admins-page">
      <AdminNavbar />
      <div className="manage-admins-container">
        <div className="manage-admins-header">
          <h1>Manage Administrators</h1>
          <button className="add-admin-button" onClick={handleAddAdmin}>
            Add New Admin
          </button>
        </div>

        <div className="admin-actions">
          <button 
            className="select-all-button"
            onClick={handleSelectAll}
          >
            {selectedAdmins.length === admins.length ? 'Deselect All' : 'Select All'}
          </button>
          {selectedAdmins.length > 0 && (
            <button 
              className="delete-selected-button"
              onClick={handleDeleteSelected}
            >
              Delete Selected ({selectedAdmins.length})
            </button>
          )}
        </div>

        <div className="admins-grid">
          {admins.map((admin) => (
            <div 
              key={admin.id} 
              className={`admin-card ${selectedAdmins.includes(admin.id) ? 'selected' : ''}`}
              onClick={() => handleSelectAdmin(admin.id)}
            >
              <div className="admin-info">
                <h3>{admin.firstName} {admin.lastName}</h3>
                <p className="admin-email">{admin.email}</p>
                <p className="admin-phone">{admin.phoneNumber || 'No phone number'}</p>
                <p className="admin-created">
                  Joined: {new Date(admin.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="admin-actions">
                <button 
                  className="edit-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditAdmin(admin.id);
                  }}
                >
                  Edit
                </button>
                <button 
                  className="delete-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteAdmin(admin.id, admin.email);
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManageAdmins; 