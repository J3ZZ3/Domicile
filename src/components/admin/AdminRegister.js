import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";
import { setDoc, doc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import Swal from "sweetalert2";
import withReactContent from 'sweetalert2-react-content';
import "./AdminStyles/AdminLogin.css";

const AdminRegister = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secretCode, setSecretCode] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const MySwal = withReactContent(Swal);

  const predefinedSecretCode = "adminSecretCode123";

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (secretCode !== predefinedSecretCode) {
      MySwal.fire({
        title: "Invalid Code",
        text: "Invalid admin code. Please try again.",
        icon: "error",
        confirmButtonText: "Retry",
        customClass: {
          popup: 'custom-popup'
        }
      });
      setLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "admins", user.uid), {
        uid: user.uid,
        email: user.email,
        isAdmin: true,
      });

      MySwal.fire({
        title: "Registration Successful",
        text: "Admin registered successfully!",
        icon: "success",
        confirmButtonText: "OK",
        customClass: {
          popup: 'custom-popup'
        }
      });
      navigate("/admin-login");
    } catch (err) {
      MySwal.fire({
        title: "Registration Failed",
        text: err.message,
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
        <h1 className="login-title">Register as Admin</h1>
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
          <input
            className="login-password"
            type="password"
            placeholder="Admin Code"
            value={secretCode}
            onChange={(e) => setSecretCode(e.target.value)}
            required
          />
          <button className="login-button" type="submit" disabled={loading}>
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>
        <p>Already have an account? <a href="/admin-login">Login</a></p>
      </div>
    </div>
  );
};

export default AdminRegister;
