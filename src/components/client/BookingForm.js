import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { db } from '../../firebase/firebaseConfig';
import { collection, addDoc, doc, getDoc, updateDoc, getDocs, query, where } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { IoCalendar, IoPersonCircle, IoHome, IoCall, IoArrowBack, IoPeople, IoBed, IoExpand, IoEye, IoReload, IoMail } from 'react-icons/io5';
import Swal from 'sweetalert2';
import './ClientStyles/BookingForm.css';
import 'jspdf-autotable';
import ReceiptGenerator from './common/ReceiptGenerator';
import PayPalPaymentButton from './common/PayPalPaymentButton';

const FormInput = ({ icon: Icon, ...props }) => (
  <div className="input-with-icon">
    <Icon />
    <input {...props} />
  </div>
);

const SummaryItem = ({ label, value }) => (
  <div className="summary-item">
    <span>{label}</span>
    <span>{value}</span>
  </div>
);

const RoomInfo = ({ icon: Icon, label, value, style }) => value && (
  <div className="info-item" style={style}>
    <Icon className="info-icon" style={{ color: 'white' }} />
    <span>{label}: {value}</span>
  </div>
);

const BookingForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { room: roomData } = location.state || {};
  const [formData, setFormData] = useState({
    fullName: '', email: '', address: '', contactNumber: '',
    checkInDate: '', checkOutDate: '', specialRequests: ''
  });
  const [isFormValid, setIsFormValid] = useState(false);
  const [currentBookings, setCurrentBookings] = useState([]);
  const [paypalError, setPaypalError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!roomData?.id) return;
      setIsLoading(true);
      try {
        const querySnapshot = await getDocs(query(
          collection(db, "bookings"),
          where("roomId", "==", roomData.id),
          where("status", "in", ["Pending Approval", "Approved"])
        ));
        setCurrentBookings(querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })).sort((a, b) => new Date(a.checkInDate) - new Date(b.checkInDate)));
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBookings();
  }, [roomData?.id]);

  const validateDates = (checkIn, checkOut, showAlert = true) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if ((checkInDate < today || checkOutDate <= checkInDate) && showAlert) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Date Range',
        text: checkInDate < today ? 'Check-in date cannot be in the past' : 'Check-out date must be after check-in date'
      });
      return false;
    }

    const hasOverlap = currentBookings.some(booking => 
      checkInDate <= new Date(booking.checkOutDate) && 
      new Date(booking.checkInDate) <= checkOutDate
    );

    if (hasOverlap && showAlert) {
      Swal.fire({
        icon: 'error',
        title: 'Date Unavailable',
        text: 'Selected dates overlap with an existing booking'
      });
    }

    return !hasOverlap;
  };

  const handleChange = ({ target: { name, value } }) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name.includes('Date')) {
      const checkInDate = name === 'checkInDate' ? value : formData.checkInDate;
      const checkOutDate = name === 'checkOutDate' ? value : formData.checkOutDate;
      if (checkInDate && checkOutDate) {
        validateDates(checkInDate, checkOutDate, name === 'checkOutDate');
      }
    }
    setTimeout(() => validateForm(false), 0);
  };

  const validateForm = (showAlert = false) => {
    const isValid = Object.values(formData).every(val => val.trim() !== '') &&
      validateDates(formData.checkInDate, formData.checkOutDate, showAlert);
    setIsFormValid(isValid);
    return isValid;
  };

  const handlePaymentSuccess = async (data, actions) => {
    setIsProcessing(true);
    try {
      if (!validateForm(true)) return;

      const captureResult = await actions.order.capture();
      
      if (captureResult.status !== 'COMPLETED') {
        throw new Error('Payment was not completed successfully');
      }

      const user = getAuth().currentUser;
      if (!user) {
        throw new Error('User not authenticated');
      }

      const bookingData = {
        userId: user.uid,
        roomId: roomData.id,
        roomName: roomData.name || 'Room',
        roomImage: roomData.images?.[0] || '',
        capacity: roomData.capacity || 2,
        bedType: roomData.bedType || 'Standard',
        view: roomData.view || 'Standard',
        checkInDate: formData.checkInDate,
        checkOutDate: formData.checkOutDate,
        fullName: formData.fullName,
        email: formData.email,
        contactNumber: formData.contactNumber,
        address: formData.address,
        specialRequests: formData.specialRequests,
        totalAmount: calculateNights() * roomData.price,
        status: 'Pending Approval',
        paymentStatus: 'Paid',
        paymentId: captureResult.id,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const bookingRef = await addDoc(collection(db, "bookings"), bookingData);
      
      ReceiptGenerator.download({ ...bookingData, id: bookingRef.id }, captureResult);

      Swal.fire({
        icon: 'success',
        title: 'Booking Successful!',
        text: 'Your payment receipt has been downloaded.',
        confirmButtonText: 'View Booking',
      }).then((result) => {
        if (result.isConfirmed) {
          navigate(`/booking-detail/${bookingRef.id}`);
        }
      });

    } catch (error) {
      console.error('Error processing payment:', error);
      Swal.fire({
        icon: 'error',
        title: 'Payment Error',
        text: 'There was an error processing your payment. Please try again.',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const calculateNights = () => {
    if (!formData.checkInDate || !formData.checkOutDate) return 0;
    return Math.ceil(Math.abs(new Date(formData.checkOutDate) - new Date(formData.checkInDate)) / (1000 * 60 * 60 * 24));
  };

  if (!roomData) return <div className="booking-error">No room data available.</div>;

  if (isLoading) {
    return (
      <div className="loading-screen">
        <IoReload className="loading-icon" />
        <p>Loading booking information...</p>
      </div>
    );
  }

  const totalPrice = calculateNights() * (roomData?.price || 0);

  return (
    <div className="booking-layout">
      {isProcessing && (
        <div className="processing-overlay">
          <div className="processing-content">
            <IoReload className="loading-icon" />
            <p>Processing your booking...</p>
          </div>
        </div>
      )}
      
      <div className="booking-page">
        <button className="back-button" onClick={() => navigate(-1)}>
          <IoArrowBack /> Back to Room Details
        </button>
        
        <div className="booking-container">
          <div className="booking-grid">
            <div className="room-summary">
              <img src={roomData.imageUrl} alt={roomData.name} className="room-image" />
              <div className="summary-content">
                <h2>Booking Summary</h2>
                <h3>{roomData.name}</h3>
                <p className="room-type">{roomData.type} Room</p>
                <SummaryItem label="Price per night" value={`$${roomData.price}`} />
                <SummaryItem label="Number of nights" value={calculateNights()} />
                <SummaryItem label="Total Price" value={`$${totalPrice}`} />

                <div className="room-additional-info">
                  <h4>Room Details</h4>
                  <div className="info-grid">
                    <RoomInfo icon={IoPeople} label="Capacity" value={`${roomData.capacity} persons`} style={{ color: 'white', borderColor: 'white' }} />
                    <RoomInfo icon={IoBed} label="Bed" value={roomData.bedType} style={{ color: 'white', borderColor: 'white' }} />
                    <RoomInfo icon={IoEye} label="View" value={roomData.view} style={{ color: 'white', borderColor: 'white' }} />
                    <RoomInfo icon={IoHome} label="Floor"  value={roomData.floor} style={{ color: 'white', borderColor: 'white' }} />
                  </div>

                  {roomData.policies && (
                    <div className="room-policies">
                      <h4>Room Policies</h4>
                      <ul>
                        {roomData.policies.map((policy, index) => (
                          <li key={index}>{policy}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="booking-form-container">
              <h2>Guest Information</h2>
              <form>
                <div className="form-group">
                  <label>Full Name</label>
                  <FormInput icon={IoPersonCircle} type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Enter your full name" required />
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <FormInput icon={IoMail} type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter your email" required />
                </div>

                <div className="form-group">
                  <label>Address</label>
                  <FormInput icon={IoHome} type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Enter your address" required />
                </div>

                <div className="form-group">
                  <label>Contact Number</label>
                  <FormInput icon={IoCall} type="tel" name="contactNumber" value={formData.contactNumber} onChange={handleChange} placeholder="Enter your contact number" required />
                </div>

                <div className="dates-group">
                  <div className="form-group">
                    <label>Check-in Date</label>
                    <FormInput icon={IoCalendar} type="date" name="checkInDate" value={formData.checkInDate} onChange={handleChange} min={new Date().toISOString().split('T')[0]} required />
                  </div>

                  <div className="form-group">
                    <label>Check-out Date</label>
                    <FormInput icon={IoCalendar} type="date" name="checkOutDate" value={formData.checkOutDate} onChange={handleChange} min={formData.checkInDate || new Date().toISOString().split('T')[0]} required />
                  </div>
                </div>

                <div className="form-group">
                  <label>Special Requests</label>
                  <textarea name="specialRequests" value={formData.specialRequests} onChange={handleChange} placeholder="Any special requests or preferences?" rows="4" />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="payment-sidebar">
        <div className="payment-summary">
          <h3>Booking Summary</h3>
          <SummaryItem label="Room Rate" value={`$${roomData.price} / night`} />
          <SummaryItem label="Number of Nights" value={calculateNights()} />
          <SummaryItem label="Total Amount" value={`$${totalPrice}`} />
          
          <div className="payment-section">
            <div className="paypal-button-container">
              <PayPalPaymentButton 
                amount={totalPrice}
                description={`Booking for ${roomData.name}`}
                onSuccess={handlePaymentSuccess}
                validate={() => validateForm(true)}
                disabled={!isFormValid}
              />
            </div>
            
            {currentBookings.length > 0 && (
              <div className="current-bookings-section">
                <h3>Current Bookings for this Room:</h3>
                <div className="bookings-list">
                  {currentBookings.map(booking => (
                    <div key={booking.id} className="booking-date-item">
                      <IoCalendar className="calendar-icon" />
                      <span>
                        {new Date(booking.checkInDate).toLocaleDateString()} - {new Date(booking.checkOutDate).toLocaleDateString()}
                      </span>
                      <span className="booking-status">{booking.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {paypalError && (
              <div className="paypal-error-notice">
                <p>Having trouble with PayPal? Try:</p>
                <ul>
                  <li>Temporarily disabling your ad blocker</li>
                  <li>Using a different browser</li>
                  <li>Checking your internet connection</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;