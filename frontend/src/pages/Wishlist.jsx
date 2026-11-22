import { pageTitle } from "../config/brand";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { resolveImageUrl } from "../Router/api";
import "../comp_css/Shop.css";
import { useCart } from "../context/CartContext";

const PLACEHOLDER = "https://via.placeholder.com/300x200?text=No+Image";

const Wishlist = () => {
  const navigate = useNavigate();
  const { wishlist, refreshWishlist, removeFromWishlist, addToCart, quantityOf } = useCart();

  useEffect(() => { document.title = pageTitle("Wishlist"); refreshWishlist(); /* eslint-disable-next-line */ }, []);

  const moveToCart = async (pid) => {
    await addToCart(pid);
    await removeFromWishlist(pid);
  };

  return (
    <div className="shop">
      <div className="shop-wrap">
        <h1 className="page-title">My Wishlist</h1>

        {wishlist.length === 0 ? (
          <div className="shop-empty">
            <div className="ei">💛</div>
            <h2>Your wishlist is empty</h2>
            <p>Save products you love to buy them later.</p>
            <button className="sbtn sbtn-primary" onClick={() => navigate("/product")}>Browse Products</button>
          </div>
        ) : (
          <div className="wish-grid">
            {wishlist.map((w) => {
              const p = w.product;
              if (!p) return null;
              const outOfStock = p.stockQuantity != null && p.stockQuantity <= 0;
              const hasDiscount = p.discountPrice && p.discountPrice > 0 && p.discountPrice < p.price;
              return (
                <div className="wish-card" key={w.wishlistItemId}>
                  <img src={resolveImageUrl(p.imageUrl)} alt={p.name}
                    onError={(e)=>{ if(e.currentTarget.src!==PLACEHOLDER){ e.currentTarget.src=PLACEHOLDER; } }}
                    onClick={() => navigate(`/product/${p.productId}`)} style={{ cursor: "pointer" }} />
                  <div className="wc-body">
                    <div className="pcat">{p.category}</div>
                    <h3 style={{ margin: "4px 0 8px" }}>{p.name}</h3>
                    <div className="pprice">
                      <span className="now">INR {hasDiscount ? p.discountPrice : p.price}</span>
                      {hasDiscount && <span className="was">INR {p.price}</span>}
                    </div>
                    <div style={{ marginTop: 6, fontSize: 13, fontWeight: 600, color: outOfStock ? "var(--shop-danger)" : "var(--shop-accent)" }}>
                      {outOfStock ? "Out of Stock" : "In Stock"}
                    </div>
                  </div>
                  <div className="wc-actions">
                    <button className="sbtn sbtn-primary" onClick={() => moveToCart(p.productId)} disabled={outOfStock}>
                      Move to Cart
                    </button>
                    <button className="sbtn sbtn-ghost" onClick={() => removeFromWishlist(p.productId)}>Remove</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {wishlist.length > 0 && (
          <div style={{ marginTop: 20 }}>
            <button className="sbtn sbtn-ghost" onClick={() => navigate("/product")}>← Continue Shopping</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
