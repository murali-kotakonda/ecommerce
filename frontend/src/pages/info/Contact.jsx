import React, { useState } from "react";
import "../../comp_css/Shop.css";
import { useToast } from "../../components/admin/useToast";

const Contact = () => {
  const toast = useToast();
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const submit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    // Mock submission (no backend needed for this page).
    toast.success("Thanks! Your message has been received.");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="shop">
      <div className="shop-wrap info-page">
        <div className="info-hero">
          <h1>Contact Us</h1>
          <p>We would love to hear from you. Reach out anytime.</p>
        </div>
        <div className="info-body">
          <div className="contact-grid">
            <div className="contact-box"><div className="cb-ico">📧</div><div className="cb-t">Email</div><div className="cb-v">support@ecommerse.com</div></div>
            <div className="contact-box"><div className="cb-ico">📞</div><div className="cb-t">Phone</div><div className="cb-v">1800-123-4567</div></div>
            <div className="contact-box"><div className="cb-ico">📍</div><div className="cb-t">Address</div><div className="cb-v">MG Road, Pune, India</div></div>
          </div>

          <h2 style={{ marginTop: 28 }}>Send us a message</h2>
          <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 14, maxWidth: 520 }}>
            <input className="pw-field" style={{ padding: 11, border: "1px solid var(--shop-border)", borderRadius: 10 }}
              placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input style={{ padding: 11, border: "1px solid var(--shop-border)", borderRadius: 10 }}
              placeholder="Your email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <textarea rows={4} style={{ padding: 11, border: "1px solid var(--shop-border)", borderRadius: 10, fontFamily: "inherit" }}
              placeholder="Your message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
            <button type="submit" className="sbtn sbtn-primary" style={{ alignSelf: "flex-start" }}>Send Message</button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default Contact;
