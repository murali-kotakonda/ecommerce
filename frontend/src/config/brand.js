// Centralized branding — change the app name/logo in ONE place.
// Both the Admin and Customer portals import from here.
export const BRAND = {
  name: "ShopEase",
  tagline: "Your everyday marketplace",
  logoPrefix: "Shop",
  logoSuffix: "Ease",
  logoMark: "🛍️",
};

/** Builds a browser tab title like "ShopEase | Cart". */
export const pageTitle = (section) => (section ? `${BRAND.name} | ${section}` : BRAND.name);
