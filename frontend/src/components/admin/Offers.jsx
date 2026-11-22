import React, { useState } from "react";
import { useToast } from "./useToast";

const INIT = [
  { id: 1, code: "WELCOME10", desc: "10% off first order", type: "Percent", value: "10%", active: true },
  { id: 2, code: "FREESHIP", desc: "Free shipping", type: "Shipping", value: "Free", active: true },
  { id: 3, code: "FLAT50", desc: "INR 50 off above 500", type: "Flat", value: "INR 50", active: false },
];

export default function Offers() {
  const toast = useToast();
  const [offers, setOffers] = useState(INIT);
  const toggle = (id) => { setOffers((o) => o.map((x) => x.id === id ? { ...x, active: !x.active } : x)); toast.success("Offer updated"); };

  return (
    <div className="panel">
      <div className="panel-head"><h2>Promotional Offers</h2><span className="pill pill-gray">Mock data</span></div>
      <div className="table-scroll">
        <table className="atable">
          <thead><tr><th>Code</th><th>Description</th><th>Type</th><th>Value</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {offers.map((o) => (
              <tr key={o.id}>
                <td><span className="pill pill-indigo">{o.code}</span></td>
                <td>{o.desc}</td>
                <td>{o.type}</td>
                <td><b>{o.value}</b></td>
                <td><span className={`pill ${o.active ? "pill-green" : "pill-gray"}`}>{o.active ? "Active" : "Inactive"}</span></td>
                <td><button className="btn btn-ghost btn-sm" onClick={() => toggle(o.id)}>{o.active ? "Disable" : "Enable"}</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
