import React, { useState } from "react";
import { useToast } from "./useToast";

export default function AdminProfile() {
  const toast = useToast();
  const name = localStorage.getItem("name") || "Admin";
  const [form, setForm] = useState({ firstName: name, lastName: "", email: "admin@ecom.com", phone: "9999999999" });
  const [pw, setPw] = useState("");
  const [showPw, setShowPw] = useState(false);

  return (
    <div className="two-col">
      <div className="panel">
        <div className="panel-head"><h2>Admin Profile</h2></div>
        <div style={{ textAlign: "center", marginBottom: 18 }}>
          <div className="a-avatar" style={{ width: 72, height: 72, fontSize: 28, margin: "0 auto 10px" }}>{(form.firstName || "A")[0]}</div>
          <span className="pill pill-indigo">Administrator</span>
        </div>
        <div className="field"><label>First Name</label><input value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} /></div>
        <div className="field"><label>Last Name</label><input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} /></div>
        <div className="field"><label>Email</label><input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
        <div className="field"><label>Phone</label><input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
        <button className="btn btn-primary" onClick={() => toast.success("Profile updated")}>Update Profile</button>
      </div>
      <div className="panel">
        <div className="panel-head"><h2>Change Password</h2></div>
        <div className="field">
          <label>New Password</label>
          <div style={{ position: "relative" }}>
            <input type={showPw ? "text" : "password"} value={pw} onChange={(e) => setPw(e.target.value)} style={{ paddingRight: 40 }} />
            <button type="button" onClick={() => setShowPw((v) => !v)} style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", border: "none", background: "none", cursor: "pointer", fontSize: 16 }}>{showPw ? "🙈" : "👁️"}</button>
          </div>
        </div>
        <button className="btn btn-primary" onClick={() => { if (pw.length < 5) { toast.error("Password too short"); return; } toast.success("Password changed"); setPw(""); }}>Change Password</button>
      </div>
    </div>
  );
}
