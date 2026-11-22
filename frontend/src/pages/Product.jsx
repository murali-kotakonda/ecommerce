import { pageTitle } from "../config/brand";
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import "../comp_css/Shop.css";
import { API_BASE_URL, resolveImageUrl } from "../Router/api";
import axios from "axios";
import { useCart } from "../context/CartContext";

const PLACEHOLDER = "https://via.placeholder.com/300x200?text=No+Image";

const Product = () => {
  const navigate = useNavigate();
  const { quantityOf, addToCart, increase, decrease, isWishlisted, toggleWishlist } = useCart();
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(searchParams.get("category") || "All");
  const [priceOrder, setPriceOrder] = useState("All");
  const [nameSearch, setNameSearch] = useState("");

  const applyFilters = (cat, order, search, data) => {
    let list = [...data];
    if (cat !== "All") list = list.filter((p) => p.category === cat);
    if (order === "LowToHigh") list.sort((a, b) => a.price - b.price);
    else if (order === "HighToLow") list.sort((a, b) => b.price - a.price);
    if (search) { const q = search.toLowerCase(); list = list.filter((p) => p.name.toLowerCase().includes(q)); }
    setFiltered(list);
  };

  useEffect(() => {
    document.title = pageTitle("Shop");
    setLoading(true);
    axios.get(`${API_BASE_URL}/ecom/products/all`)
      .then((res) => { setProducts(res.data); applyFilters(category, priceOrder, nameSearch, res.data); })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { applyFilters(category, priceOrder, nameSearch, products); /* eslint-disable-next-line */ }, [category, priceOrder, nameSearch]);

  useEffect(() => {
    import("../Router/api").then(({ default: api }) => {
      api.get("/ecom/categories")
        .then((res) => { const d = res.data?.data ?? res.data ?? []; setCategories((Array.isArray(d) ? d : []).filter((c) => c.active !== false)); })
        .catch(() => setCategories([]));
    });
  }, []);

  return (
    <div className="shop">
      <div className="shop-wrap">
        <h1 className="page-title">Shop Products</h1>
        <div className="shop-layout">
          <aside className="shop-filters">
            <h3>Filters</h3>
            <label>Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="All">All Categories</option>
              {categories.map((c) => <option key={c.categoryId} value={c.name}>{c.name}</option>)}
            </select>
            <label>Sort by Price</label>
            <select value={priceOrder} onChange={(e) => setPriceOrder(e.target.value)}>
              <option value="All">Default</option>
              <option value="LowToHigh">Low to High</option>
              <option value="HighToLow">High to Low</option>
            </select>
            <label>Search</label>
            <input type="text" placeholder="Search by name" value={nameSearch} onChange={(e) => setNameSearch(e.target.value)} />
          </aside>

          <section>
            {loading ? (
              <div className="pgrid">
                {[1,2,3,4,5,6].map((i) => (<div className="pcard" key={i}><div className="skel" style={{ height: 180 }} /><div className="pbody"><div className="skel" style={{ height: 16, width: "70%" }} /></div></div>))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="shop-empty"><div className="ei">🔍</div><h2>No products found</h2><p>Try adjusting your filters.</p></div>
            ) : (
              <div className="pgrid">
                {filtered.map((p) => {
                  const hasDiscount = p.discountPrice && p.discountPrice > 0 && p.discountPrice < p.price;
                  const outOfStock = p.stockQuantity != null && p.stockQuantity <= 0;
                  const lowStock = p.stockQuantity != null && p.stockQuantity > 0 && p.stockQuantity < 10;
                  const qty = quantityOf(p.productId);
                  const wished = isWishlisted(p.productId);
                  const atMax = p.stockQuantity != null && qty >= p.stockQuantity;
                  return (
                    <div className="pcard" key={p.productId}>
                      <div className="pimg">
                        {outOfStock ? <span className="disc-badge" style={{ background: "#6b7280" }}>OUT OF STOCK</span> : hasDiscount && <span className="disc-badge">SALE</span>}
                        <button className="wish-btn" title={wished ? "Remove from wishlist" : "Add to wishlist"} onClick={() => toggleWishlist(p.productId)}>
                          {wished ? "❤️" : "🤍"}
                        </button>
                        <img src={resolveImageUrl(p.imageUrl)} alt={p.name}
                          onError={(e)=>{ if(e.currentTarget.src!==PLACEHOLDER){ console.warn("Image failed:", e.currentTarget.src); e.currentTarget.src=PLACEHOLDER; } }}
                          onClick={() => navigate(`/product/${p.productId}`)} style={{ cursor: "pointer", opacity: outOfStock ? 0.6 : 1 }} />
                      </div>
                      <div className="pbody">
                        <div className="pcat">{p.category}</div>
                        <h3>{p.name}</h3>
                        {lowStock && <div style={{ fontSize: 12, color: "#d97706", fontWeight: 600, marginBottom: 6 }}>Only {p.stockQuantity} left!</div>}
                        <div className="pprice">
                          <span className="now">INR {hasDiscount ? p.discountPrice : p.price}</span>
                          {hasDiscount && <span className="was">INR {p.price}</span>}
                        </div>
                        <div className="pactions">
                          {qty > 0 ? (
                            <div className="qty-control">
                              <button onClick={() => decrease(p.productId)}>−</button>
                              <span>{qty}</span>
                              <button onClick={() => increase(p.productId)} disabled={atMax} title={atMax ? "Reached available stock" : ""}>+</button>
                            </div>
                          ) : (
                            <button className="sbtn sbtn-primary" onClick={() => addToCart(p.productId)} disabled={outOfStock}>
                              {outOfStock ? "Out of Stock" : "Add to Cart"}
                            </button>
                          )}
                          <Link to={`/product/${p.productId}`} style={{ flex: 1 }}>
                            <button className="sbtn sbtn-ghost" style={{ width: "100%" }}>View</button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default Product;
