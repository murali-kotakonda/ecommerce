import React, { useRef, useState } from "react";
import api, { resolveImageUrl } from "../../Router/api";
import { useToast } from "./useToast";

/**
 * Reusable image upload field. Lets the user pick a file, previews it,
 * uploads to POST /ecom/upload/image, and reports the hosted URL back via
 * onUploaded(url). Replaces manual image-URL text entry.
 */
export default function ImageUploadField({ value, onUploaded, label = "Image" }) {
  const toast = useToast();
  const fileRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [localPreview, setLocalPreview] = useState(null);

  const previewUrl = localPreview || (value ? resolveImageUrl(value) : null);

  const handlePick = async (e) => {
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
    setLocalPreview(URL.createObjectURL(file));
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await api.post("/ecom/upload/image", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const url = res.data?.data?.url ?? res.data?.url;
      if (!url) throw new Error("No URL returned");
      onUploaded(url);
      toast.success("Image uploaded");
    } catch (err) {
      setLocalPreview(null);
      toast.error(err.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const clear = () => {
    setLocalPreview(null);
    onUploaded("");
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className="field">
      <label>{label}</label>
      <div className="img-uploader">
        {previewUrl ? (
          <img className="preview" src={previewUrl} alt="preview" />
        ) : (
          <div
            className="preview"
            style={{ display: "flex", alignItems: "center", justifyContent: "center", color: "#6b7280" }}
          >
            No image selected
          </div>
        )}
        <p className="hint">PNG, JPG, GIF, WEBP or AVIF · max 5 MB</p>
        <input ref={fileRef} type="file" accept="image/*" onChange={handlePick} />
        <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? "Uploading..." : value ? "Replace image" : "Upload image"}
          </button>
          {value && !uploading && (
            <button type="button" className="btn btn-danger btn-sm" onClick={clear}>
              Remove
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
