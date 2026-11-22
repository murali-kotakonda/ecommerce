import { BRAND } from "../config/brand";
import React from "react";
import { useNavigate } from "react-router-dom";
import "../comp_css/Navbar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping, faSearch, faUser, faHeart } from "@fortawesome/free-solid-svg-icons";
import { useToast } from "./admin/useToast";
import { useCart } from "../context/CartContext";

const Navbar = () => {
  const iconstyle = { display: "flex", alignItems: "center", justifyContent: "space-between" };
  const navigate = useNavigate();
  const toast = useToast();
  const { cartCount, wishlistCount } = useCart();

  let userId = localStorage.getItem("userid");
  let name = localStorage.getItem("name");

  const handleLogoutClick = () => {
    localStorage.removeItem("userid");
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("cartid");
    localStorage.removeItem("name");
    toast.success("Logged out");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <h3 onClick={() => navigate("/")}>{BRAND.logoMark} {BRAND.name}</h3>
      </div>

      <div className="search-bar">
        <input type="text" placeholder="Search..." onClick={() => navigate("/product")} />
        <FontAwesomeIcon icon={faSearch} className="search-icon" />
      </div>

      <div className="iconbutton">
        <div style={iconstyle} onClick={() => navigate("/user/wishlist")} className="cart-button" title="Wishlist">
          <span className="nav-badge">
            <FontAwesomeIcon icon={faHeart} className="cart-icon" />
            {wishlistCount > 0 && <span className="count">{wishlistCount}</span>}
          </span>
          <p style={{ margin: "4px" }}>Wishlist</p>
        </div>

        <div style={iconstyle} onClick={() => navigate("/user/cart")} className="cart-button" title="Cart">
          <span className="nav-badge">
            <FontAwesomeIcon icon={faCartShopping} className="cart-icon" />
            {cartCount > 0 && <span className="count">{cartCount}</span>}
          </span>
          <p style={{ margin: "4px" }}>Cart</p>
        </div>

        {userId ? (
          <>
            <div style={iconstyle} className="login-button" onClick={() => navigate("/user/order-details")}>
              <FontAwesomeIcon icon={faUser} className="cart-icon" />
              {name}
            </div>
            <div onClick={handleLogoutClick} style={{ cursor: "pointer" }}>Logout</div>
          </>
        ) : (
          <>
            <div style={iconstyle} className="login-button" onClick={() => navigate("/login")}>
              <FontAwesomeIcon icon={faUser} className="cart-icon" />
              Login
            </div>
            <div className="iconbutton" onClick={() => navigate("/register-user")}>SignIn</div>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
