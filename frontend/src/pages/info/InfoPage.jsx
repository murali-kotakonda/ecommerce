import React from "react";
import "../../comp_css/Shop.css";

/**
 * Reusable layout for static/informational footer pages.
 * `sections` is an array of { heading, body } where body is string | string[] | JSX.
 */
const InfoPage = ({ title, subtitle, children, sections = [] }) => (
  <div className="shop">
    <div className="shop-wrap info-page">
      <div className="info-hero">
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
      <div className="info-body">
        {sections.map((s, i) => (
          <div key={i}>
            {s.heading && <h2>{s.heading}</h2>}
            {Array.isArray(s.body) ? (
              <ul>{s.body.map((b, j) => <li key={j}>{b}</li>)}</ul>
            ) : (
              <p>{s.body}</p>
            )}
          </div>
        ))}
        {children}
      </div>
    </div>
  </div>
);

export default InfoPage;
