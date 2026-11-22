import React, { useEffect, useMemo, useState } from "react";
import api from "../../Router/api";

export default function CustomersAdmin() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [custOrders, setCustOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  useEffect(() => {
    api.get("/ecom/customers/get-all-customer")
      .then((r) => setCustomers(r.data || []))
      .catch(() => setCustomers([]))
      .finally(() => setLoading(false));
  }, []);

  const openCustomer = (c) => {
    setSelected(c);
    setOrdersLoading(true);
    setCustOrders([]);
    api.get(`/ecom/orders/orders/${c.userId}`)
      .then((r) => setCustOrders(r.data || []))
      .catch(() => setCustOrders([]))
      .finally(() => setOrdersLoading(false));
  };

  const filtered = useMemo(() => {
    let list = [...customers];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((c) =>
        `${c.firstName} ${c.lastName}`.toLowerCase().includes(q) ||
        (c.email || "").toLowerCase().includes(q));
    }
    return list;
  }, [customers, search]);

  const latestAddr = (c) => (c.address && c.address.length ? c.address[c.address.length - 1] : null);

  return (
    <div className="panel">
      <div className="panel-head"><h2>Customer Management</h2></div>
      <div className="toolbar">
        <input placeholder="Search by name or email" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {loading ? (
        <div className="skeleton" style={{ height: 240 }} />
      ) : filtered.length === 0 ? (
        <div className="empty-state"><div className="icon">👥</div><p>No customers found.</p></div>
      ) : (
        <div className="table-scroll">
          <table className="atable">
            <thead><tr><th></th><th>Name</th><th>Email</th><th>Phone</th><th>Joined</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.userId}>
                  <td><div className="a-avatar" style={{ width: 34, height: 34, fontSize: 13 }}>{(c.firstName || "U")[0]}</div></td>
                  <td>{c.firstName} {c.lastName}</td>
                  <td>{c.email}</td>
                  <td>{c.phoneNumber || "-"}</td>
                  <td>{c.registerTime?.substring(0, 10) || "-"}</td>
                  <td><span className={`pill ${c.userAccountStatus === "ACTIVE" ? "pill-green" : "pill-red"}`}>{c.userAccountStatus}</span></td>
                  <td><button className="btn btn-ghost btn-sm" onClick={() => openCustomer(c)}>View</button></td>
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
              <h2>Customer Profile</h2>
              <button className="close" onClick={() => setSelected(null)}>×</button>
            </div>
            <div className="modal-body">
              <div style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 16 }}>
                <div className="a-avatar" style={{ width: 56, height: 56, fontSize: 20 }}>{(selected.firstName || "U")[0]}</div>
                <div>
                  <h3 style={{ margin: 0 }}>{selected.firstName} {selected.lastName}</h3>
                  <div className="sc-label">{selected.email}</div>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
                <div><div className="sc-label">Phone</div><b>{selected.phoneNumber || "-"}</b></div>
                <div><div className="sc-label">Status</div><span className={`pill ${selected.userAccountStatus === "ACTIVE" ? "pill-green" : "pill-red"}`}>{selected.userAccountStatus}</span></div>
                <div><div className="sc-label">Joined</div><b>{selected.registerTime?.substring(0, 10) || "-"}</b></div>
                <div><div className="sc-label">Orders</div><b>{ordersLoading ? "…" : custOrders.length}</b></div>
              </div>

              {latestAddr(selected) && (
                <>
                  <h3 style={{ fontSize: 15 }}>Latest Address</h3>
                  <p style={{ fontSize: 14, color: "var(--admin-muted)" }}>
                    {latestAddr(selected).flatNo}, {latestAddr(selected).street}, {latestAddr(selected).city}, {latestAddr(selected).state} - {latestAddr(selected).zipCode}
                  </p>
                </>
              )}

              <h3 style={{ fontSize: 15, marginTop: 8 }}>Order History</h3>
              {ordersLoading ? (
                <div className="skeleton" style={{ height: 80 }} />
              ) : custOrders.length === 0 ? (
                <p style={{ color: "var(--admin-muted)", fontSize: 14 }}>No orders yet.</p>
              ) : (
                <div className="table-scroll">
                  <table className="atable">
                    <thead><tr><th>Order</th><th>Date</th><th>Status</th><th>Total</th></tr></thead>
                    <tbody>
                      {custOrders.map((o) => (
                        <tr key={o.orderId}>
                          <td>#{o.orderId}</td>
                          <td>{o.orderDate ? new Date(o.orderDate).toLocaleDateString() : "-"}</td>
                          <td><span className="pill pill-indigo">{o.status}</span></td>
                          <td>INR {Number(o.totalAmount).toFixed(0)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
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
