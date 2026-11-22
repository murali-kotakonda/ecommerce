import { pageTitle } from "../config/brand";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { API_BASE_URL, resolveImageUrl } from "../Router/api";
import axios from "axios";
import "../comp_css/Shop.css";

const PROMOS = [
  { ico: "🚚", title: "Free Shipping", sub: "On all orders" },
  { ico: "↩️", title: "Easy Returns", sub: "7-day return policy" },
  { ico: "🔒", title: "Secure Payments", sub: "Safe & encrypted" },
  { ico: "⭐", title: "Top Quality", sub: "Curated products" },
];

const Home = () => {
  const navigate = useNavigate();
  const name = localStorage.getItem("name") || "there";
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = pageTitle("Home");
    api.get("/ecom/categories")
      .then((res) => {
        const data = res.data?.data ?? res.data ?? [];
        setCategories((Array.isArray(data) ? data : []).filter((c) => c.active !== false));
      })
      .catch(() => setCategories([]));

    axios.get(`${API_BASE_URL}/ecom/products/all`)
      .then((res) => setProducts(res.data || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  const featured = products.slice(0, 8);

  return (
    <div className="shop">
      <div className="shop-wrap">
        {/* Hero */}
        <div className="hero">
          <div className="hero-text">
            <h1>Welcome back, {name}! 👋</h1>
            <p>Discover fresh deals across groceries, essentials and more. Quality products delivered to your door.</p>
            <button className="sbtn" onClick={() => navigate("/product")}>Shop All Products →</button>
          </div>
          <div className="hero-emoji">🛍️</div>
        </div>

        {/* Trust strip */}
        <div className="promo-strip">
          {PROMOS.map((p) => (
            <div className="promo-card" key={p.title}>
              <span className="pc-ico">{p.ico}</span>
              <span>
                <div className="pc-title">{p.title}</div>
                <div className="pc-sub">{p.sub}</div>
              </span>
            </div>
          ))}
        </div>

        {/* Categories */}
        <div className="home-section">
          <div className="sec-head">
            <h2>Shop by Category</h2>
            <a onClick={() => navigate("/product")} style={{ cursor: "pointer" }}>View all →</a>
          </div>
          {categories.length === 0 ? (
            <div className="shop-empty" style={{ padding: 30 }}>No categories available yet.</div>
          ) : (
            <div className="cat-row">
              {categories.map((c) => (
                <div className="cat-tile" key={c.categoryId} onClick={() => navigate(`/product?category=${encodeURIComponent(c.name)}`)}>
                  <img
                    src={resolveImageUrl(c.imageUrl)}
                    alt={c.name}
                    onError={(e) => { e.currentTarget.src = `https://via.placeholder.com/300x200?text=${encodeURIComponent(c.name)}`; }}
                  />
                  <div className="ct-name">{c.name}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Featured products */}
        <div className="home-section">
          <div className="sec-head">
            <h2>Featured Products</h2>
            <a onClick={() => navigate("/product")} style={{ cursor: "pointer" }}>View all →</a>
          </div>
          {loading ? (
            <div className="pgrid">
              {[1, 2, 3, 4].map((i) => (
                <div className="pcard" key={i}>
                  <div className="skel" style={{ height: 180 }} />
                  <div className="pbody"><div className="skel" style={{ height: 16, width: "70%" }} /></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="pgrid">
              {featured.map((p) => {
                const hasDiscount = p.discountPrice && p.discountPrice > 0 && p.discountPrice < p.price;
                return (
                  <div className="pcard" key={p.productId}>
                    <div className="pimg">
                      {hasDiscount && <span className="disc-badge">SALE</span>}
                      <img src={resolveImageUrl(p.imageUrl)} alt={p.name} onError={(e)=>{ if(e.currentTarget.src!=="https://via.placeholder.com/300x200?text=No+Image"){ console.warn("Image failed to load:", e.currentTarget.src); e.currentTarget.src="https://via.placeholder.com/300x200?text=No+Image"; } }} onClick={() => navigate(`/product/${p.productId}`)} style={{ cursor: "pointer" }} />
                    </div>
                    <div className="pbody">
                      <div className="pcat">{p.category}</div>
                      <h3>{p.name}</h3>
                      <div className="pprice">
                        <span className="now">INR {hasDiscount ? p.discountPrice : p.price}</span>
                        {hasDiscount && <span className="was">INR {p.price}</span>}
                      </div>
                      <button className="sbtn sbtn-primary sbtn-block" onClick={() => navigate(`/product/${p.productId}`)}>View Product</button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;




