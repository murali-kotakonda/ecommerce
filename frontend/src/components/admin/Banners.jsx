import React, { useState } from "react";
import { useToast } from "./useToast";

const INIT = [
  { id: 1, title: "Freedom Sale", sub: "Up to 50% off", img: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600", active: true },
  { id: 2, title: "Fresh Fruits", sub: "Farm to table", img: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=600", active: true },
  { id: 3, title: "Dairy Deals", sub: "Daily essentials", img: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600", active: false },
];

export default function Banners() {
  const toast = useToast();
  const [banners, setBanners] = useState(INIT);
  const toggle = (id) => { setBanners((b) => b.map((x) => x.id === id ? { ...x, active: !x.active } : x)); toast.success("Banner updated"); };
  const remove = (id) => { setBanners((b) => b.filter((x) => x.id !== id)); toast.success("Banner removed"); };

  return (
    <div className="panel">
      <div className="panel-head"><h2>Banner Management</h2><span className="pill pill-gray">Mock data</span></div>
      <div className="cat-grid">
        {banners.map((b) => (
          <div className="cat-card" key={b.id}>
            <div className="thumb"><img src={b.img} alt={b.title} /><span className={`badge ${b.active ? "badge-active" : "badge-inactive"}`}>{b.active ? "Live" : "Hidden"}</span></div>
            <div className="body"><h3>{b.title}</h3><p>{b.sub}</p></div>
            <div className="actions">
              <button className="btn btn-ghost btn-sm" onClick={() => toggle(b.id)}>{b.active ? "Hide" : "Show"}</button>
              <button className="btn btn-danger btn-sm" onClick={() => remove(b.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
