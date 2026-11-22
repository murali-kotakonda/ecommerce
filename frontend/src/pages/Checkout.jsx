import { pageTitle } from "../config/brand";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { resolveImageUrl } from "../Router/api";
import "../comp_css/Shop.css";
import { useToast } from "../components/admin/useToast";

const METHODS = [
  { id: "CREDIT_CARD", label: "Credit / Debit Card", sub: "Visa, Mastercard, Rupay", ico: "💳" },
  { id: "UPI", label: "UPI", sub: "GPay, PhonePe, Paytm", ico: "📱" },
  { id: "CASH", label: "Cash on Delivery", sub: "Pay when delivered", ico: "💵" },
];

const Checkout = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const cartId = localStorage.getItem("cartid");
  const userId = localStorage.getItem("userid");

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [method, setMethod] = useState("CREDIT_CARD");
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    document.title = pageTitle("Checkout");
    if (!cartId) { setLoading(false); return; }
    api
      .get(`/ecom/cart/products/${cartId}`)
      .then((res) => setCart(res.data))
      .catch(() => setCart(null))
      .finally(() => setLoading(false));
  }, [cartId]);

  const payNow = async () => {
    setPaying(true);
    try {
      // Backend runs mock payment first, then creates the order (atomic).
      const res = await api.post(`/ecom/checkout/${userId}?paymentMethod=${method}`);
      const data = res.data?.data ?? res.data;
      toast.success("Payment successful");
      localStorage.removeItem("cartid");
      // Pass the confirmation to the success page via router state.
      navigate("/user/order-confirmation", { state: { confirmation: data } });
    } catch (err) {
      toast.error(err.response?.data?.message || "Payment failed. Please try again.");
    } finally {
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <div className="shop"><div className="shop-wrap shop-loading">
        <div className="skel" style={{ height: 200, maxWidth: 600, margin: "0 auto" }} />
      </div></div>
    );
  }

  const items = cart?.cartItems || [];
  if (items.length === 0) {
    return (
      <div className="shop"><div className="shop-wrap shop-empty">
        <div className="ei">🛒</div>
        <h2>Your cart is empty</h2>
        <p>Add items before checking out.</p>
        <button className="sbtn sbtn-primary" onClick={() => navigate("/product")}>Browse Products</button>
      </div></div>
    );
  }

  const subTotal = cart.subTotal ?? 0;
  const tax = cart.taxAmount ?? 0;
  const total = cart.totalAmount ?? 0;

  return (
    <div className="shop">
      <div className="shop-wrap">
        <h1 className="page-title">Checkout</h1>
        <div className="cart-grid">
          <div>
            <div className="confirm-card">
              <h3>Select Payment Method</h3>
              <div className="pay-methods">
                {METHODS.map((m) => (
                  <label key={m.id} className={`pay-option ${method === m.id ? "selected" : ""}`}>
                    <input
                      type="radio"
                      name="pay"
                      value={m.id}
                      checked={method === m.id}
                      onChange={() => setMethod(m.id)}
                    />
                    <span className="pm-ico">{m.ico}</span>
                    <span>
                      <div className="pm-label">{m.label}</div>
                      <div className="pm-sub">{m.sub}</div>
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="confirm-card">
              <h3>Order Items ({items.length})</h3>
              {items.map((it) => (
                <div className="oitem-row" key={it.cartItemId}>
                  <img src={resolveImageUrl(it.product.imageUrl)} alt={it.product.name} onError={(e)=>{ if(e.currentTarget.src!=="https://via.placeholder.com/300x200?text=No+Image"){ console.warn("Image failed to load:", e.currentTarget.src); e.currentTarget.src="https://via.placeholder.com/300x200?text=No+Image"; } }} />
                  <div className="oi-name">
                    {it.product.name}
                    <div className="oi-qty">Qty: {it.quantity}</div>
                  </div>
                  <div style={{ fontWeight: 700 }}>INR {(it.product.price * it.quantity).toFixed(2)}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="summary">
            <h3>Order Summary</h3>
            <div className="srow"><span>Subtotal</span><span>INR {subTotal.toFixed(2)}</span></div>
            <div className="srow"><span>Tax (10%)</span><span>INR {tax.toFixed(2)}</span></div>
            <div className="srow"><span>Shipping</span><span style={{ color: "var(--shop-accent)" }}>FREE</span></div>
            <div className="srow total"><span>Total</span><span>INR {total.toFixed(2)}</span></div>
            <button className="sbtn sbtn-accent sbtn-block" onClick={payNow} disabled={paying}>
              {paying ? "Processing payment..." : `Pay Now · INR ${total.toFixed(2)}`}
            </button>
            <button className="sbtn sbtn-ghost sbtn-block" style={{ marginTop: 10 }} onClick={() => navigate("/user/cart")}>
              Back to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;





