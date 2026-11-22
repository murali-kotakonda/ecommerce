import { BRAND } from "../config/brand";
import React, { useState } from "react";
import "../comp_css/AdminModern.css";
import { useNavigate } from "react-router-dom";

import Dashboard from "../components/admin/Dashboard";
import ProductsAdmin from "../components/admin/ProductsAdmin";
import AddProduct from "../components/AddProduct";
import CategoryManagement from "../components/admin/CategoryManagement";
import OrdersAdmin from "../components/admin/OrdersAdmin";
import CustomersAdmin from "../components/admin/CustomersAdmin";
import Inventory from "../components/admin/Inventory";
import Reports from "../components/admin/Reports";
import Reviews from "../components/admin/Reviews";
import Notifications from "../components/admin/Notifications";
import AuditLogs from "../components/admin/AuditLogs";
import Settings from "../components/admin/Settings";
import Banners from "../components/admin/Banners";
import Offers from "../components/admin/Offers";
import AdminProfile from "../components/admin/AdminProfile";

const GROUPS = [
  {
    label: "Main",
    items: [
      { key: "dashboard", label: "Dashboard", ico: "📊" },
      { key: "reports", label: "Reports & Analytics", ico: "📈" },
    ],
  },
  {
    label: "Catalog",
    items: [
      { key: "products", label: "Products", ico: "📦" },
      { key: "add-product", label: "Add Product", ico: "➕" },
      { key: "categories", label: "Categories", ico: "🗂" },
      { key: "inventory", label: "Inventory", ico: "📋" },
    ],
  },
  {
    label: "Sales",
    items: [
      { key: "orders", label: "Orders", ico: "🧾" },
      { key: "customers", label: "Customers", ico: "👥" },
      { key: "offers", label: "Promotions", ico: "🏷" },
    ],
  },
  {
    label: "Content & Feedback",
    items: [
      { key: "reviews", label: "Reviews", ico: "⭐" },
      { key: "banners", label: "Banners", ico: "🖼" },
      { key: "notifications", label: "Notifications", ico: "🔔" },
    ],
  },
  {
    label: "System",
    items: [
      { key: "audit", label: "Audit Logs", ico: "🗒" },
      { key: "settings", label: "Settings", ico: "⚙️" },
      { key: "profile", label: "Admin Profile", ico: "🧑‍💼" },
    ],
  },
];

const TITLES = {
  dashboard: "Dashboard", reports: "Reports & Analytics", products: "Products",
  "add-product": "Add Product", categories: "Categories", inventory: "Inventory",
  orders: "Orders", customers: "Customers", offers: "Promotional Offers",
  reviews: "Product Reviews", banners: "Banners", notifications: "Notifications",
  audit: "Audit Logs", settings: "Settings", profile: "Admin Profile",
};

const Admin = () => {
  const [selected, setSelected] = useState("dashboard");
  const navigate = useNavigate();
  const adminName = localStorage.getItem("name") || "Admin";

  const render = () => {
    switch (selected) {
      case "dashboard": return <Dashboard />;
      case "reports": return <Reports />;
      case "products": return <ProductsAdmin />;
      case "add-product": return <AddProduct />;
      case "categories": return <CategoryManagement />;
      case "inventory": return <Inventory />;
      case "orders": return <OrdersAdmin />;
      case "customers": return <CustomersAdmin />;
      case "offers": return <Offers />;
      case "reviews": return <Reviews />;
      case "banners": return <Banners />;
      case "notifications": return <Notifications />;
      case "audit": return <AuditLogs />;
      case "settings": return <Settings />;
      case "profile": return <AdminProfile />;
      default: return <Dashboard />;
    }
  };

  const logout = () => {
    localStorage.removeItem("adminid");
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("name");
    navigate("/admin-login");
  };

  return (
    <div className="admin-shell">
        <aside className="admin-sidebar">
          <div className="brand">{BRAND.logoPrefix}<span>{BRAND.logoSuffix}</span></div>
          <div style={{ flex: 1, overflowY: "auto" }}>
            {GROUPS.map((g) => (
              <div key={g.label}>
                <div style={{ padding: "14px 24px 6px", fontSize: 11, textTransform: "uppercase", letterSpacing: ".5px", color: "#6b7280" }}>{g.label}</div>
                <ul className="admin-nav" style={{ padding: 0 }}>
                  {g.items.map((item) => (
                    <li key={item.key} className={selected === item.key ? "active" : ""} onClick={() => setSelected(item.key)}>
                      <span className="ico">{item.ico}</span><span>{item.label}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <button className="admin-logout" onClick={logout}>Logout</button>
        </aside>

        <main className="admin-main">
          <header className="admin-topbar">
            <h1>{TITLES[selected]}</h1>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <span style={{ cursor: "pointer" }} onClick={() => setSelected("notifications")} title="Notifications">🔔</span>
              <div style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }} onClick={() => setSelected("profile")}>
                <div className="a-avatar" style={{ width: 34, height: 34, fontSize: 14 }}>{adminName[0]}</div>
                <span className="admin-user">{adminName}</span>
              </div>
            </div>
          </header>
          <section className="admin-content">{render()}</section>
        </main>
      </div>
  );
};

export default Admin;




