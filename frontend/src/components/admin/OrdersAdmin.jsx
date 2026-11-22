import React, { useEffect, useMemo, useState } from "react";
import api from "../../Router/api";
import { useToast } from "./useToast";

const STATUS_FLOW = ["CREATED", "CONFIRMED", "SHIPPED", "DELIVERED"];

export default function OrdersAdmin() {
  const toast = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

  const load = () => {
    setLoading(true);
    api.get("/ecom/orders/all")
      .then((r) => setOrders(r.data || []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const filtered = useMemo(() => {
    let list = [...orders].sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
    if (statusFilter !== "All") list = list.filter((o) => o.status === statusFilter);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((o) =>
        String(o.orderId).includes(q) ||
        `${o.user?.firstName} ${o.user?.lastName}`.toLowerCase().includes(q));
    }
    return list;
  }, [orders, statusFilter, search]);

  const pillClass = (s) => ({
    CREATED: "pill-amber", CONFIRMED: "pill-blue", SHIPPED: "pill-indigo",
    DELIVERED: "pill-green", CANCELLED: "pill-red", CANCELED: "pill-red", PENDING: "pill-gray",
  }[s] || "pill-gray");

  // Build a mock status timeline for the detail drawer based on current status.
  const buildTimeline = (order) => {
    const reached = STATUS_FLOW.indexOf(order.status);
    const base = order.orderDate ? new Date(order.orderDate) : new Date();
    return STATUS_FLOW.map((st, i) => ({
      title: st,
      done: i <= (reached === -1 ? 0 : reached),
      time: i <= (reached === -1 ? 0 : reached)
        ? new Date(base.getTime() + i * 86400000).toLocaleDateString()
        : "Pending",
    }));
  };

  return (
    <div className="panel">
      <div className="panel-head"><h2>Order Management</h2></div>

      <div className="toolbar">
        <input placeholder="Search by order id or customer" value={search} onChange={(e) => setSearch(e.target.value)} />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="All">All statuses</option>
          {["CREATED", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"].map((s) => <option key={s}>{s}</option>)}
        </select>
        <button className="btn btn-ghost" onClick={load}>↻ Refresh</button>
      </div>

      {loading ? (
        <div className="skeleton" style={{ height: 240 }} />
      ) : filtered.length === 0 ? (
        <div className="empty-state"><div className="icon">🧾</div><p>No orders match your filters.</p></div>
      ) : (
        <div className="table-scroll">
          <table className="atable">
            <thead><tr><th>Order</th><th>Customer</th><th>Date</th><th>Items</th><th>Total</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {filtered.map((o) => (
                <tr key={o.orderId}>
                  <td>#{o.orderId}</td>
                  <td>{o.user?.firstName} {o.user?.lastName}</td>
                  <td>{o.orderDate ? new Date(o.orderDate).toLocaleDateString() : "-"}</td>
                  <td>{o.orderItem?.length || 0}</td>
                  <td>INR {Number(o.totalAmount).toFixed(0)}</td>
                  <td><span className={`pill ${pillClass(o.status)}`}>{o.status}</span></td>
                  <td><button className="btn btn-ghost btn-sm" onClick={() => setSelected(o)}>View</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal" style={{ maxWidth: 560 }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h2>Order #{selected.orderId}</h2>
              <button className="close" onClick={() => setSelected(null)}>×</button>
            </div>
            <div className="modal-body">
              <div className="info-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
                <div><div className="sc-label">Customer</div><b>{selected.user?.firstName} {selected.user?.lastName}</b></div>
                <div><div className="sc-label">Phone</div><b>{selected.user?.phoneNumber || "-"}</b></div>
                <div><div className="sc-label">Status</div><span className={`pill ${pillClass(selected.status)}`}>{selected.status}</span></div>
                <div><div className="sc-label">Total</div><b>INR {Number(selected.totalAmount).toFixed(2)}</b></div>
              </div>

              <h3 style={{ fontSize: 15 }}>Status Timeline</h3>
              <ul className="timeline">
                {buildTimeline(selected).map((t) => (
                  <li key={t.title} className={t.done ? "done" : ""}>
                    <span className="tl-dot" />
                    <div className="tl-title">{t.title}</div>
                    <div className="tl-time">{t.time}</div>
                  </li>
                ))}
              </ul>

              <h3 style={{ fontSize: 15, marginTop: 16 }}>Items</h3>
              {selected.orderItem?.map((it) => (
                <div key={it.orderItemId} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--admin-border)" }}>
                  <span>{it.product?.name} × {it.quantity}</span>
                  <b>INR {Number(it.lineTotal ?? (it.product?.price * it.quantity)).toFixed(2)}</b>
                </div>
              ))}

              {selected.payment && (
                <>
                  <h3 style={{ fontSize: 15, marginTop: 16 }}>Payment</h3>
                  <p style={{ fontSize: 14, color: "var(--admin-muted)" }}>
                    {selected.payment.paymentMethod} · {selected.payment.paymentStatus} · INR {selected.payment.paymentAmount}
                  </p>
                </>
              )}
            </div>
            <div className="modal-foot">
              <button className="btn btn-ghost" onClick={() => setSelected(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
