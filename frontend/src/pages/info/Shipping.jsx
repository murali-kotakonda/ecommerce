import React from "react";
import InfoPage from "./InfoPage";

const Shipping = () => (
  <InfoPage
    title="Shipping Policy"
    subtitle="Everything you need to know about delivery."
    sections={[
      { heading: "Delivery Time", body: "Orders are typically processed within 24 hours and delivered within 2-5 business days depending on your location." },
      { heading: "Shipping Charges", body: "We offer free shipping on all orders. No minimum purchase required." },
      { heading: "Order Tracking", body: "Once your order is confirmed, you can track its status from the My Orders page." },
      { heading: "Delivery Areas", body: "We currently deliver across all major cities. Coverage continues to expand." },
    ]}
  />
);
export default Shipping;
