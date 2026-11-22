import React, { useState, useEffect } from "react";
import "../comp_css/Slider.css";

// Stable fallback banner if a slide image fails to load.
const FALLBACK =
  "https://via.placeholder.com/1680x320/4f46e5/ffffff?text=Welcome+to+Our+Store";

const Slider = ({ images = [], interval = 4000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const list = images.length ? images : [FALLBACK];

  useEffect(() => {
    if (list.length <= 1) return undefined;
    const slideInterval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % list.length);
    }, interval);
    // Cleanup prevents stacked intervals / memory leaks on re-render.
    return () => clearInterval(slideInterval);
  }, [list.length, interval]);

  return (
    <div className="slider">
      <img
        key={currentIndex}
        src={list[currentIndex]}
        alt="Promotional banner"
        onError={(e) => {
          if (e.currentTarget.src !== FALLBACK) e.currentTarget.src = FALLBACK;
        }}
      />
    </div>
  );
};

export default Slider;
