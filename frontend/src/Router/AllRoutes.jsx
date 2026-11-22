import React from "react";
import Home from "../pages/Home";
import Product from "../pages/Product";
import Profile from "../components/Profile";
import OrderDetails from "../pages/OrderDetails";
import Checkout from "../pages/Checkout";
import OrderConfirmation from "../pages/OrderConfirmation";
import Login from "../pages/LogIn";
import AdminLogin from "../pages/AdminLogIn";
import Registration from "../pages/Registration";
import SingleProduct from "../pages/SingleProduct";
import Cart from "../pages/Cart";
import Wishlist from "../pages/Wishlist";
import { Routes, Route } from "react-router-dom";
import { Privateroute, Privaterouteadmin } from "../Router/ProtectedRoute";
import Admin from "../pages/Admin";
import NotFound from "../components/NotFound";

// Footer / informational pages
import About from "../pages/info/About";
import Contact from "../pages/info/Contact";
import FAQ from "../pages/info/FAQ";
import HelpCenter from "../pages/info/HelpCenter";
import Privacy from "../pages/info/Privacy";
import Terms from "../pages/info/Terms";
import Shipping from "../pages/info/Shipping";
import Refund from "../pages/info/Refund";

const AllRoutes = () => {
  return (
    <Routes>
      {/* Public: only authentication screens are reachable when logged out */}
      <Route path="/login" element={<Login />} />
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/register-user" element={<Registration />} />

      {/* Shopping requires a successful customer login */}
      <Route element={<Privateroute />}>
        <Route path="/" element={<Home />} />
        <Route path="/product" element={<Product />} />
        <Route path="/products" element={<Product />} />
        <Route path="/product/:productId" element={<SingleProduct />} />

        <Route path="/user/cart" element={<Cart />} />
        <Route path="/user/wishlist" element={<Wishlist />} />
        <Route path="/user/checkout" element={<Checkout />} />
        <Route path="/user/order-confirmation" element={<OrderConfirmation />} />
        <Route path="/user/order-details" element={<OrderDetails />} />
        <Route path="/user/profile/:userid" element={<Profile />} />

        {/* Informational / footer pages */}
        <Route path="/info/about" element={<About />} />
        <Route path="/info/contact" element={<Contact />} />
        <Route path="/info/faq" element={<FAQ />} />
        <Route path="/info/help" element={<HelpCenter />} />
        <Route path="/info/privacy" element={<Privacy />} />
        <Route path="/info/terms" element={<Terms />} />
        <Route path="/info/shipping" element={<Shipping />} />
        <Route path="/info/refund" element={<Refund />} />
      </Route>

      {/* Admin area requires an admin login */}
      <Route path="/admin" element={<Privaterouteadmin />}>
        <Route path="admin" element={<Admin />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
export default AllRoutes;

