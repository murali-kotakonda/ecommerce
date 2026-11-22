import { BRAND, pageTitle } from "../config/brand";
import React, { useState, useEffect } from "react";
import "../comp_css/Login.css";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../Router/api";

const msgStyle = {
  background: "#fee2e2",
  color: "#991b1b",
  padding: "10px 12px",
  borderRadius: 8,
  marginBottom: 12,
  fontSize: 14,
};
const linkRow = { textAlign: "center", marginTop: 12, fontSize: 14 };

const stripBearer = (t) => (t || "").replace(/^Bearer\s+/i, "").trim();

const getAuthorities = (jwt) => {
  try {
    const payload = jwt.split(".")[1];
    const json = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
    return json.authorities || "";
  } catch {
    return "";
  }
};

const AdminLogin = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = pageTitle("Admin Login");
    return () => { document.title = BRAND.name; };
  }, []);

  const onChange = (e) => {
    setError("");
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.username.trim() || !form.password.trim()) {
      setError("Please enter username and password");
      return;
    }
    try {
      const authHeader = `Basic ${btoa(`${form.username}:${form.password}`)}`;
      const response = await axios.get(`${API_BASE_URL}/ecom/signIn`, {
        headers: { Authorization: authHeader },
      });
      if (response.headers.authorization !== undefined) {
        const token = stripBearer(response.headers.authorization);
        if (!getAuthorities(token).includes("ROLE_ADMIN")) {
          setError("Access denied: this account is not an administrator.");
          return;
        }
        localStorage.setItem("jwtToken", token);
        localStorage.setItem("adminid", response.data.id);
        localStorage.setItem("name", response.data.firstNAme || "Admin");
        navigate("/admin/admin");
      } else {
        setError("Invalid credentials. Please try again.");
      }
    } catch (err) {
      setError(
        err.response && err.response.status === 401
          ? "Invalid credentials. Please try again."
          : "Error during login. Please try again later."
      );
    }
  };

  const { username, password } = form;

  return (
    <>
      <h2 style={{ textAlign: "center", color: "White", margin: "10px" }}>
        {BRAND.name} Admin
      </h2>
      <div className="loginConatiner">
        <div className="login-form">
          <h2 style={{ textAlign: "center" }}>{BRAND.logoMark} Admin Login</h2>
          {error && <div style={msgStyle}>{error}</div>}
          <form onSubmit={submitHandler}>
            <div className="form-group">
              <label htmlFor="username">Username:</label>
              <input id="username" type="text" name="username" value={username} onChange={onChange} />
            </div>
            <br />
            <div className="form-group">
              <label>Password:</label>
              <input type="password" name="password" value={password} onChange={onChange} />
            </div>
            <div className="form-group">
              <input type="submit" value="Login" />
            </div>
          </form>
          <div style={linkRow}>
            Not an admin? <Link to="/login">Login as Customer</Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminLogin;



