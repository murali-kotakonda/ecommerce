import React, { useState } from "react";
import { useToast } from "./useToast";

export default function Settings() {
  const toast = useToast();
  const [cfg, setCfg] = useState({
    emailNotif: true, lowStockAlerts: true, autoConfirm: false,
    maintenance: false, storeName: "E-Commerce", currency: "INR",
    taxRate: 10, freeShipping: true,
  });
  const toggle = (k) => setCfg((c) => ({ ...c, [k]: !c[k] }));
  const save = () => toast.success("Settings saved");

  const Toggle = ({ k, label, desc }) => (
    <div className="setting-row">
      <div><div style={{ fontWeight: 600 }}>{label}</div><div className="sc-label">{desc}</div></div>
      <label className="switch"><input type="checkbox" checked={cfg[k]} onChange={() => toggle(k)} /><span className="slider" /></label>
    </div>
  );

  return (
    <div className="two-col">
      <div className="panel">
        <div className="panel-head"><h2>Store Settings</h2></div>
        <div className="field"><label>Store Name</label><input type="text" value={cfg.storeName} onChange={(e) => setCfg({ ...cfg, storeName: e.target.value })} /></div>
        <div className="field"><label>Currency</label>
          <select value={cfg.currency} onChange={(e) => setCfg({ ...cfg, currency: e.target.value })}>
            <option>INR</option><option>USD</option><option>EUR</option>
          </select>
        </div>
        <div className="field"><label>Tax Rate (%)</label><input type="number" value={cfg.taxRate} onChange={(e) => setCfg({ ...cfg, taxRate: e.target.value })} /></div>
        <Toggle k="freeShipping" label="Free Shipping" desc="Offer free shipping on all orders" />
        <button className="btn btn-primary" style={{ marginTop: 14 }} onClick={save}>Save Settings</button>
      </div>
      <div className="panel">
        <div className="panel-head"><h2>Preferences</h2></div>
        <Toggle k="emailNotif" label="Email Notifications" desc="Receive emails for new orders" />
        <Toggle k="lowStockAlerts" label="Low Stock Alerts" desc="Warn when stock runs low" />
        <Toggle k="autoConfirm" label="Auto-confirm Orders" desc="Confirm paid orders automatically" />
        <Toggle k="maintenance" label="Maintenance Mode" desc="Temporarily disable storefront" />
        <button className="btn btn-primary" style={{ marginTop: 14 }} onClick={save}>Save Preferences</button>
      </div>
    </div>
  );
}
