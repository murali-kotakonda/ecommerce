import React, { useState } from "react";
import "../comp_css/AdminModern.css";
import ImageUploadField from "./admin/ImageUploadField";

const UpdateProductForm = ({ product, onUpdate, onClose }) => {
  const [p, setP] = useState({ ...product });

  const handleChange = (e) => setP({ ...p, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate({
      ...p,
      price: p.price !== "" && p.price != null ? Number(p.price) : p.price,
      discountPrice: p.discountPrice !== "" && p.discountPrice != null ? Number(p.discountPrice) : null,
      stockQuantity: p.stockQuantity !== "" && p.stockQuantity != null ? Number(p.stockQuantity) : p.stockQuantity,
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h2>Update Product</h2>
          <button className="close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="field">
              <label>Product Name</label>
              <input type="text" name="name" value={p.name || ""} onChange={handleChange} />
            </div>

            <ImageUploadField label="Product Image" value={p.imageUrl} onUploaded={(url) => setP((x) => ({ ...x, imageUrl: url }))} />

            <div className="field">
              <label>Description</label>
              <textarea name="description" rows={3} value={p.description || ""} onChange={handleChange} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div className="field">
                <label>Price (INR)</label>
                <input type="number" name="price" value={p.price ?? ""} onChange={handleChange} min="0" step="0.01" />
              </div>
              <div className="field">
                <label>Discount Price (INR)</label>
                <input type="number" name="discountPrice" value={p.discountPrice ?? ""} onChange={handleChange} min="0" step="0.01" />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div className="field">
                <label>Stock Quantity</label>
                <input type="number" name="stockQuantity" value={p.stockQuantity ?? ""} onChange={handleChange} min="0" step="1" />
              </div>
              <div className="field">
                <label>Category</label>
                <input type="text" name="category" value={p.category || ""} onChange={handleChange} />
              </div>
            </div>
          </div>
          <div className="modal-foot">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Update</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProductForm;
