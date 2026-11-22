import React from "react";
import InfoPage from "./InfoPage";

const Refund = () => (
  <InfoPage
    title="Returns & Refunds"
    subtitle="Our hassle-free return and refund policy."
    sections={[
      { heading: "7-Day Return Window", body: "You can return eligible items within 7 days of delivery for a full refund or replacement." },
      { heading: "Eligibility", body: ["Item must be unused and in original condition", "Original packaging must be intact", "Proof of purchase is required"] },
      { heading: "Refund Process", body: "Once your return is received and inspected, your refund will be processed to the original payment method within 5-7 business days." },
      { heading: "Non-Returnable Items", body: "Perishable goods and personal care items may not be eligible for return for hygiene reasons." },
    ]}
  />
);
export default Refund;
