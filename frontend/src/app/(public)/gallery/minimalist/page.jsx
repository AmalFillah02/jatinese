// src/app/(public)/gallery/minimalist/page.jsx
"use client";

import { useState } from "react";
import Image from "next/image";

const products = [
  {
    id: 1,
    title: "Wishbone Chair",
    price: 7100000,
    category: "chair",
    image: "/images/minimalist/kursi/min1.jpg",
    description:
      "",
    tags: ["Minimalist"],
  },
  {
    id: 2,
    title: "Bull Chair",
    price: 7100000,
    category: "chair",
    image: "/images/minimalist/kursi/min2.jpg",
    description:
      "",
    tags: ["Minimalist"],
  },
  {
    id: 3,
    title: "Plank Chair",
    price: 7100000,
    category: "chair",
    image: "/images/minimalist/kursi/min3.jpg",
    description:
      "",
    tags: ["Minimalist"],
  },
  {
    id: 4,
    title: "Curved Design Chair",
    price: 7100000,
    category: "chair",
    image: "/images/minimalist/kursi/min4.jpg",
    description:
      "",
    tags: ["Minimalist"],
  },
  {
    id: 5,
    title: "Pierre Jeanneret Chair",
    price: 7100000,
    category: "chair",
    image: "/images/minimalist/kursi/min5.jpg",
    description:
      "",
    tags: ["Minimalist"]
  },
  {
    id: 6,
    title: "Minimalist Chair",
    price: 7100000,
    category: "chair",
    image: "/images/minimalist/kursi/min6.jpg",
    description:
      "",
    tags: ["Minimalist"],
  },
  {
    id: 7,
    title: "Danish Design Chair",
    price: 7100000,
    category: "chair",
    image: "/images/minimalist/kursi/min7.jpg",
    description:
      "",
    tags: ["Minimalist"],
  },
  {
    id: 8,
    title: "Herit Chair",
    price: 7100000,
    category: "chair",
    image: "/images/minimalist/kursi/min8.jpg",
    description:
      "",
    tags: ["Minimalist"],
  },
  {
    id: 9,
    title: "Series 7 Chair",
    price: 7100000,
    category: "chair",
    image: "/images/minimalist/kursi/min9.jpg",
    description:
      "",
    tags: ["Minimalist"],
  },
  {
    id: 10,
    title: "Diamond Chair",
    price: 7100000,
    category: "chair",
    image: "/images/minimalist/kursi/min10.jpg",
    description:
      "",
    tags: ["Minimalist"],
  },
  {
    id: 11,
    title: "Wood Minimalist Chair",
    price: 7100000,
    category: "chair",
    image: "/images/minimalist/kursi/min11.jpg",
    description:
      "",
    tags: ["Minimalist"],
  },
  {
    id: 12,
    title: "Elbow Chair",
    price: 7100000,
    category: "chair",
    image: "/images/minimalist/kursi/min12.jpg",
    description:
      "",
    tags: ["Minimalist"],
  },

  // meja
  {
    id: 13,
    title: "Sandara Table",
    price: 8800000,
    category: "table",
    image: "/images/minimalist/meja/tab1-sandara.png",
    description:
      "",
    tags: ["Minimalist"],
  },
  {
    id: 14,
    title: "Arsa Table",
    price: 8800000,
    category: "table",
    image: "/images/minimalist/meja/tab2-arsa.png",
    description:
      "",
    tags: ["Minimalist"],
  },
  {
    id: 15,
    title: "Loka Table",
    price: 8800000,
    category: "table",
    image: "/images/minimalist/meja/tab3-loka.png",
    description:
      "",
    tags: ["Minimalist"],
  },
  {
    id: 16,
    title: "Yuga Table",
    price: 8800000,
    category: "table",
    image: "/images/minimalist/meja/tab4-yuga.png",
    description:
      "",
    tags: ["Minimalist"],
  },
  {
    id: 17,
    title: "Console Line Table",
    price: 8800000,
    category: "table",
    image: "/images/minimalist/meja/tab5-consoleLine.png",
    description:
      "",
    tags: ["Minimalist"],
  },
  {
    id: 18,
    title: "Liku Table",
    price: 8800000,
    category: "table",
    image: "/images/minimalist/meja/tab6-liku.png",
    description:
      "",
    tags: ["Minimalist"],
  },

  //bufet
  {
    id: 19,
    title: "Tata Sideboard",
    price: 9500000,
    category: "sideboard",
    image: "/images/minimalist/sideboard/sb1-tata.png",
    description:
      "",
    tags: ["Minimalist"],
  },
  {
    id: 20,
    title: "Timeless Sideboard",
    price: 9500000,
    category: "sideboard",
    image: "/images/minimalist/sideboard/sb2-timeless.png",
    description:
      "",
    tags: ["Minimalist"],
  },
  {
    id: 21,
    title: "Hole Flow Sideboard",
    price: 9500000,
    category: "sideboard",
    image: "/images/minimalist/sideboard/sb3-hole.png",
    description:
      "",
    tags: ["Minimalist"],
  },
  {
    id: 22,
    title: "Bumi Angkasa",
    price: 9500000,
    category: "sideboard",
    image: "/images/minimalist/sideboard/sb4-bumiAngkasa.png",
    description:
      "",
    tags: ["Minimalist"],
  },
  {
    id: 23,
    title: "Haven Crest",
    price: 9500000,
    category: "sideboard",
    image: "/images/minimalist/sideboard/sb5-havenCrest.png",
    description:
      "",
    tags: ["Minimalist"],
  },
  {
    id: 24,
    title: "Shadow Line",
    price: 9500000,
    category: "sideboard",
    image: "/images/minimalist/sideboard/sb6-shadowLine.png",
    description:
      "",
    tags: ["Minimalist"],
  },
];

export default function MinimalistPage() {
  const [filter, setFilter] = useState("all");

  const filteredProducts =
    filter === "all"
      ? products
      : products.filter((p) => p.category === filter);

  // formatter untuk Rupiah
  const formatRupiah = (number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);

  return (
    <div className="bg-[#e2e2e2] min-h-screen px-4 md:px-10 lg:px-20 pt-[100px] pb-20">
      {/* Filter Section */}
      <div className="flex flex-wrap gap-3 justify-center mb-10">
        {["all", "chair", "table", "sideboard"].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-5 py-2 rounded-full text-sm font-medium shadow-md transition ${
              filter === cat
                ? "bg-black text-white"
                : "bg-white text-gray-700 hover:bg-gray-200"
            }`}
          >
            {cat === "all"
              ? "Semua"
              : cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* Produk Section */}
      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="relative h-[400px] rounded-3xl overflow-hidden shadow-xl group"
          >
            {/* Background image */}
            <Image
              src={product.image}
              alt={product.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              priority
            />

            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

            {/* Content */}
            <div className="absolute bottom-0 p-6 text-white">
              <h3 className="text-lg font-semibold">{product.title}</h3>
              <p className="text-sm text-gray-200">{product.description}</p>

              <div className="flex flex-wrap gap-2 mt-3">
                {product.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex justify-between items-center mt-4">
                <span className="text-base font-bold">
                  {formatRupiah(product.price)}
                </span>
                <button className="bg-white text-black px-4 py-2 rounded-full text-sm shadow hover:bg-gray-200 ml-[90px]">
                  Contact
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
