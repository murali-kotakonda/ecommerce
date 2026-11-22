import React from "react";
import InfoPage from "./InfoPage";

const HelpCenter = () => (
  <InfoPage
    title="Help Center"
    subtitle="We are here to help you with anything you need."
    sections={[
      { heading: "Getting Started", body: "Create an account, browse products, add items to your cart and check out securely in just a few clicks." },
      { heading: "Managing Orders", body: "Track, view details and cancel eligible orders from the My Orders section in your account." },
      { heading: "Payments", body: "We support multiple payment methods including card, UPI and cash on delivery. All payments are processed securely." },
      { heading: "Still Need Help?", body: "Reach out via the Contact Us page and our support team will assist you promptly." },
    ]}
  />
);
export default HelpCenter;
