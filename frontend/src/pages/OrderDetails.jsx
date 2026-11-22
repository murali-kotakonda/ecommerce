import { pageTitle } from "../config/brand";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { resolveImageUrl } from "../Router/api";
import "../comp_css/Shop.css";
import { useToast } from "../components/admin/useToast";

const OrderDetails = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const userId = localStorage.getItem("userid");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    document.title = pageTitle("My Orders");
    setLoading(true);
    api
      .get(`/ecom/orders/orders/${userId}`)
      .then((res) => {
        const sorted = [...res.data].sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
        setOrders(sorted);
      })
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, [userId, refresh]);

  const cancelOrder = (orderId) => {
    if (!window.confirm("Cancel this order?")) return;
    api
      .delete(`/ecom/orders/users/${userId}/${orderId}`)
      .then(() => { toast.success("Order cancelled"); setRefresh((r) => r + 1); })
      .catch((e) => toast.error(e.response?.data?.message || "Could not cancel order"));
  };

  const canCancel = (s) => !["SHIPPED", "DELIVERED", "CANCELLED", "CANCELED"].includes(s);

  return (
    <div className="shop">
      <div className="shop-wrap">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h1 className="page-title">My Orders</h1>
          <button className="sbtn sbtn-ghost" onClick={() => navigate(`/user/profile/${userId}`)}>View Profile</button>
        </div>

        {loading ? (
          <div className="order-list">
            {[1, 2].map((i) => <div key={i} className="skel" style={{ height: 120 }} />)}
          </div>
        ) : orders.length === 0 ? (
          <div className="shop-empty">
            <div className="ei">📦</div>
            <h2>No orders yet</h2>
            <p>When you place an order, it will appear here.</p>
            <button className="sbtn sbtn-primary" onClick={() => navigate("/product")}>Start Shopping</button>
          </div>
        ) : (
          <div className="order-list">
            {orders.map((order, index) => {
              const isOpen = expanded === order.orderId;
              return (
                <div className="order-card" key={order.orderId}>
                  <div className="oc-head">
                    <h3>Order #{orders.length - index}</h3>
                    <span className={`ostatus ${order.status}`}>{order.status}</span>
                  </div>
                  <div className="oc-meta">
                    <div><b>Order ID:</b> {order.orderId}</div>
                    <div><b>Date:</b> {new Date(order.orderDate).toLocaleDateString()}</div>
                    <div><b>Items:</b> {order.orderItem?.length || 0}</div>
                    <div><b>Total:</b> INR {Number(order.totalAmount).toFixed(2)}</div>
                  </div>

                  {isOpen && (
                    <div style={{ borderTop: "1px solid var(--shop-border)", paddingTop: 12, marginBottom: 12 }}>
                      {order.orderItem?.map((it) => (
                        <div className="oitem-row" key={it.orderItemId}>
                          <img src={resolveImageUrl(it.product.imageUrl)} alt={it.product.name} onError={(e)=>{ if(e.currentTarget.src!=="https://via.placeholder.com/300x200?text=No+Image"){ console.warn("Image failed to load:", e.currentTarget.src); e.currentTarget.src="https://via.placeholder.com/300x200?text=No+Image"; } }} />
                          <div className="oi-name">
                            {it.product.name}
                            <div className="oi-qty">Qty: {it.quantity}</div>
                          </div>
                          <div style={{ fontWeight: 700 }}>
                            INR {Number(it.lineTotal ?? (it.product.price * it.quantity)).toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <button className="sbtn sbtn-ghost sbtn-sm" style={{ padding: "8px 14px" }}
                      onClick={() => setExpanded(isOpen ? null : order.orderId)}>
                      {isOpen ? "Hide Details" : "View Details"}
                    </button>
                    {canCancel(order.status) && (
                      <button className="sbtn sbtn-danger sbtn-sm" style={{ padding: "8px 14px" }}
                        onClick={() => cancelOrder(order.orderId)}>
                        Cancel Order
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetails;





