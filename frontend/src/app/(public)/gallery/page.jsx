// src/app/(public)/gallery/page.jsx

import React from "react";
import Link from "next/link";
import "./gallery.css"; // buat file css di folder yang sama

import bg1 from "/public/images/bg1.jpg";
import classic from "/public/images/classic.jpg";
import modern from "/public/images/modern.jpg";

export default function GalleryPage() {
  const items = [
  {
    title: "MINIMALIST",
    backgroundImage: `url(${bg1.src})`,
    link: "/gallery/minimalist",
    clip: "polygon(0 0, 100% 0, 86% 100%, 0% 100%)",
  },
  {
    title: "CLASSIC",
    backgroundImage: `url(${classic.src})`,
    link: "/gallery/classic",
    clip: "polygon(14% 0, 100% 0, 86% 100%, 0% 100%)",
  },
  {
    title: "MODERN",
    backgroundImage: `url(${modern.src})`,
    link: "/gallery/modern",
    clip: "polygon(14% 0, 100% 0, 100% 100%, 0% 100%)",
  },
  ];

  return (
    <div className="gallery-diagonal">
      {items.map((item, index) => (
        <div
          key={index}
          className="gallery-section"
          style={{
            backgroundImage: item.backgroundImage,
            clipPath: item.clip,
          }}
        >
          <div className="overlay"></div>
          <div className="content">
            <a
              href={item.link}
              rel="noopener noreferrer"
              className="opensea-btn"
            >
              VIEW MORE
            </a>
            <h2>{item.title}</h2>
          </div>
        </div>
      ))}
    </div>
  );
}
