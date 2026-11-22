import { pageTitle } from "../config/brand";
import React, { useState, useEffect } from "react";
import api from "../Router/api";
import "../comp_css/Shop.css";
import Address from "./Address";
import UpdateAddress from "./UpdateAddress";
import { useToast } from "./admin/useToast";

const Profile = () => {
  const toast = useToast();
  const userid = localStorage.getItem("userid");
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addressModal, setAddressModal] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);
  const [editAddr, setEditAddr] = useState(null);
  const [reload, setReload] = useState(0);

  // change password state
  const [showPw, setShowPw] = useState(false);
  const [pw, setPw] = useState("");
  const [visible, setVisible] = useState(false);
  const [pwErr, setPwErr] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    document.title = pageTitle("My Profile");
    setLoading(true);
    api.get(`/ecom/customers/${userid}`)
      .then((res) => setProfile(res.data))
      .catch(() => setProfile(null))
      .finally(() => setLoading(false));
  }, [userid, reload]);

  const strength = (() => {
    let s = 0;
    if (pw.length >= 5) s++;
    if (/[A-Z]/.test(pw)) s++;
    if (/\d/.test(pw)) s++;
    if (/[^A-Za-z0-9]/.test(pw)) s++;
    return s;
  })();
  const strengthMeta = [
    { w: "0%", c: "#e5e7eb", t: "" },
    { w: "25%", c: "#ef4444", t: "Weak" },
    { w: "50%", c: "#f59e0b", t: "Fair" },
    { w: "75%", c: "#3b82f6", t: "Good" },
    { w: "100%", c: "#16a34a", t: "Strong" },
  ][pw ? strength : 0];

  const submitPw = (e) => {
    e.preventDefault();
    setPwErr("");
    if (pw.length < 5 || pw.length > 10) {
      setPwErr("Password must be between 5 and 10 characters");
      return;
    }
    setSaving(true);
    api.put(`/ecom/customers/update-password/${userid}`, { newPassword: pw })
      .then(() => {
        toast.success("Password updated successfully");
        setShowPw(false);
        setPw("");
      })
      .catch((err) => toast.error(err.response?.data?.message || "Could not update password"))
      .finally(() => setSaving(false));
  };

  if (loading) {
    return <div className="shop"><div className="shop-wrap"><div className="skel" style={{ height: 300 }} /></div></div>;
  }
  if (!profile) {
    return <div className="shop"><div className="shop-wrap shop-empty"><div className="ei">👤</div><h2>Could not load profile</h2></div></div>;
  }

  const initials = `${(profile.firstName || "U")[0] || ""}${(profile.lastName || "")[0] || ""}`.toUpperCase();
  const addresses = profile.address || [];
  const latest = addresses.length ? addresses[addresses.length - 1] : null;
  const active = profile.userAccountStatus === "ACTIVE";

  return (
    <div className="shop">
      <div className="shop-wrap">
        <h1 className="page-title">My Profile</h1>
        <div className="profile-wrap">
          <aside className="profile-side">
            <div className="avatar">{initials || "U"}</div>
            <h2>{profile.firstName} {profile.lastName}</h2>
            <div className="ps-email">{profile.email}</div>
            <span className={`status-pill ${active ? "" : "inactive"}`}>{profile.userAccountStatus}</span>
            <button className="sbtn sbtn-ghost sbtn-block" style={{ marginTop: 18 }} onClick={() => setShowPw((v) => !v)}>
              {showPw ? "Close" : "Change Password"}
            </button>
          </aside>

          <div className="profile-main">
            {showPw && (
              <div className="info-card">
                <h3>🔑 Change Password</h3>
                <form onSubmit={submitPw}>
                  <div className="pw-field">
                    <input
                      type={visible ? "text" : "password"}
                      placeholder="New password"
                      value={pw}
                      onChange={(e) => { setPwErr(""); setPw(e.target.value); }}
                    />
                    <button type="button" className="pw-toggle" onClick={() => setVisible((v) => !v)}>
                      {visible ? "🙈" : "👁️"}
                    </button>
                  </div>
                  {pw && (
                    <>
                      <div className="pw-strength"><div style={{ width: strengthMeta.w, background: strengthMeta.c }} /></div>
                      <div className="pw-hint">Strength: {strengthMeta.t || "—"}</div>
                    </>
                  )}
                  <div className="pw-hint">Must be 5-10 characters.</div>
                  {pwErr && <div className="pw-err">{pwErr}</div>}
                  <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
                    <button type="submit" className="sbtn sbtn-primary" disabled={saving}>
                      {saving ? "Saving..." : "Update Password"}
                    </button>
                    <button type="button" className="sbtn sbtn-ghost" onClick={() => { setShowPw(false); setPw(""); setPwErr(""); }}>
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="info-card">
              <h3>📋 Account Information</h3>
              <div className="info-grid">
                <div className="info-item"><div className="il">First Name</div><div className="iv">{profile.firstName || "-"}</div></div>
                <div className="info-item"><div className="il">Last Name</div><div className="iv">{profile.lastName || "-"}</div></div>
                <div className="info-item"><div className="il">Email</div><div className="iv">{profile.email}</div></div>
                <div className="info-item"><div className="il">Phone</div><div className="iv">{profile.phoneNumber || "-"}</div></div>
                <div className="info-item"><div className="il">Member Since</div><div className="iv">{profile.registerTime?.substring(0, 10) || "-"}</div></div>
                <div className="info-item"><div className="il">Status</div><div className="iv">{profile.userAccountStatus}</div></div>
              </div>
            </div>

            <div className="info-card">
              <h3>📍 Address</h3>
              {latest ? (
                <>
                  <div className="info-grid">
                    <div className="info-item"><div className="il">Building / Flat</div><div className="iv">{latest.flatNo}</div></div>
                    <div className="info-item"><div className="il">Street</div><div className="iv">{latest.street}</div></div>
                    <div className="info-item"><div className="il">City</div><div className="iv">{latest.city}</div></div>
                    <div className="info-item"><div className="il">State</div><div className="iv">{latest.state}</div></div>
                    <div className="info-item"><div className="il">Zip Code</div><div className="iv">{latest.zipCode}</div></div>
                  </div>
                  <button className="sbtn sbtn-ghost" style={{ marginTop: 16 }} onClick={() => { setEditAddr(latest); setUpdateModal(true); }}>
                    Update Address
                  </button>
                </>
              ) : (
                <div style={{ textAlign: "center", padding: "10px 0" }}>
                  <p style={{ color: "var(--shop-muted)" }}>No address added yet.</p>
                  <button className="sbtn sbtn-primary" onClick={() => setAddressModal(true)}>Add Address</button>
                </div>
              )}
            </div>
          </div>
        </div>

        {addressModal && <Address onclose={() => setAddressModal(false)} onSaved={() => setReload((r) => r + 1)} />}
        {updateModal && <UpdateAddress address={editAddr} onclose={() => setUpdateModal(false)} onSaved={() => setReload((r) => r + 1)} />}
      </div>
    </div>
  );
};

export default Profile;



