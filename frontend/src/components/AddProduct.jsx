import { BRAND } from "../config/brand";
import React, { useEffect, useState } from "react";
import api from "../Router/api";
import "../comp_css/AdminModern.css";
import { useToast } from "./admin/useToast";
import ImageUploadField from "./admin/ImageUploadField";

function AddProduct() {
  const toast = useToast();
  const [categories, setCategories] = useState([]);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [product, setProduct] = useState({
    name: "", imageUrl: "", description: "", price: "", discountPrice: "",
    category: "", stockQuantity: "", available: true,
  });

  useEffect(() => {
    api.get("/ecom/categories")
      .then((res) => {
        const data = res.data?.data ?? res.data ?? [];
        setCategories((Array.isArray(data) ? data : []).filter((c) => c.active !== false));
      })
      .catch(() => setCategories([]));
  }, []);

  const handleChange = (e) => setProduct({ ...product, [e.target.name]: e.target.value });

  const validate = () => {
    const errs = {};
    if (!product.name.trim()) errs.name = "Name is required";
    if (!product.imageUrl.trim()) errs.imageUrl = "Please upload a product image";
    if (!product.description.trim() || product.description.trim().length < 10) errs.description = "Description must be at least 10 characters";
    if (!product.price || Number(product.price) <= 0) errs.price = "Enter a valid price";
    if (product.discountPrice && Number(product.discountPrice) >= Number(product.price)) errs.discountPrice = "Discount must be less than price";
    if (product.stockQuantity === "" || Number(product.stockQuantity) < 0) errs.stockQuantity = "Enter stock quantity (0 or more)";
    if (!product.category) errs.category = "Select a category";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      const payload = {
        ...product,
        price: Number(product.price),
        discountPrice: product.discountPrice ? Number(product.discountPrice) : null,
        stockQuantity: Number(product.stockQuantity),
        isAvailable: Number(product.stockQuantity) > 0,
        active: Number(product.stockQuantity) > 0,
      };
      await api.post("/ecom/products/add", payload);
      toast.success("Product added successfully");
      setProduct({ name: "", imageUrl: "", description: "", price: "", discountPrice: "", category: "", stockQuantity: "", available: true });
    } catch (error) {
      toast.error(error.response?.data?.message || "Error adding product");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="panel" style={{ maxWidth: 640 }}>
      <div className="panel-head"><h2>Add Product</h2></div>
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label>Product Name *</label>
          <input type="text" name="name" value={product.name} onChange={handleChange} placeholder="Product name" />
          {errors.name && <div className="err">{errors.name}</div>}
        </div>

        <ImageUploadField label="Product Image *" value={product.imageUrl} onUploaded={(url) => setProduct((p) => ({ ...p, imageUrl: url }))} />
        {errors.imageUrl && <div className="err" style={{ marginTop: -8, marginBottom: 12 }}>{errors.imageUrl}</div>}

        <div className="field">
          <label>Description *</label>
          <textarea name="description" rows={3} value={product.description} onChange={handleChange} placeholder="Description (min 10 chars)" />
          {errors.description && <div className="err">{errors.description}</div>}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div className="field">
            <label>Price (INR) *</label>
            <input type="number" name="price" value={product.price} onChange={handleChange} placeholder="0.00" min="0" step="0.01" />
            {errors.price && <div className="err">{errors.price}</div>}
          </div>
          <div className="field">
            <label>Discount Price (INR)</label>
            <input type="number" name="discountPrice" value={product.discountPrice} onChange={handleChange} placeholder="Optional" min="0" step="0.01" />
            {errors.discountPrice && <div className="err">{errors.discountPrice}</div>}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div className="field">
            <label>Stock Quantity *</label>
            <input type="number" name="stockQuantity" value={product.stockQuantity} onChange={handleChange} placeholder="e.g. 50" min="0" step="1" />
            {errors.stockQuantity && <div className="err">{errors.stockQuantity}</div>}
          </div>
          <div className="field">
            <label>Category *</label>
            <select name="category" value={product.category} onChange={handleChange}>
              <option value="">Select a category</option>
              {categories.map((c) => <option key={c.categoryId} value={c.name}>{c.name}</option>)}
            </select>
            {errors.category && <div className="err">{errors.category}</div>}
          </div>
        </div>
        {categories.length === 0 && <div className="err">No categories available. Create one in the Categories tab first.</div>}

        <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? "Adding..." : "Add Product"}</button>
      </form>
    </div>
  );
}

export default AddProduct;
