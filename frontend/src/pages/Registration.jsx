import React, { useState } from "react";
import "../comp_css/Login.css";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import loginbg from "../picture/loginbg.webp";
import { API_BASE_URL } from "../Router/api";

const bg = {
  backgroundImage: `url(${loginbg})`,
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "center center",
  border: "1px solid grey",
  height: "fit-content",
};
const okStyle = { background: "#dcfce7", color: "#166534", padding: "10px 12px", borderRadius: 8, marginBottom: 12, fontSize: 14 };
const errStyle = { background: "#fee2e2", color: "#991b1b", padding: "10px 12px", borderRadius: 8, marginBottom: 12, fontSize: 14 };

const initialFormData = { email: "", password: "", firstName: "", lastName: "", phoneNumber: "" };

const Registration = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialFormData);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleInputChange = (e) => {
    setError("");
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    if (!form.email.trim()) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return "Enter a valid email";
    if (form.password.length < 5 || form.password.length > 10) return "Password must be 5-10 characters";
    if (!form.firstName.trim()) return "First name is required";
    if (!/^\d{10}$/.test(form.phoneNumber)) return "Phone number must be 10 digits";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    const v = validate();
    if (v) { setError(v); return; }
    try {
      const response = await axios.post(`${API_BASE_URL}/ecom/customers`, form);
      if (response.status === 200 || response.status === 201) {
        setSuccess("Registration successful. Redirecting to login...");
        setTimeout(() => navigate("/login"), 1200);
      } else {
        setError("Registration failed. Please try again.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error registering. Please try again later.");
    }
  };

  const { email, password, firstName, lastName, phoneNumber } = form;

  return (
    <div className="login-form1" style={bg}>
      <div className="login-form">
        <h2 style={{ textAlign: "center" }}>Registration</h2>
        {error && <div style={errStyle}>{error}</div>}
        {success && <div style={okStyle}>{success}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email:</label>
            <input type="text" name="email" value={email} onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input type="password" name="password" value={password} onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label>First Name:</label>
            <input type="text" name="firstName" value={firstName} onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label>Last Name:</label>
            <input type="text" name="lastName" value={lastName} onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label>Phone Number:</label>
            <input type="text" name="phoneNumber" value={phoneNumber} onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <input type="submit" value="Register" />
          </div>
        </form>
        <p style={{ textAlign: "center" }}>
          Already have an account? <Link to="/login">Login here</Link>
        </p>
        <p style={{ textAlign: "center" }}>
          Are you an administrator? <Link to="/admin-login">Login as Admin</Link>
        </p>
      </div>
    </div>
  );
};

export default Registration;
