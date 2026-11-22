import React from "react";
import InfoPage from "./InfoPage";

const Terms = () => (
  <InfoPage
    title="Terms & Conditions"
    subtitle="Please read these terms carefully before using our platform."
    sections={[
      { heading: "1. Acceptance of Terms", body: "By accessing and using this website, you accept and agree to be bound by these terms and conditions." },
      { heading: "2. Use of the Service", body: "You agree to use the platform only for lawful purposes and in a way that does not infringe the rights of others." },
      { heading: "3. Orders & Pricing", body: "All orders are subject to availability and confirmation of the order price. Prices are shown in INR and may change without notice." },
      { heading: "4. Accounts", body: "You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account." },
      { heading: "5. Limitation of Liability", body: "We are not liable for any indirect or consequential loss arising from the use of our platform." },
      { heading: "6. Changes to Terms", body: "We reserve the right to update these terms at any time. Continued use constitutes acceptance of the revised terms." },
    ]}
  />
);
export default Terms;
