import React from "react";

const LOGS = [
  { who: "admin@ecom.com", action: "Created product 'Green Grapes'", time: "2026-10-27 09:12", type: "CREATE" },
  { who: "admin@ecom.com", action: "Updated category 'Dairy'", time: "2026-10-27 08:40", type: "UPDATE" },
  { who: "system", action: "Order #1042 status -> CONFIRMED", time: "2026-10-27 08:15", type: "SYSTEM" },
  { who: "admin@ecom.com", action: "Deleted product 'Old SKU'", time: "2026-10-26 18:22", type: "DELETE" },
  { who: "admin@ecom.com", action: "Logged in", time: "2026-10-26 18:01", type: "AUTH" },
];
const cls = { CREATE: "pill-green", UPDATE: "pill-blue", DELETE: "pill-red", SYSTEM: "pill-gray", AUTH: "pill-indigo" };

export default function AuditLogs() {
  return (
    <div className="panel">
      <div className="panel-head"><h2>Activity / Audit Logs</h2><span className="pill pill-gray">Mock data</span></div>
      <div className="table-scroll">
        <table className="atable">
          <thead><tr><th>Actor</th><th>Action</th><th>Type</th><th>Timestamp</th></tr></thead>
          <tbody>
            {LOGS.map((l, i) => (
              <tr key={i}>
                <td>{l.who}</td>
                <td>{l.action}</td>
                <td><span className={`pill ${cls[l.type]}`}>{l.type}</span></td>
                <td>{l.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
