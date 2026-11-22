import React, { useState } from "react";
import { useToast } from "./useToast";

const MOCK = [
  { id: 1, product: "Red Apple", user: "Demo Customer", rating: 5, comment: "Fresh and crunchy, loved it!", status: "APPROVED" },
  { id: 2, product: "Whole Milk 1L", user: "Jane Doe", rating: 4, comment: "Good quality, timely delivery.", status: "PENDING" },
  { id: 3, product: "Organic Tomato", user: "Demo Customer", rating: 2, comment: "A couple were bruised.", status: "PENDING" },
  { id: 4, product: "Brown Bread", user: "Jane Doe", rating: 5, comment: "Soft and tasty.", status: "APPROVED" },
];

export default function Reviews() {
  const toast = useToast();
  const [reviews, setReviews] = useState(MOCK);
  const act = (id, status) => {
    setReviews((rs) => rs.map((r) => (r.id === id ? { ...r, status } : r)));
    toast.success(`Review ${status.toLowerCase()}`);
  };
  return (
    <div className="panel">
      <div className="panel-head"><h2>Product Reviews</h2><span className="pill pill-gray">Mock data</span></div>
      <div className="table-scroll">
        <table className="atable">
          <thead><tr><th>Product</th><th>Customer</th><th>Rating</th><th>Comment</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {reviews.map((r) => (
              <tr key={r.id}>
                <td><b>{r.product}</b></td>
                <td>{r.user}</td>
                <td style={{ color: "#f59e0b" }}>{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</td>
                <td style={{ maxWidth: 240 }}>{r.comment}</td>
                <td><span className={`pill ${r.status === "APPROVED" ? "pill-green" : "pill-amber"}`}>{r.status}</span></td>
                <td style={{ whiteSpace: "nowrap" }}>
                  {r.status !== "APPROVED" && <button className="btn btn-ghost btn-sm" onClick={() => act(r.id, "APPROVED")}>Approve</button>}
                  <button className="btn btn-danger btn-sm" style={{ marginLeft: 6 }} onClick={() => act(r.id, "REJECTED")}>Reject</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
