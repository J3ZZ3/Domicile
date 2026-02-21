import React, { useState, useEffect, useCallback, useMemo } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";
import Swal from "sweetalert2";
import "./AdminStyles/ManageAdmins.css";

const ADMINS_PER_PAGE = 12;

const ManageAdmins = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAdmins, setSelectedAdmins] = useState([]);
  const [visibleCount, setVisibleCount] = useState(ADMINS_PER_PAGE);
  const navigate = useNavigate();

  const fetchAdmins = useCallback(async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "admins"));
      setAdmins(querySnapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (error) {
      console.error("Error fetching admins:", error);
      Swal.fire({ icon: "error", title: "Error", text: "Failed to fetch admin list" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetchAdmins().then(() => { if (cancelled) return; });
    return () => { cancelled = true; };
  }, [fetchAdmins]);

  const visibleAdmins = useMemo(() => admins.slice(0, visibleCount), [admins, visibleCount]);
  const hasMore = visibleCount < admins.length;

  const handleSelectAdmin = useCallback((adminId) => {
    setSelectedAdmins(prev =>
      prev.includes(adminId) ? prev.filter(id => id !== adminId) : [...prev, adminId]
    );
  }, []);

  const handleSelectAll = useCallback(() => {
    setSelectedAdmins(prev =>
      prev.length === admins.length ? [] : admins.map(a => a.id)
    );
  }, [admins]);

  const handleDeleteSelected = useCallback(async () => {
    if (selectedAdmins.length === 0) {
      Swal.fire({ icon: "warning", title: "No Selection", text: "Please select admins to delete" });
      return;
    }

    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Delete ${selectedAdmins.length} admin${selectedAdmins.length > 1 ? "s" : ""}? This cannot be undone!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete them!"
    });

    if (result.isConfirmed) {
      try {
        await Promise.all(selectedAdmins.map(id => deleteDoc(doc(db, "admins", id))));
        Swal.fire("Deleted!", "Selected admins have been deleted.", "success");
        setSelectedAdmins([]);
        fetchAdmins();
      } catch (error) {
        console.error("Error deleting admins:", error);
        Swal.fire({ icon: "error", title: "Error", text: "Failed to delete selected admins" });
      }
    }
  }, [selectedAdmins, fetchAdmins]);

  const handleDeleteAdmin = useCallback(async (adminId, adminEmail) => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: `Delete admin: ${adminEmail}`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#c0392b',
        cancelButtonColor: '#666',
        confirmButtonText: 'Yes, delete!',
      });

      if (result.isConfirmed) {
        await deleteDoc(doc(db, "admins", adminId));
        setAdmins(prev => prev.filter(a => a.id !== adminId));
        Swal.fire({ title: 'Deleted!', text: 'Admin has been deleted.', icon: 'success', confirmButtonColor: '#c0392b' });
      }
    } catch (error) {
      console.error("Error deleting admin:", error);
      Swal.fire({ icon: "error", title: "Error", text: "Failed to delete admin" });
    }
  }, []);

  if (loading) {
    return (
      <div className="manage-admins-page">
        <AdminNavbar />
        <div className="manage-admins-container">
          <div className="loading">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="manage-admins-page">
      <AdminNavbar />
      <div className="manage-admins-container">
        <div className="manage-admins-header">
          <h1>Manage Administrators</h1>
          <button className="add-admin-button" onClick={() => navigate("/add-admin")}>
            Add New Admin
          </button>
        </div>

        {admins.length === 0 ? (
          <div className="empty-state">
            <p>No administrators found.</p>
          </div>
        ) : (
          <>
            <div className="admin-actions">
              <button className="select-all-button" onClick={handleSelectAll}>
                {selectedAdmins.length === admins.length ? 'Deselect All' : 'Select All'}
              </button>
              {selectedAdmins.length > 0 && (
                <button className="delete-selected-button" onClick={handleDeleteSelected}>
                  Delete Selected ({selectedAdmins.length})
                </button>
              )}
            </div>

            <div className="admins-grid">
              {visibleAdmins.map(admin => (
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
                      Joined: {admin.createdAt ? new Date(admin.createdAt).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                  <div className="admin-actions">
                    <button
                      className="edit-button"
                      onClick={(e) => { e.stopPropagation(); navigate(`/edit-admin/${admin.id}`); }}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-button"
                      onClick={(e) => { e.stopPropagation(); handleDeleteAdmin(admin.id, admin.email); }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {hasMore && (
              <div className="load-more-container">
                <button className="load-more-btn" onClick={() => setVisibleCount(prev => prev + ADMINS_PER_PAGE)}>
                  Load More ({admins.length - visibleCount} remaining)
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ManageAdmins;
