import React, { useCallback, useEffect, useRef, useState } from "react";
import api, { resolveImageUrl } from "../../Router/api";
import { useToast } from "./useToast";

/**
 * Admin Category Management: list / add / edit / delete / enable-disable,
 * plus per-category image upload, preview, replace and delete.
 * No static/hardcoded images — everything is driven by backend APIs.
 */
export default function CategoryManagement() {
  const toast = useToast();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null); // category being edited or null for new
  const [form, setForm] = useState({ name: "", description: "", active: true });
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const [imageFor, setImageFor] = useState(null); // category whose image modal is open
  const [uploadingId, setUploadingId] = useState(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/ecom/categories");
      // Controller wraps payload in ApiResponse { success, data }
      const data = res.data?.data ?? res.data ?? [];
      setCategories(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.response?.data?.message || "Failed to load categories");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const openAdd = () => {
    setEditing(null);
    setForm({ name: "", description: "", active: true });
    setFormErrors({});
    setFormOpen(true);
  };

  const openEdit = (cat) => {
    setEditing(cat);
    setForm({
      name: cat.name || "",
      description: cat.description || "",
      active: cat.active !== false,
    });
    setFormErrors({});
    setFormOpen(true);
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Category name is required";
    else if (form.name.trim().length < 2) errs.name = "Name must be at least 2 characters";
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const saveCategory = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      if (editing) {
        await api.put(`/ecom/categories/${editing.categoryId}`, {
          name: form.name.trim(),
          description: form.description,
          active: form.active,
        });
        toast.success("Category updated");
      } else {
        await api.post("/ecom/categories", {
          name: form.name.trim(),
          description: form.description,
          active: form.active,
        });
        toast.success("Category created");
      }
      setFormOpen(false);
      fetchCategories();
    } catch (e2) {
      toast.error(e2.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const removeCategory = async (cat) => {
    if (!window.confirm(`Delete category "${cat.name}"? This also removes its image.`)) return;
    try {
      await api.delete(`/ecom/categories/${cat.categoryId}`);
      toast.success("Category deleted");
      fetchCategories();
    } catch (e) {
      toast.error(e.response?.data?.message || "Delete failed");
    }
  };

  const toggleActive = async (cat) => {
    const next = !(cat.active !== false);
    try {
      await api.patch(`/ecom/categories/${cat.categoryId}/status?active=${next}`);
      toast.success(next ? "Category enabled" : "Category disabled");
      fetchCategories();
    } catch (e) {
      toast.error(e.response?.data?.message || "Status change failed");
    }
  };

  return (
    <div className="panel">
      <div className="panel-head">
        <h2>Category Management</h2>
        <button className="btn btn-primary" onClick={openAdd}>
          + Add Category
        </button>
      </div>

      {loading && (
        <div className="cat-grid">
          {[1, 2, 3].map((i) => (
            <div key={i} className="cat-card">
              <div className="skeleton" style={{ height: 160 }} />
              <div className="body">
                <div className="skeleton" style={{ height: 18, width: "60%", marginBottom: 8 }} />
                <div className="skeleton" style={{ height: 14, width: "90%" }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="empty-state">
          <div className="icon">⚠️</div>
          <p>{error}</p>
          <button className="btn btn-ghost" onClick={fetchCategories}>Retry</button>
        </div>
      )}

      {!loading && !error && categories.length === 0 && (
        <div className="empty-state">
          <div className="icon">📂</div>
          <p>No categories yet. Create your first category to get started.</p>
          <button className="btn btn-primary" onClick={openAdd}>+ Add Category</button>
        </div>
      )}

      {!loading && !error && categories.length > 0 && (
        <div className="cat-grid">
          {categories.map((cat) => {
            const active = cat.active !== false;
            return (
              <div key={cat.categoryId} className="cat-card">
                <div className="thumb">
                  {cat.imageUrl ? (
                    <img src={resolveImageUrl(cat.imageUrl)} alt={cat.name} />
                  ) : (
                    <span className="no-image">No image uploaded</span>
                  )}
                  <span className={`badge ${active ? "badge-active" : "badge-inactive"}`}>
                    {active ? "Active" : "Disabled"}
                  </span>
                </div>
                <div className="body">
                  <h3>{cat.name}</h3>
                  <p>{cat.description || "No description"}</p>
                </div>
                <div className="actions">
                  <button className="btn btn-ghost btn-sm" onClick={() => setImageFor(cat)}>
                    🖼 Image
                  </button>
                  <button className="btn btn-ghost btn-sm" onClick={() => openEdit(cat)}>
                    ✎ Edit
                  </button>
                  <button className="btn btn-ghost btn-sm" onClick={() => toggleActive(cat)}>
                    {active ? "Disable" : "Enable"}
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={() => removeCategory(cat)}>
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {formOpen && (
        <CategoryForm
          editing={editing}
          form={form}
          setForm={setForm}
          errors={formErrors}
          saving={saving}
          onClose={() => setFormOpen(false)}
          onSubmit={saveCategory}
        />
      )}

      {imageFor && (
        <ImageModal
          category={imageFor}
          uploadingId={uploadingId}
          setUploadingId={setUploadingId}
          onClose={() => setImageFor(null)}
          onChanged={(updated) => {
            setCategories((cs) =>
              cs.map((c) => (c.categoryId === updated.categoryId ? updated : c))
            );
            setImageFor(updated);
          }}
        />
      )}
    </div>
  );
}

/* ---------- Add/Edit form modal ---------- */
function CategoryForm({ editing, form, setForm, errors, saving, onClose, onSubmit }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h2>{editing ? "Edit Category" : "Add Category"}</h2>
          <button className="close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={onSubmit}>
          <div className="modal-body">
            <div className="field">
              <label>Name *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Fruits"
              />
              {errors.name && <div className="err">{errors.name}</div>}
            </div>
            <div className="field">
              <label>Description</label>
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Short description"
              />
            </div>
            <div className="field">
              <label>
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(e) => setForm({ ...form, active: e.target.checked })}
                  style={{ marginRight: 8, width: "auto" }}
                />
                Active
              </label>
            </div>
          </div>
          <div className="modal-foot">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? "Saving..." : editing ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ---------- Image upload / replace / delete modal ---------- */
function ImageModal({ category, uploadingId, setUploadingId, onClose, onChanged }) {
  const toast = useToast();
  const fileRef = useRef(null);
  const [localPreview, setLocalPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const currentUrl = category.imageUrl ? resolveImageUrl(category.imageUrl) : null;
  const previewUrl = localPreview || currentUrl;
  const busy = uploadingId === category.categoryId;

  const pickFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5 MB");
      return;
    }
    setSelectedFile(file);
    setLocalPreview(URL.createObjectURL(file));
  };

  const upload = async () => {
    if (!selectedFile) {
      toast.error("Choose an image first");
      return;
    }
    setUploadingId(category.categoryId);
    try {
      const fd = new FormData();
      fd.append("file", selectedFile);
      const res = await api.post(`/ecom/categories/${category.categoryId}/image`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const updated = res.data?.data ?? res.data;
      toast.success("Image saved");
      setSelectedFile(null);
      setLocalPreview(null);
      onChanged(updated);
    } catch (e) {
      toast.error(e.response?.data?.message || "Upload failed");
    } finally {
      setUploadingId(null);
    }
  };

  const removeImage = async () => {
    if (!window.confirm("Delete this category image?")) return;
    setUploadingId(category.categoryId);
    try {
      const res = await api.delete(`/ecom/categories/${category.categoryId}/image`);
      const updated = res.data?.data ?? res.data;
      toast.success("Image deleted");
      setSelectedFile(null);
      setLocalPreview(null);
      onChanged(updated);
    } catch (e) {
      toast.error(e.response?.data?.message || "Delete failed");
    } finally {
      setUploadingId(null);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h2>Image — {category.name}</h2>
          <button className="close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="img-uploader">
            {previewUrl ? (
              <img className="preview" src={previewUrl} alt={category.name} />
            ) : (
              <div className="preview" style={{ display: "flex", alignItems: "center", justifyContent: "center", color: "#6b7280" }}>
                No image
              </div>
            )}
            <p className="hint">PNG, JPG, GIF, WEBP or AVIF · max 5 MB</p>
            <input ref={fileRef} type="file" accept="image/*" onChange={pickFile} />
            <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
              <button className="btn btn-ghost btn-sm" onClick={() => fileRef.current?.click()} disabled={busy}>
                {currentUrl ? "Choose replacement" : "Choose image"}
              </button>
              {selectedFile && (
                <button className="btn btn-primary btn-sm" onClick={upload} disabled={busy}>
                  {busy ? "Uploading..." : "Upload"}
                </button>
              )}
              {currentUrl && (
                <button className="btn btn-danger btn-sm" onClick={removeImage} disabled={busy}>
                  Delete image
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="modal-foot">
          <button className="btn btn-ghost" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
