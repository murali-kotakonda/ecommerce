import React, { useState } from "react";
import "../comp_css/updateform.css";
import api from "../Router/api";
import { useNavigate } from "react-router-dom";
import { useToast } from "./admin/useToast";

const UpdateAddress = ({ address, onclose, onSaved }) => {
  const [updatedAddress, setUpdatedAddress] = useState({ ...address });
  const navigate = useNavigate();
  const toast = useToast();
  const userid = localStorage.getItem("userid");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedAddress({ ...updatedAddress, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    api
      .put(`/ecom/customer-addresses/update/${address.addressID}`, updatedAddress)
      .then(() => {
        toast.success("Address updated successfully");
        if (onSaved) onSaved();
        onclose();
        navigate(`/user/profile/${userid}`);
      })
      .catch((error) => {
        toast.error(error.response?.data?.message || "Could not update address");
      });
  };

  return (
    <div className="modal-backdrop">
      <div className="update-product-form" style={{ width: "400px" }}>
        <span className="close-button" onClick={onclose}>&times;</span>
        <h2 style={{ textAlign: "center" }}>Update Address</h2>
        <form onSubmit={handleSubmit}>
          <div><label>Flat No:</label><input type="text" name="flatNo" value={updatedAddress.flatNo} onChange={handleChange} /></div>
          <div><label>Street:</label><input type="text" name="street" value={updatedAddress.street} onChange={handleChange} /></div>
          <div><label>City:</label><input type="text" name="city" value={updatedAddress.city} onChange={handleChange} /></div>
          <div><label>Zip Code:</label><input type="text" name="zipCode" value={updatedAddress.zipCode} onChange={handleChange} /></div>
          <div><label>State:</label><input type="text" name="state" value={updatedAddress.state} onChange={handleChange} /></div>
          <button type="submit">Update Address</button>
        </form>
      </div>
    </div>
  );
};

export default UpdateAddress;
