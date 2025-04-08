import React, { useState, useEffect } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from '../../context/AuthContext';
import Swal from "sweetalert2";
import withReactContent from 'sweetalert2-react-content';
import './ClientStyles/ClientLogin.css';

const ClientRegister = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  const MySwal = withReactContent(Swal);

  useEffect(() => {
    if (currentUser && location.pathname === '/client-register') {
      navigate("/client-dashboard", { replace: true });
    }
  }, [currentUser, navigate, location]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await addDoc(collection(db, "users"), {
        uid: user.uid,
        email: user.email,
        role: "client",
        isAdmin: false,
        createdAt: new Date()
      });

      MySwal.fire({
        title: "Registration Successful",
        text: "Your account has been created successfully!",
        icon: "success",
        confirmButtonText: "Continue",
        customClass: {
          popup: 'custom-popup'
        }
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/client-dashboard");
        }
      });
    } catch (err) {
      MySwal.fire({
        title: 'Registration Failed',
        text: err.message,
        icon: 'error',
        confirmButtonText: 'Retry',
        customClass: {
          popup: 'custom-popup'
        }
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="overlay">
        <h1 className="login-title">Create Account</h1>
        <form className="login-form" onSubmit={handleRegister}>
          <input
            className="login-email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="login-password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button className="login-button" type="submit" disabled={loading}>
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>
        <p>Already have an account? <a href="/client-login">Login</a></p>
      </div>
    </div>
  );
};

export default ClientRegister;