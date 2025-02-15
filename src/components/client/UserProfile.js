import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebase/firebaseConfig';
import { doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';
import { IoPersonCircle, IoMail, IoCall, IoHome, IoNewspaper, IoCamera, IoReload } from 'react-icons/io5';
import Navbar from './common/ClientNavbar';
import './ClientStyles/UserProfile.css';
import Swal from 'sweetalert2';

const UserProfile = () => {
    const { currentUser, loading: authLoading } = useAuth();
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [profile, setProfile] = useState({
        displayName: '',
        email: '',
        phoneNumber: '',
        address: '',
        profilePicture: '',
        bio: ''
    });

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (!currentUser) return;
            
            try {
                const userDocRef = doc(db, 'users', currentUser.uid);
                const userDoc = await getDoc(userDocRef);
                
                if (userDoc.exists()) {
                    setProfile(prevProfile => ({
                        ...prevProfile,
                        ...userDoc.data()
                    }));
                } else {
                    // Create a new user document if it doesn't exist
                    const newUserData = {
                        uid: currentUser.uid,
                        email: currentUser.email,
                        displayName: '',
                        phoneNumber: '',
                        address: '',
                        profilePicture: '',
                        bio: '',
                        role: 'client',
                        createdAt: new Date()
                    };
                    await setDoc(userDocRef, newUserData);
                    setProfile(prevProfile => ({
                        ...prevProfile,
                        ...newUserData
                    }));
                }
            } catch (error) {
                console.error('Error fetching user profile:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to load profile information'
                });
            } finally {
                setLoading(false);
            }
        };

        if (currentUser) {
            fetchUserProfile();
        }
    }, [currentUser]);

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Check file size (max 2MB for base64)
        if (file.size > 2 * 1024 * 1024) {
            Swal.fire({
                icon: 'error',
                title: 'File Too Large',
                text: 'Please select an image under 2MB'
            });
            return;
        }

        // Check file type
        if (!file.type.startsWith('image/')) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid File Type',
                text: 'Please select an image file'
            });
            return;
        }

        setUploadingImage(true);
        try {
            // Convert image to base64
            const base64 = await convertToBase64(file);
            
            // Update or create user document
            const userDocRef = doc(db, 'users', currentUser.uid);
            const userDoc = await getDoc(userDocRef);
            
            if (userDoc.exists()) {
                await updateDoc(userDocRef, {
                    profilePicture: base64
                });
            } else {
                await setDoc(userDocRef, {
                    uid: currentUser.uid,
                    email: currentUser.email,
                    profilePicture: base64,
                    role: 'client',
                    createdAt: new Date()
                });
            }
            
            setProfile(prev => ({ ...prev, profilePicture: base64 }));

            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Profile picture updated successfully'
            });
        } catch (error) {
            console.error("Error uploading image:", error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to upload profile picture'
            });
        } finally {
            setUploadingImage(false);
        }
    };

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!editing) return;

        try {
            const userDocRef = doc(db, 'users', currentUser.uid);
            const userDoc = await getDoc(userDocRef);
            
            if (userDoc.exists()) {
                await updateDoc(userDocRef, {
                    displayName: profile.displayName,
                    phoneNumber: profile.phoneNumber,
                    address: profile.address,
                    bio: profile.bio
                });
            } else {
                await setDoc(userDocRef, {
                    uid: currentUser.uid,
                    email: currentUser.email,
                    displayName: profile.displayName,
                    phoneNumber: profile.phoneNumber,
                    address: profile.address,
                    bio: profile.bio,
                    role: 'client',
                    createdAt: new Date()
                });
            }
            
            setEditing(false);
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Profile updated successfully'
            });
        } catch (error) {
            console.error("Error updating profile:", error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to update profile'
            });
        }
    };

    if (authLoading || loading) {
        return (
            <div className="loading-screen">
                <IoReload className="loading-icon" />
                <p>Loading profile information...</p>
            </div>
        );
    }

    return (
        <div className="profile-page">
            <Navbar />
            <div className="profile-container">
                <div className="profile-header">
                    <div className="profile-picture-container">
                        {profile.profilePicture ? (
                            <img
                                src={profile.profilePicture}
                                alt="Profile"
                                className="profile-picture"
                            />
                        ) : (
                            <IoPersonCircle className="profile-picture-placeholder" />
                        )}
                        <label className="profile-picture-upload" htmlFor="profile-image-input">
                            <IoCamera />
                            <input
                                id="profile-image-input"
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                disabled={uploadingImage}
                                style={{ display: 'none' }}
                            />
                        </label>
                    </div>
                    <h2 className="profile-title">User Profile</h2>
                </div>

                <form onSubmit={handleSubmit} className="profile-form">
                    <div className="form-group">
                        <div className="input-group">
                            <div className="input-with-icon">
                                <IoPersonCircle />
                                <input
                                    type="text"
                                    value={profile.displayName}
                                    placeholder='Enter your full name'
                                    onChange={(e) => setProfile({...profile, displayName: e.target.value})}
                                    disabled={!editing}
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <div className="input-with-icon">
                                <IoMail />
                                <input
                                    type="email"
                                    value={profile.email}
                                    placeholder={profile.email}
                                    disabled
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <div className="input-with-icon">
                                <IoCall />
                                <input
                                    type="tel"
                                    value={profile.phoneNumber}
                                    placeholder='Enter your phone number'
                                    onChange={(e) => setProfile({...profile, phoneNumber: e.target.value})}
                                    disabled={!editing}
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <div className="input-with-icon textarea-container">
                                <IoHome />
                                <textarea
                                    value={profile.address}
                                    onChange={(e) => setProfile({...profile, address: e.target.value})}
                                    placeholder='Enter your address'
                                    disabled={!editing}
                                    className="short-textarea"
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <div className="input-with-icon textarea-container">
                                <IoNewspaper />
                                <textarea
                                    value={profile.bio}
                                    placeholder='Enter your bio'
                                    onChange={(e) => setProfile({...profile, bio: e.target.value})}
                                    disabled={!editing}
                                    className="short-textarea"
                                />
                            </div>
                        </div>
                        
                    </div>

                    <div className="action-buttons">
                        {editing ? (
                            <>
                                <button type="button" className="cancel-button" onClick={() => setEditing(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="save-button">
                                    Save Changes
                                </button>
                            </>
                        ) : (
                            <button type="button" className="edit-button" onClick={() => setEditing(true)}>
                                Edit Profile
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserProfile; 