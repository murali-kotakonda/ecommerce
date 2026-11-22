import React, { useEffect, useMemo, useState } from "react";
import api, { resolveImageUrl } from "../../Router/api";
import UpdateProductForm from "../UpdateProductForm";
import { useToast } from "./useToast";

const PAGE_SIZE = 8;

export default function ProductsAdmin() {
  const toast = useToast();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("All");
  const [sort, setSort] = useState("new");
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState(null);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    setLoading(true);
    api.get("/ecom/products/all?sort=desc")
      .then((r) => setProducts(r.data || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [refresh]);

  const categories = useMemo(() => ["All", ...new Set(products.map((p) => p.category).filter(Boolean))], [products]);

  const filtered = useMemo(() => {
    let list = [...products];
    if (cat !== "All") list = list.filter((p) => p.category === cat);
    if (search) { const q = search.toLowerCase(); list = list.filter((p) => p.name.toLowerCase().includes(q)); }
    if (sort === "priceLow") list.sort((a, b) => a.price - b.price);
    else if (sort === "priceHigh") list.sort((a, b) => b.price - a.price);
    else if (sort === "name") list.sort((a, b) => a.name.localeCompare(b.name));
    else list.sort((a, b) => b.productId - a.productId);
    return list;
  }, [products, cat, search, sort]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  useEffect(() => { if (page > pageCount) setPage(1); }, [pageCount, page]);

  const handleUpdate = (updated) => {
    api.put(`/ecom/products/update/${updated.productId}`, updated)
      .then(() => { toast.success("Product updated"); setEditing(null); setRefresh((r) => r + 1); })
      .catch((e) => toast.error(e.response?.data?.message || "Update failed"));
  };

  const del = (id) => {
    if (!window.confirm("Delete this product?")) return;
    api.delete(`/ecom/products/${id}`)
      .then(() => { toast.success("Product deleted"); setProducts((p) => p.filter((x) => x.productId !== id)); })
      .catch((e) => toast.error(e.response?.data?.message || "Delete failed"));
  };

  const stockPill = (p) => {
    const q = p.stockQuantity;
    if (q == null) return <span className="pill pill-gray">N/A</span>;
    if (q <= 0) return <span className="pill pill-red">Out of stock</span>;
    if (q < 10) return <span className="pill pill-amber">Low · {q}</span>;
    return <span className="pill pill-green">In stock · {q}</span>;
  };

  return (
    <div className="panel">
      <div className="panel-head"><h2>Product Management</h2></div>

      <div className="toolbar">
        <input placeholder="Search products" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
        <select value={cat} onChange={(e) => { setCat(e.target.value); setPage(1); }}>
          {categories.map((c) => <option key={c}>{c}</option>)}
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="new">Newest</option>
          <option value="name">Name A-Z</option>
          <option value="priceLow">Price: Low to High</option>
          <option value="priceHigh">Price: High to Low</option>
        </select>
      </div>

      {loading ? (
        <div className="skeleton" style={{ height: 300 }} />
      ) : filtered.length === 0 ? (
        <div className="empty-state"><div className="icon">📦</div><p>No products match your filters.</p></div>
      ) : (
        <>
          <div className="table-scroll">
            <table className="atable">
              <thead><tr><th></th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th><th></th></tr></thead>
              <tbody>
                {pageItems.map((p) => (
                  <tr key={p.productId}>
                    <td><img className="t-img" src={resolveImageUrl(p.imageUrl)} alt={p.name} onError={(e)=>{ if(e.currentTarget.src!=="https://via.placeholder.com/300x200?text=No+Image"){ console.warn("Image failed to load:", e.currentTarget.src); e.currentTarget.src="https://via.placeholder.com/300x200?text=No+Image"; } }} /></td>
                    <td><b>{p.name}</b><div className="sc-label">#{p.productId}</div></td>
                    <td>{p.category}</td>
                    <td>INR {p.discountPrice && p.discountPrice > 0 ? p.discountPrice : p.price}</td>
                    <td>{stockPill(p)}</td>
                    <td><span className={`pill ${p.active !== false ? "pill-green" : "pill-gray"}`}>{p.active !== false ? "Active" : "Inactive"}</span></td>
                    <td style={{ whiteSpace: "nowrap" }}>
                      <button className="btn btn-ghost btn-sm" onClick={() => setEditing(p)}>Edit</button>
                      <button className="btn btn-danger btn-sm" style={{ marginLeft: 6 }} onClick={() => del(p.productId)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pageCount > 1 && (
            <div className="pager">
              <button disabled={page === 1} onClick={() => setPage(page - 1)}>‹</button>
              {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
                <button key={n} className={n === page ? "active" : ""} onClick={() => setPage(n)}>{n}</button>
              ))}
              <button disabled={page === pageCount} onClick={() => setPage(page + 1)}>›</button>
            </div>
          )}
        </>
      )}

      {editing && (
        <UpdateProductForm product={editing} onUpdate={handleUpdate} onClose={() => setEditing(null)} />
      )}
    </div>
  );
}


