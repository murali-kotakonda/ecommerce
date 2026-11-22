import { BRAND } from "../config/brand";
import React from "react";
import { Link } from "react-router-dom";
import "../comp_css/Shop.css";

const Footer = () => (
  <footer className="site-footer">
    <div className="foot-top">
      <div className="foot-brand">
        <h3>{BRAND.logoMark} {BRAND.name}</h3>
        <p>Your trusted marketplace for quality products at fair prices, delivered fast to your doorstep.</p>
        <div className="socials">
          <a href="#" title="Facebook" aria-label="Facebook">📘</a>
          <a href="#" title="Twitter" aria-label="Twitter">🐦</a>
          <a href="#" title="Instagram" aria-label="Instagram">📷</a>
          <a href="#" title="LinkedIn" aria-label="LinkedIn">💼</a>
        </div>
      </div>

      <div className="foot-col">
        <h4>Company</h4>
        <ul>
          <li><Link to="/info/about">About Us</Link></li>
          <li><Link to="/info/contact">Contact Us</Link></li>
          <li><Link to="/info/help">Help Center</Link></li>
          <li><Link to="/info/faq">FAQs</Link></li>
        </ul>
      </div>

      <div className="foot-col">
        <h4>Policies</h4>
        <ul>
          <li><Link to="/info/privacy">Privacy Policy</Link></li>
          <li><Link to="/info/terms">Terms &amp; Conditions</Link></li>
          <li><Link to="/info/shipping">Shipping Policy</Link></li>
          <li><Link to="/info/refund">Returns &amp; Refunds</Link></li>
        </ul>
      </div>

      <div className="foot-col">
        <h4>Account</h4>
        <ul>
          <li><Link to="/user/order-details">My Orders</Link></li>
          <li><Link to="/product">Shop</Link></li>
          <li><Link to="/admin-login">Admin Access</Link></li>
        </ul>
      </div>
    </div>
    <div className="foot-bottom">
      © {new Date().getFullYear()} {BRAND.name}. All rights reserved.
    </div>
  </footer>
);

export default Footer;



