import { pageTitle } from "../config/brand";
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { resolveImageUrl } from "../Router/api";
import "../comp_css/Shop.css";

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const data = state?.confirmation;

  useEffect(() => {
    document.title = pageTitle("Order Confirmed");
  }, []);

  // If the page is opened directly (no state), guide the user to order history.
  if (!data) {
    return (
      <div className="shop"><div className="shop-wrap shop-empty">
        <div className="ei">📦</div>
        <h2>No recent order to show</h2>
        <p>View your orders in order history.</p>
        <button className="sbtn sbtn-primary" onClick={() => navigate("/user/order-details")}>
          Go to Order History
        </button>
      </div></div>
    );
  }

  const items = data.items || [];
  const date = data.orderDate ? new Date(data.orderDate).toLocaleString() : "-";

  return (
    <div className="shop">
      <div className="shop-wrap confirm">
        <div className="confirm-hero">
          <div className="check">✓</div>
          <h1>Order Confirmed!</h1>
          <p>Thank you for your purchase. Your payment was successful.</p>
        </div>

        <div className="confirm-card">
          <h3>Order Details</h3>
          <div className="confirm-meta">
            <div className="m"><div className="k">Order ID</div><div className="v">#{data.orderId}</div></div>
            <div className="m"><div className="k">Order Date</div><div className="v">{date}</div></div>
            <div className="m"><div className="k">Order Status</div><div className="v">{data.orderStatus}</div></div>
            <div className="m">
              <div className="k">Payment</div>
              <div className="v"><span className="badge-paid">{data.paymentStatus}</span></div>
            </div>
            <div className="m"><div className="k">Payment ID</div><div className="v" style={{ fontSize: 13 }}>{data.paymentId}</div></div>
            <div className="m"><div className="k">Method</div><div className="v">{data.paymentMethod}</div></div>
          </div>
        </div>

        <div className="confirm-card">
          <h3>Items ({items.length})</h3>
          {items.map((it) => (
            <div className="oitem-row" key={it.productId}>
              <img src={resolveImageUrl(it.imageUrl)} alt={it.name} />
              <div className="oi-name">
                {it.name}
                <div className="oi-qty">Qty: {it.quantity} × INR {(it.unitPrice ?? 0).toFixed(2)}</div>
              </div>
              <div style={{ fontWeight: 700 }}>INR {(it.lineTotal ?? 0).toFixed(2)}</div>
            </div>
          ))}
          <div className="summary" style={{ boxShadow: "none", padding: "16px 0 0", position: "static" }}>
            <div className="srow"><span>Subtotal</span><span>INR {(data.subTotal ?? 0).toFixed(2)}</span></div>
            <div className="srow"><span>Tax</span><span>INR {(data.taxAmount ?? 0).toFixed(2)}</span></div>
            <div className="srow total"><span>Total Paid</span><span>INR {(data.totalAmount ?? 0).toFixed(2)}</span></div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <button className="sbtn sbtn-primary" onClick={() => navigate("/user/order-details")}>View My Orders</button>
          <button className="sbtn sbtn-ghost" onClick={() => navigate("/product")}>Continue Shopping</button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;



