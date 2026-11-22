import "./App.css";
import AllRoutes from "./Router/AllRoutes";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { useLocation } from "react-router-dom";
import { ToastProvider, useToast } from "./components/admin/useToast";
import { CartProvider } from "./context/CartContext";

function Shell() {
  const location = useLocation();
  const toast = useToast();

  const isRestrictedPath = [
    "/login",
    "/register-user",
    "/admin-login",
    "/admin/admin",
  ].includes(location.pathname);

  return (
    <CartProvider toast={toast}>
      <div>
        {!isRestrictedPath && <Navbar />}
        <div style={{ minHeight: "90vh" }}>
          <AllRoutes />
        </div>
        {!isRestrictedPath && <Footer />}
      </div>
    </CartProvider>
  );
}

function App() {
  return (
    <ToastProvider>
      <Shell />
    </ToastProvider>
  );
}

export default App;
