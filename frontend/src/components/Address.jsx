import React, { useState } from "react";
import api from "../Router/api";
import { useNavigate } from "react-router-dom";
import { useToast } from "./admin/useToast";

const Address = ({ onclose, onSaved }) => {
  const navigate = useNavigate();
  const toast = useToast();
  const userid = localStorage.getItem("userid");
  const [address, setAddress] = useState({ flatNo: "", city: "", state: "", zipCode: "", street: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    api
      .post(`/ecom/customer-addresses/${userid}`, address)
      .then(() => {
        toast.success("Address added successfully");
        if (onSaved) onSaved();
        onclose();
        navigate(`/user/profile/${userid}`);
      })
      .catch((error) => {
        toast.error(error.response?.data?.message || "Could not save address");
      });
  };

  return (
    <div className="modal-backdrop">
      <div className="update-product-form" style={{ width: "400px" }}>
        <span className="close-button" onClick={onclose}>&times;</span>
        <h2 style={{ textAlign: "center" }}>Required Address</h2>
        <form onSubmit={handleSubmit}>
          <div><label>Flat No:</label><input type="text" name="flatNo" value={address.flatNo} onChange={handleChange} /></div>
          <div><label>Street:</label><input type="text" name="street" value={address.street} onChange={handleChange} /></div>
          <div><label>City:</label><input type="text" name="city" value={address.city} onChange={handleChange} /></div>
          <div><label>Zip Code:</label><input type="text" name="zipCode" value={address.zipCode} onChange={handleChange} /></div>
          <div><label>State:</label><input type="text" name="state" value={address.state} onChange={handleChange} /></div>
          <button type="submit">Save</button>
        </form>
      </div>
    </div>
  );
};

export default Address;
