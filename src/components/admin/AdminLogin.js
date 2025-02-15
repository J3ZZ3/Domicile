import React, { useState } from "react";
import { signInWithEmailAndPassword, setPersistence, browserLocalPersistence } from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from 'sweetalert2-react-content';
import "./AdminStyles/AdminLogin.css";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const MySwal = withReactContent(Swal);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await setPersistence(auth, browserLocalPersistence);
      await signInWithEmailAndPassword(auth, email, password);
      MySwal.fire({
        title: "Login Successful",
        text: "Welcome back!",
        icon: "success",
        confirmButtonText: "OK",
        customClass: {
          popup: 'custom-popup'
        }
      });
      navigate("/admin-dashboard");
    } catch (error) {
      MySwal.fire({
        title: "Login Failed",
        text: error.message,
        icon: "error",
        confirmButtonText: "Retry",
        customClass: {
          popup: 'custom-popup'
        }
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login">
      <div className="overlay-adminlogin">
        <h1 className="login-title">Admin Login</h1>
        <form className="login-form" onSubmit={handleLogin}>
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
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p>Don't have an account? <a href="/admin-register">Register</a></p>
      </div>
    </div>
  );
};

export default AdminLogin;