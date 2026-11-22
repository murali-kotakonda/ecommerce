import React, { useEffect, useState } from "react";
import api from "../../Router/api";

export default function Reports() {
  const [stats, setStats] = useState(null);
  useEffect(() => { api.get("/ecom/admin/dashboard").then((r) => setStats(r.data?.data ?? r.data)).catch(() => {}); }, []);

  const months = ["May", "Jun", "Jul", "Aug", "Sep", "Oct"];
  const base = (stats?.totalSales || 6000) / 6;
  const sales = months.map((m, i) => ({ m, v: Math.round(base * (0.5 + i * 0.16)) }));
  const maxV = Math.max(...sales.map((s) => s.v), 1);
  const topCats = [
    { n: "Fruits", v: 42 }, { n: "Vegetables", v: 27 }, { n: "Dairy", v: 19 }, { n: "Bakery", v: 12 },
  ];

  return (
    <div>
      <div className="panel" style={{ marginBottom: 20 }}>
        <div className="panel-head"><h2>Sales Trend</h2><span className="pill pill-gray">Simulated</span></div>
        <div className="bar-chart">
          {sales.map((s) => (
            <div className="bar-col" key={s.m}>
              <span className="bar-val">{(s.v / 1000).toFixed(1)}k</span>
              <div className="bar" style={{ height: `${(s.v / maxV) * 100}%` }} />
              <span className="bar-label">{s.m}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="two-col">
        <div className="panel">
          <div className="panel-head"><h2>Top Categories</h2></div>
          {topCats.map((c) => (
            <div key={c.n} style={{ margin: "12px 0" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, marginBottom: 4 }}><span>{c.n}</span><b>{c.v}%</b></div>
              <div className="pw-strength" style={{ height: 8 }}><div style={{ width: `${c.v}%`, background: "var(--admin-primary)" }} /></div>
            </div>
          ))}
        </div>
        <div className="panel">
          <div className="panel-head"><h2>Key Metrics</h2></div>
          <div className="stat-grid" style={{ marginBottom: 0 }}>
            <div className="stat-card"><div className="sc-ico ico-green">💰</div><div><div className="sc-label">Revenue</div><div className="sc-value" style={{ fontSize: 20 }}>INR {Number(stats?.totalSales ?? 0).toFixed(0)}</div></div></div>
            <div className="stat-card"><div className="sc-ico ico-amber">🧾</div><div><div className="sc-label">Orders</div><div className="sc-value" style={{ fontSize: 20 }}>{stats?.orderCount ?? "—"}</div></div></div>
          </div>
        </div>
      </div>
    </div>
  );
}
