import React, { useEffect, useState } from "react";
import api from "../../Router/api";

const StatCard = ({ ico, color, label, value, trend }) => (
  <div className="stat-card">
    <div className={`sc-ico ${color}`}>{ico}</div>
    <div>
      <div className="sc-label">{label}</div>
      <div className="sc-value">{value}</div>
      {trend && <div className="sc-trend">{trend}</div>}
    </div>
  </div>
);

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const p1 = api.get("/ecom/admin/dashboard").then((r) => setStats(r.data?.data ?? r.data)).catch(() => {});
    const p2 = api.get("/ecom/orders/all").then((r) => setOrders(r.data || [])).catch(() => setOrders([]));
    const p3 = api.get("/ecom/customers/get-all-customer").then((r) => setCustomers(r.data || [])).catch(() => setCustomers([]));
    Promise.allSettled([p1, p2, p3]).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="stat-grid">
        {[1, 2, 3, 4].map((i) => <div key={i} className="skeleton" style={{ height: 92 }} />)}
      </div>
    );
  }

  // Category count from dashboard not provided; derive via orders fallback or show mock.
  const recentOrders = [...orders].sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate)).slice(0, 5);
  const recentCustomers = [...customers].sort((a, b) => (b.userId || 0) - (a.userId || 0)).slice(0, 5);

  // Status breakdown for donut
  const statusCounts = orders.reduce((acc, o) => { acc[o.status] = (acc[o.status] || 0) + 1; return acc; }, {});
  const statusColors = { CREATED: "#f59e0b", CONFIRMED: "#2563eb", SHIPPED: "#6366f1", DELIVERED: "#16a34a", CANCELLED: "#e11d48", CANCELED: "#e11d48", PENDING: "#9ca3af" };
  const totalOrders = orders.length || 1;
  let acc = 0;
  const segments = Object.entries(statusCounts).map(([k, v]) => {
    const start = (acc / totalOrders) * 360; acc += v; const end = (acc / totalOrders) * 360;
    return `${statusColors[k] || "#9ca3af"} ${start}deg ${end}deg`;
  });
  const donutBg = segments.length ? `conic-gradient(${segments.join(",")})` : "#e5e7eb";

  // Mock 6-month revenue trend seeded from real total sales
  const base = (stats?.totalSales || 5000) / 6;
  const months = ["May", "Jun", "Jul", "Aug", "Sep", "Oct"];
  const revSeries = months.map((m, i) => ({ m, v: Math.round(base * (0.6 + (i * 0.14) + (i % 2 ? 0.1 : 0))) }));
  const maxRev = Math.max(...revSeries.map((r) => r.v), 1);

  return (
    <div>
      <div className="stat-grid">
        <StatCard ico="📦" color="ico-indigo" label="Total Products" value={stats?.productCount ?? "—"} trend="▲ in catalog" />
        <StatCard ico="🧾" color="ico-amber" label="Total Orders" value={stats?.orderCount ?? "—"} trend="▲ all time" />
        <StatCard ico="👥" color="ico-blue" label="Total Customers" value={stats?.userCount ?? "—"} trend="▲ registered" />
        <StatCard ico="💰" color="ico-green" label="Revenue" value={`INR ${Number(stats?.totalSales ?? 0).toFixed(0)}`} trend="▲ mock total" />
      </div>

      {/* Inventory visibility */}
      <div className="stat-grid">
        <StatCard ico="📊" color="ico-blue" label="Total Stock Units" value={stats?.totalStock ?? "—"} trend="across all products" />
        <StatCard ico="⚠️" color="ico-amber" label="Low Stock Products" value={stats?.lowStockCount ?? "—"} trend="under 10 units" />
        <StatCard ico="⛔" color="ico-pink" label="Out of Stock" value={stats?.outOfStockCount ?? "—"} trend="needs restock" />
      </div>

      <div className="dash-row">
        <div className="panel">
          <div className="panel-head"><h2>Revenue (last 6 months)</h2><span className="pill pill-gray">Simulated</span></div>
          <div className="bar-chart">
            {revSeries.map((r) => (
              <div className="bar-col" key={r.m}>
                <span className="bar-val">{(r.v / 1000).toFixed(1)}k</span>
                <div className="bar" style={{ height: `${(r.v / maxRev) * 100}%` }} />
                <span className="bar-label">{r.m}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="panel-head"><h2>Orders by Status</h2></div>
          {orders.length === 0 ? (
            <div className="empty-state"><div className="icon">🧾</div><p>No orders yet</p></div>
          ) : (
            <div className="donut-wrap">
              <div className="donut" style={{ background: donutBg }} />
              <div className="donut-legend">
                {Object.entries(statusCounts).map(([k, v]) => (
                  <div className="dl" key={k}>
                    <span className="dot" style={{ background: statusColors[k] || "#9ca3af" }} />
                    {k} · {v}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="two-col">
        <div className="panel">
          <div className="panel-head"><h2>Recent Orders</h2></div>
          {recentOrders.length === 0 ? (
            <div className="empty-state"><div className="icon">📭</div><p>No recent orders</p></div>
          ) : (
            <div className="table-scroll">
              <table className="atable">
                <thead><tr><th>Order</th><th>Customer</th><th>Status</th><th>Total</th></tr></thead>
                <tbody>
                  {recentOrders.map((o) => (
                    <tr key={o.orderId}>
                      <td>#{o.orderId}</td>
                      <td>{o.user?.firstName} {o.user?.lastName}</td>
                      <td><span className="pill pill-indigo">{o.status}</span></td>
                      <td>INR {Number(o.totalAmount).toFixed(0)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="panel">
          <div className="panel-head"><h2>Recent Customers</h2></div>
          {recentCustomers.length === 0 ? (
            <div className="empty-state"><div className="icon">👥</div><p>No customers yet</p></div>
          ) : (
            <div className="table-scroll">
              <table className="atable">
                <thead><tr><th></th><th>Name</th><th>Email</th><th>Status</th></tr></thead>
                <tbody>
                  {recentCustomers.map((c) => (
                    <tr key={c.userId}>
                      <td><div className="a-avatar" style={{ width: 34, height: 34, fontSize: 13 }}>{(c.firstName || "U")[0]}</div></td>
                      <td>{c.firstName} {c.lastName}</td>
                      <td>{c.email}</td>
                      <td><span className={`pill ${c.userAccountStatus === "ACTIVE" ? "pill-green" : "pill-red"}`}>{c.userAccountStatus}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
