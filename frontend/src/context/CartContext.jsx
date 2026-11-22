import React, { createContext, useContext, useCallback, useEffect, useState } from "react";
import api from "../Router/api";

const CartContext = createContext(null);

export function CartProvider({ children, toast }) {
  const userId = localStorage.getItem("userid");
  const [cart, setCart] = useState({ cartItems: [] });
  const [wishlist, setWishlist] = useState([]);
  const notify = toast || { success: () => {}, error: () => {} };

  const cartId = () => localStorage.getItem("cartid");

  const refreshCart = useCallback(() => {
    const cid = cartId();
    if (!cid) { setCart({ cartItems: [] }); return Promise.resolve(); }
    return api.get(`/ecom/cart/products/${cid}`)
      .then((r) => setCart(r.data || { cartItems: [] }))
      .catch(() => setCart({ cartItems: [] }));
  }, []);

  const refreshWishlist = useCallback(() => {
    if (!userId) { setWishlist([]); return Promise.resolve(); }
    return api.get(`/ecom/wishlist/${userId}`)
      .then((r) => setWishlist(r.data?.data ?? r.data ?? []))
      .catch(() => setWishlist([]));
  }, [userId]);

  useEffect(() => {
    if (userId) { refreshCart(); refreshWishlist(); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  // Map productId -> quantity currently in cart
  const quantities = {};
  (cart.cartItems || []).forEach((ci) => { quantities[ci.product.productId] = ci.quantity; });
  const quantityOf = (pid) => quantities[pid] || 0;
  const isWishlisted = (pid) => wishlist.some((w) => w.product?.productId === pid);

  const addToCart = useCallback(async (pid) => {
    try {
      const res = await api.post(`/ecom/cart/add-product?userId=${userId}&productId=${pid}`);
      if (res.data?.cartId) localStorage.setItem("cartid", res.data.cartId);
      await refreshCart();
      notify.success("Added to cart");
    } catch (e) {
      // If already in cart, just increase instead for a smooth UX.
      const msg = e.response?.data?.message || "";
      if (msg.toLowerCase().includes("already")) { return increase(pid); }
      notify.error(msg || "Could not add to cart");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, refreshCart]);

  const increase = useCallback(async (pid) => {
    const cid = cartId();
    if (!cid) return addToCart(pid);
    try {
      await api.put(`/ecom/cart/increase-productQty/${cid}/${pid}`);
      await refreshCart();
    } catch (e) {
      notify.error(e.response?.data?.message || "Could not update quantity");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshCart, addToCart]);

  const decrease = useCallback(async (pid) => {
    const cid = cartId();
    if (!cid) return;
    const current = quantityOf(pid);
    try {
      if (current <= 1) {
        await api.delete(`/ecom/cart/remove-product/${cid}/${pid}`);
      } else {
        await api.put(`/ecom/cart/decrease-productQty/${cid}/${pid}`);
      }
      await refreshCart();
    } catch (e) {
      notify.error(e.response?.data?.message || "Could not update quantity");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshCart, cart]);

  const removeFromCart = useCallback(async (pid) => {
    const cid = cartId();
    if (!cid) return;
    try {
      await api.delete(`/ecom/cart/remove-product/${cid}/${pid}`);
      await refreshCart();
      notify.success("Removed from cart");
    } catch (e) {
      notify.error("Could not remove item");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshCart]);

  const emptyCart = useCallback(async () => {
    const cid = cartId();
    if (!cid) return;
    try { await api.delete(`/ecom/cart/empty-Cart/${cid}`); await refreshCart(); notify.success("Cart cleared"); }
    catch { notify.error("Cart is already empty"); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshCart]);

  const toggleWishlist = useCallback(async (pid) => {
    if (!userId) return;
    try {
      if (isWishlisted(pid)) {
        await api.delete(`/ecom/wishlist/${userId}/${pid}`);
        notify.success("Removed from wishlist");
      } else {
        await api.post(`/ecom/wishlist/${userId}/${pid}`);
        notify.success("Added to wishlist");
      }
      await refreshWishlist();
    } catch (e) {
      notify.error(e.response?.data?.message || "Wishlist update failed");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, refreshWishlist, wishlist]);

  const removeFromWishlist = useCallback(async (pid) => {
    if (!userId) return;
    try { await api.delete(`/ecom/wishlist/${userId}/${pid}`); await refreshWishlist(); notify.success("Removed from wishlist"); }
    catch { notify.error("Could not remove from wishlist"); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, refreshWishlist]);

  const value = {
    cart, wishlist, quantityOf, isWishlisted,
    cartCount: (cart.cartItems || []).reduce((n, ci) => n + ci.quantity, 0),
    wishlistCount: wishlist.length,
    addToCart, increase, decrease, removeFromCart, emptyCart,
    toggleWishlist, removeFromWishlist, refreshCart, refreshWishlist,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
