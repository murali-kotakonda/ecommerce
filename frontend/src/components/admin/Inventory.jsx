import React, { useEffect, useMemo, useState } from "react";
import api, { resolveImageUrl } from "../../Router/api";

export default function Inventory() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    api.get("/ecom/products/all?sort=desc")
      .then((r) => setProducts(r.data || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  const stats = useMemo(() => {
    const out = products.filter((p) => (p.stockQuantity ?? 0) <= 0).length;
    const low = products.filter((p) => (p.stockQuantity ?? 0) > 0 && (p.stockQuantity ?? 0) < 10).length;
    const ok = products.length - out - low;
    return { out, low, ok };
  }, [products]);

  const filtered = products.filter((p) => {
    const q = p.stockQuantity ?? 0;
    if (filter === "out") return q <= 0;
    if (filter === "low") return q > 0 && q < 10;
    if (filter === "ok") return q >= 10;
    return true;
  });

  return (
    <div>
      <div className="stat-grid">
        <div className="stat-card"><div className="sc-ico ico-green">✅</div><div><div className="sc-label">In Stock</div><div className="sc-value">{stats.ok}</div></div></div>
        <div className="stat-card"><div className="sc-ico ico-amber">⚠️</div><div><div className="sc-label">Low Stock</div><div className="sc-value">{stats.low}</div></div></div>
        <div className="stat-card"><div className="sc-ico ico-pink">⛔</div><div><div className="sc-label">Out of Stock</div><div className="sc-value">{stats.out}</div></div></div>
      </div>

      <div className="panel">
        <div className="panel-head"><h2>Inventory</h2></div>
        <div className="toolbar">
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All items</option>
            <option value="ok">In stock</option>
            <option value="low">Low stock</option>
            <option value="out">Out of stock</option>
          </select>
        </div>
        {loading ? <div className="skeleton" style={{ height: 240 }} /> : (
          <div className="table-scroll">
            <table className="atable">
              <thead><tr><th></th><th>Product</th><th>Category</th><th>Stock</th><th>Status</th></tr></thead>
              <tbody>
                {filtered.map((p) => {
                  const q = p.stockQuantity ?? 0;
                  const cls = q <= 0 ? "pill-red" : q < 10 ? "pill-amber" : "pill-green";
                  const txt = q <= 0 ? "Out of stock" : q < 10 ? "Low" : "Healthy";
                  return (
                    <tr key={p.productId}>
                      <td><img className="t-img" src={resolveImageUrl(p.imageUrl)} alt={p.name} onError={(e)=>{ if(e.currentTarget.src!=="https://via.placeholder.com/300x200?text=No+Image"){ console.warn("Image failed to load:", e.currentTarget.src); e.currentTarget.src="https://via.placeholder.com/300x200?text=No+Image"; } }} /></td>
                      <td><b>{p.name}</b></td>
                      <td>{p.category}</td>
                      <td>{q}</td>
                      <td><span className={`pill ${cls}`}>{txt}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}


