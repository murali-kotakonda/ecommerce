import React from "react";
import InfoPage from "./InfoPage";

const Privacy = () => (
  <InfoPage
    title="Privacy Policy"
    subtitle="How we collect, use and protect your information."
    sections={[
      { heading: "Information We Collect", body: "We collect information you provide during registration and checkout, such as your name, email, phone number and address." },
      { heading: "How We Use Your Data", body: ["To process and deliver your orders", "To provide customer support", "To improve our products and services", "To send important account and order updates"] },
      { heading: "Data Security", body: "We use industry-standard encryption and security practices to protect your personal information." },
      { heading: "Cookies", body: "We use cookies to enhance your browsing experience and remember your preferences." },
      { heading: "Your Rights", body: "You may request access to, correction of, or deletion of your personal data at any time." },
    ]}
  />
);
export default Privacy;
