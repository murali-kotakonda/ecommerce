import React from "react";
import InfoPage from "./InfoPage";

const About = () => (
  <InfoPage
    title="About Us"
    subtitle="Bringing quality products to your doorstep since 2024."
    sections={[
      { heading: "Who We Are", body: "We are a modern eCommerce marketplace dedicated to making everyday shopping simple, fast and reliable. From fresh groceries to home essentials, we curate quality products at fair prices." },
      { heading: "Our Mission", body: "To deliver a seamless shopping experience backed by trusted products, transparent pricing and dependable delivery." },
      { heading: "Why Choose Us", body: ["Carefully curated, quality-checked products", "Fast and free shipping on all orders", "Easy 7-day returns", "Secure and encrypted payments", "Responsive customer support"] },
    ]}
  />
);
export default About;
