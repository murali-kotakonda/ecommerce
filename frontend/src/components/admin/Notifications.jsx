import React, { useState } from "react";

const MOCK = [
  { id: 1, ico: "🧾", title: "New order received", desc: "Order #1042 placed by Demo Customer", time: "2 min ago", unread: true },
  { id: 2, ico: "⚠️", title: "Low stock alert", desc: "Organic Tomato is running low (8 left)", time: "1 hr ago", unread: true },
  { id: 3, ico: "👤", title: "New customer registered", desc: "jane@ecom.com joined", time: "3 hrs ago", unread: false },
  { id: 4, ico: "💰", title: "Payment received", desc: "INR 1,240 for order #1041", time: "Yesterday", unread: false },
];

export default function Notifications() {
  const [items, setItems] = useState(MOCK);
  const markAll = () => setItems((i) => i.map((x) => ({ ...x, unread: false })));
  return (
    <div className="panel">
      <div className="panel-head">
        <h2>Notifications</h2>
        <button className="btn btn-ghost btn-sm" onClick={markAll}>Mark all read</button>
      </div>
      {items.map((n) => (
        <div key={n.id} style={{ display: "flex", gap: 14, padding: "14px 0", borderBottom: "1px solid var(--admin-border)", background: n.unread ? "#f9fafb" : "transparent", borderRadius: 8, paddingLeft: 10 }}>
          <div className="sc-ico ico-indigo" style={{ width: 42, height: 42, fontSize: 20 }}>{n.ico}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600 }}>{n.title} {n.unread && <span className="pill pill-blue" style={{ fontSize: 10 }}>NEW</span>}</div>
            <div className="sc-label">{n.desc}</div>
          </div>
          <div className="sc-label">{n.time}</div>
        </div>
      ))}
    </div>
  );
}
