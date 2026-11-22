import { pageTitle } from "../config/brand";
import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { resolveImageUrl } from "../Router/api";
import "../comp_css/Shop.css";
import { useCart } from "../context/CartContext";

const PLACEHOLDER = "https://via.placeholder.com/300x200?text=No+Image";

const Cart = () => {
  const navigate = useNavigate();
  const { cart, increase, decrease, removeFromCart, emptyCart, refreshCart, quantityOf } = useCart();

  useEffect(() => { document.title = pageTitle("Cart"); refreshCart(); /* eslint-disable-next-line */ }, []);

  const items = cart.cartItems || [];
  const subTotal = cart.subTotal ?? 0;
  const tax = cart.taxAmount ?? 0;
  const total = cart.totalAmount ?? 0;

  return (
    <div className="shop">
      <div className="shop-wrap">
        <h1 className="page-title">Shopping Cart</h1>

        {items.length === 0 ? (
          <div className="shop-empty">
            <div className="ei">🛒</div>
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added anything yet.</p>
            <Link to="/product"><button className="sbtn sbtn-primary">Start Shopping</button></Link>
          </div>
        ) : (
          <div className="cart-grid">
            <div className="cart-items">
              {items.map((item) => {
                const pid = item.product.productId;
                const atMax = item.product.stockQuantity != null && item.quantity >= item.product.stockQuantity;
                return (
                  <div className="citem" key={item.cartItemId}>
                    <img src={resolveImageUrl(item.product.imageUrl)} alt={item.product.name}
                      onError={(e)=>{ if(e.currentTarget.src!==PLACEHOLDER){ e.currentTarget.src=PLACEHOLDER; } }} />
                    <div className="cinfo">
                      <h3>{item.product.name}</h3>
                      <div className="cmeta">{item.product.category}</div>
                      <div className="cqty">
                        <button onClick={() => decrease(pid)}>−</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => increase(pid)} disabled={atMax} title={atMax ? "Reached available stock" : ""}>+</button>
                        <button className="sbtn sbtn-ghost" style={{ marginLeft: 12, padding: "6px 12px" }} onClick={() => removeFromCart(pid)}>Remove</button>
                      </div>
                    </div>
                    <div className="cprice">INR {(item.product.price * item.quantity).toFixed(2)}</div>
                  </div>
                );
              })}
              <button className="sbtn sbtn-ghost" style={{ alignSelf: "flex-start" }} onClick={emptyCart}>Empty Cart</button>
            </div>

            <div className="summary">
              <h3>Order Summary</h3>
              <div className="srow"><span>Subtotal</span><span>INR {subTotal.toFixed(2)}</span></div>
              <div className="srow"><span>Tax (10%)</span><span>INR {tax.toFixed(2)}</span></div>
              <div className="srow"><span>Shipping</span><span style={{ color: "var(--shop-accent)" }}>FREE</span></div>
              <div className="srow total"><span>Total</span><span>INR {total.toFixed(2)}</span></div>
              <button className="sbtn sbtn-accent sbtn-block" onClick={() => navigate("/user/checkout")}>Proceed to Checkout →</button>
              <button className="sbtn sbtn-ghost sbtn-block" style={{ marginTop: 10 }} onClick={() => navigate("/product")}>Continue Shopping</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
