# Domicile Hotels - Booking System

## Overview
Domicile Hotels Booking System is a comprehensive web application that provides a seamless hotel room booking experience. Built with React and Firebase, it offers both client-facing features for hotel guests and administrative tools for hotel management.

## Live Demo
[Domicile Hotels](https://domicilehotels.vercel.app/)

## Project Structure
```
domicile-hotels/
├── src/
│   ├── components/
│   │   ├── admin/         # Admin-specific components
│   │   │   └── AdminStyles/  # Admin-specific styles
│   │   ├── client/        # Client-specific components
│   │   │   ├── common/    # Shared client components
│   │   │   └── ClientStyles/  # Client-specific styles
│   │   └── shared/        # Global shared components
│   ├── context/          # React Context providers
│   ├── firebase/         # Firebase configuration
│   └── assets/           # Images and static assets
```

## Features

### Client Features
- **User Authentication**
  - Email/password registration and login
  - Secure session management
  - Password reset functionality

- **Room Browsing & Booking**
  - View detailed room information with high-quality images
  - Real-time room availability checking
  - Advanced filtering options (price, room type, capacity, amenities)
  - Interactive room search with instant results
  - Secure PayPal payment integration

- **Booking Management**
  - View booking history and current reservations
  - Access booking details and confirmation
  - Download booking receipts
  - Special requests handling

- **User Profile**
  - Personal information management
  - Contact details updates
  - Booking preferences

### Admin Features
- **Dashboard**
  - Overview of bookings, occupancy rates, and revenue
  - Real-time booking notifications
  - Quick access to key management functions

- **Room Management**
  - Add/edit room details and pricing
  - Update room availability
  - Manage room images and descriptions
  - Set room amenities and features

- **Booking Administration**
  - View and manage all bookings
  - Process check-ins/check-outs
  - Handle booking modifications
  - Generate booking reports

## Technology Stack
- **Frontend**: React.js
- **State Management**: React Context API
- **UI Components**: React Icons, SweetAlert2
- **Maps Integration**: React Leaflet
- **Payment Processing**: PayPal SDK
- **Backend**: Firebase
  - Authentication
  - Firestore Database
  - Cloud Storage
- **Styling**: CSS3 with responsive design

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)
- Git

### Setup Instructions
1. **Clone the Repository**
   ```bash
   git clone https://github.com/J3ZZ3/Hotel-Booking-App.git
   cd Hotel-Booking-App
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory with the following variables:
   ```
   REACT_APP_API_KEY=your_firebase_api_key
   REACT_APP_AUTH_DOMAIN=your_firebase_auth_domain
   REACT_APP_PROJECT_ID=your_firebase_project_id
   REACT_APP_STORAGE_BUCKET=your_firebase_storage_bucket
   REACT_APP_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   REACT_APP_APP_ID=your_firebase_app_id
   REACT_APP_PAYPAL_CLIENT_ID=your_paypal_client_id
   ```

4. **Firebase Setup**
   - Create a new project in Firebase Console
   - Enable Authentication (Email/Password)
   - Create a Firestore database
   - Set up storage rules
   - Copy your Firebase configuration to the `.env` file

5. **Start Development Server**
   ```bash
   npm start
   ```
   The application will be available at `http://localhost:3000`

## Usage Guide

### For Clients
1. **Registration/Login**
   - Create an account using email and password
   - Login with credentials
   - Reset password if forgotten

2. **Booking a Room**
   - Browse available rooms
   - Use filters to find specific room types
   - Select check-in/check-out dates
   - Complete booking with PayPal payment

3. **Managing Bookings**
   - View booking history
   - Access booking details
   - Download booking confirmations
   - Submit special requests

### For Administrators
1. **Accessing Admin Panel**
   - Login with admin credentials
   - Navigate to admin dashboard

2. **Managing Rooms**
   - Add new rooms with details
   - Update room information
   - Manage availability
   - Set pricing

3. **Managing Bookings**
   - View all bookings
   - Process check-ins/check-outs
   - Handle booking modifications

## Support
For support, please contact:
- Email: [support@domicilehotels.com]
- Phone: [+27 12 345 6789]

## Acknowledgments
- React.js team
- Firebase team
- All contributors and supporters


## Security Considerations
- Secure authentication using Firebase Auth
- Protected routes for authenticated users
- Environment variables for sensitive data
- Input validation 

## Resources
- [React Documentation](https://reactjs.org/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [PayPal Developer Documentation](https://developer.paypal.com/docs)
