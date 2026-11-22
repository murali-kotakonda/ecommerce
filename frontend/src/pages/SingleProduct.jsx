import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { API_BASE_URL, resolveImageUrl } from "../Router/api";
import "../comp_css/Shop.css";
import axios from "axios";
import { useCart } from "../context/CartContext";

const PLACEHOLDER = "https://via.placeholder.com/300x200?text=No+Image";

const SingleProduct = () => {
  const navigate = useNavigate();
  const { quantityOf, addToCart, increase, decrease, isWishlisted, toggleWishlist } = useCart();
  const { productId } = useParams();
  const pid = Number(productId);
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios.get(`${API_BASE_URL}/ecom/products/${productId}`)
      .then((res) => setProduct(res.data)).catch(() => setProduct(null)).finally(() => setLoading(false));
    axios.get(`${API_BASE_URL}/ecom/products/${productId}/related?limit=4`)
      .then((res) => setRelated(res.data || [])).catch(() => setRelated([]));
  }, [productId]);

  if (loading) return <div className="shop"><div className="shop-wrap"><div className="skel" style={{ height: 360 }} /></div></div>;
  if (!product) return <div className="shop"><div className="shop-wrap shop-empty"><div className="ei">❓</div><h2>Product not found</h2><button className="sbtn sbtn-primary" onClick={() => navigate("/product")}>Back to Shop</button></div></div>;

  const hasDiscount = product.discountPrice && product.discountPrice > 0 && product.discountPrice < product.price;
  const outOfStock = product.stockQuantity != null && product.stockQuantity <= 0;
  const qty = quantityOf(pid);
  const atMax = product.stockQuantity != null && qty >= product.stockQuantity;
  const wished = isWishlisted(pid);

  return (
    <div className="shop">
      <div className="shop-wrap">
        <button className="sbtn sbtn-ghost" style={{ marginBottom: 16 }} onClick={() => navigate(-1)}>← Back</button>
        <div className="confirm-card" style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: 28 }}>
          <div className="pimg" style={{ height: 360, borderRadius: 12, overflow: "hidden", background: "#f3f4f6" }}>
            <img src={resolveImageUrl(product.imageUrl)} alt={product.name}
              onError={(e)=>{ if(e.currentTarget.src!==PLACEHOLDER){ console.warn("Image failed:", e.currentTarget.src); e.currentTarget.src=PLACEHOLDER; } }}
              style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          <div>
            <div className="pcat">{product.category}</div>
            <h1 style={{ margin: "6px 0 10px" }}>{product.name}</h1>
            {product.rating > 0 && <div className="prating" style={{ fontSize: 16 }}>{"★".repeat(Math.round(product.rating))}{"☆".repeat(5 - Math.round(product.rating))} ({product.rating})</div>}
            <div className="pprice" style={{ margin: "14px 0" }}>
              <span className="now" style={{ fontSize: 28 }}>INR {hasDiscount ? product.discountPrice : product.price}</span>
              {hasDiscount && <span className="was" style={{ fontSize: 18 }}>INR {product.price}</span>}
            </div>
            <p style={{ color: "var(--shop-muted)", lineHeight: 1.6 }}>{product.description}</p>
            {product.stockQuantity != null && (
              <p style={{ color: outOfStock ? "var(--shop-danger)" : "var(--shop-accent)", fontWeight: 600 }}>
                {outOfStock ? "Out of Stock" : `In Stock (${product.stockQuantity})`}
              </p>
            )}

            <div style={{ display: "flex", gap: 12, marginTop: 18, alignItems: "center" }}>
              {qty > 0 ? (
                <div className="qty-control" style={{ flex: "0 0 160px" }}>
                  <button onClick={() => decrease(pid)}>−</button>
                  <span>{qty}</span>
                  <button onClick={() => increase(pid)} disabled={atMax} title={atMax ? "Reached available stock" : ""}>+</button>
                </div>
              ) : (
                <button className="sbtn sbtn-primary" onClick={() => addToCart(pid)} disabled={outOfStock}>
                  {outOfStock ? "Out of Stock" : "Add to Cart"}
                </button>
              )}
              <button className="sbtn sbtn-ghost" onClick={() => toggleWishlist(pid)}>
                {wished ? "❤️ Wishlisted" : "🤍 Wishlist"}
              </button>
              {qty > 0 && <button className="sbtn sbtn-accent" onClick={() => navigate("/user/cart")}>Go to Cart</button>}
            </div>
            {qty > 0 && <p style={{ fontSize: 13, color: "var(--shop-muted)", marginTop: 8 }}>{qty} in your cart</p>}
          </div>
        </div>

        {related.length > 0 && (
          <>
            <h2 className="page-title" style={{ marginTop: 32, fontSize: 20 }}>Related Products</h2>
            <div className="pgrid">
              {related.map((p) => (
                <div className="pcard" key={p.productId}>
                  <div className="pimg">
                    <img src={resolveImageUrl(p.imageUrl)} alt={p.name}
                      onError={(e)=>{ if(e.currentTarget.src!==PLACEHOLDER){ e.currentTarget.src=PLACEHOLDER; } }}
                      onClick={() => navigate(`/product/${p.productId}`)} style={{ cursor: "pointer" }} />
                  </div>
                  <div className="pbody">
                    <div className="pcat">{p.category}</div>
                    <h3>{p.name}</h3>
                    <div className="pprice"><span className="now">INR {p.discountPrice && p.discountPrice > 0 ? p.discountPrice : p.price}</span></div>
                    <Link to={`/product/${p.productId}`}><button className="sbtn sbtn-ghost sbtn-block">View</button></Link>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SingleProduct;
