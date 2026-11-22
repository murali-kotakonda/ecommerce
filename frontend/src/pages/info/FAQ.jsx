import React, { useState } from "react";
import "../../comp_css/Shop.css";

const FAQS = [
  { q: "How do I place an order?", a: "Browse products, add them to your cart, go to checkout, select a payment method and click Pay Now." },
  { q: "What payment methods are accepted?", a: "We accept credit/debit cards, UPI and cash on delivery. All online payments are processed securely." },
  { q: "How long does delivery take?", a: "Orders are usually delivered within 2-5 business days depending on your location." },
  { q: "Can I cancel my order?", a: "Yes, orders can be cancelled from the My Orders page as long as they have not yet shipped." },
  { q: "What is your return policy?", a: "Eligible items can be returned within 7 days of delivery for a full refund or replacement." },
  { q: "Is my personal information safe?", a: "Absolutely. We use industry-standard encryption to protect your data." },
];

const FAQ = () => {
  const [open, setOpen] = useState(0);
  return (
    <div className="shop">
      <div className="shop-wrap info-page">
        <div className="info-hero">
          <h1>Frequently Asked Questions</h1>
          <p>Quick answers to the questions we hear most.</p>
        </div>
        <div className="info-body">
          {FAQS.map((f, i) => (
            <div className="faq-item" key={i}>
              <div className="faq-q" onClick={() => setOpen(open === i ? -1 : i)}>
                <span>{f.q}</span>
                <span>{open === i ? "−" : "+"}</span>
              </div>
              {open === i && <div className="faq-a">{f.a}</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default FAQ;
