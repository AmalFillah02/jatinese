// src/app/(public)/gallery/classic/page.jsx
"use client";

import { useState } from "react";
import Image from "next/image";

const products = [
  {
    id: 1,
    title: "Wishbone Chair",
    price: 7100000,
    category: "chair",
    image: "/images/classic/kursi/chair1.jpg",
    description:
      "",
    tags: ["Classic"],
  },
  {
    id: 2,
    title: "Bull Chair",
    price: 7100000,
    category: "chair",
    image: "/images/classic/kursi/chair2.jpg",
    description:
      "",
    tags: ["Classic"],
  },
  {
    id: 3,
    title: "Plank Chair",
    price: 7100000,
    category: "chair",
    image: "/images/classic/kursi/chair3.jpg",
    description:
      "",
    tags: ["Classic"],
  },
  {
    id: 4,
    title: "Curved Design Chair",
    price: 7100000,
    category: "chair",
    image: "/images/classic/kursi/chair4.jpg",
    description:
      "",
    tags: ["Classic"],
  },
  {
    id: 5,
    title: "Pierre Jeanneret Chair",
    price: 7100000,
    category: "chair",
    image: "/images/classic/kursi/chair5.jpg",
    description:
      "",
    tags: ["Classic"],
  },
  {
    id: 6,
    title: "Minimalist Chair",
    price: 7100000,
    category: "chair",
    image: "/images/classic/kursi/chair6.jpg",
    description:
      "",
    tags: ["Classic"],
  },

  // meja
  {
    id: 7,
    title: "Noble Scribe",
    price: 8800000,
    category: "table",
    image: "/images/classic/meja/tab1-nobleScribe.png",
    description:
      "",
    tags: ["Classic"],
  },
  {
    id: 8,
    title: "Homestead Legacy",
    price: 8800000,
    category: "table",
    image: "/images/classic/meja/tab2-homesteadLegacy.png",
    description:
      "",
    tags: ["Classic"],
  },
  {
    id: 9,
    title: "Ornate Echo",
    price: 8800000,
    category: "table",
    image: "/images/classic/meja/tab3-ornateEcho.png",
    description:
      "",
    tags: ["Classic"],
  },
  {
    id: 10,
    title: "Primal Grain",
    price: 8800000,
    category: "table",
    image: "/images/classic/meja/tab4-primalGrain.png",
    description:
      "",
    tags: ["Classic"],
  },
  {
    id: 11,
    title: "French Design",
    price: 8800000,
    category: "table",
    image: "/images/classic/meja/tab5-french.png",
    description:
      "",
    tags: ["Classic"],
  },
  {
    id: 12,
    title: "Worn Whisper",
    price: 8800000,
    category: "table",
    image: "/images/classic/meja/tab6-wornWhisper.png",
    description:
      "",
    tags: ["Classic"],
  },
  {
    id: 13,
    title: "Root Table",
    price: 8800000,
    category: "table",
    image: "/images/classic/meja/tab7-root.png",
    description:
      "",
    tags: ["Classic"],
  },
  {
    id: 14,
    title: "Vienna Grace",
    price: 8800000,
    category: "table",
    image: "/images/classic/meja/tab8-viennaGrace.png",
    description:
      "",
    tags: ["Classic"],
  },
  {
    id: 15,
    title: "Terra",
    price: 8800000,
    category: "table",
    image: "/images/classic/meja/tab9-terra.png",
    description:
      "",
    tags: ["Classic"],
  },

  //bufet
  {
    id: 19,
    title: "Gilded Sideboard",
    price: 9500000,
    category: "sideboard",
    image: "/images/classic/sideboard/gilded.png",
    description:
      "",
    tags: ["Classic"],
  },
  {
    id: 20,
    title: "Grand Sideboard",
    price: 9500000,
    category: "sideboard",
    image: "/images/classic/sideboard/grand.png",
    description:
      "",
    tags: ["Classic"],
  },
  {
    id: 21,
    title: "The Greater",
    price: 9500000,
    category: "sideboard",
    image: "/images/classic/sideboard/greater.png",
    description:
      "",
    tags: ["Classic"],
  },
  {
    id: 22,
    title: "Monarch",
    price: 9500000,
    category: "sideboard",
    image: "/images/classic/sideboard/monarch.png",
    description:
      "",
    tags: ["Classic"],
  },
  {
    id: 23,
    title: "Sovereign",
    price: 9500000,
    category: "sideboard",
    image: "/images/classic/sideboard/sovereign.png",
    description:
      "",
    tags: ["Classic"],
  },
  {
    id: 24,
    title: "Vercailles",
    price: 9500000,
    category: "sideboard",
    image: "/images/classic/sideboard/vercailles.png",
    description:
      "",
    tags: ["Classic"],
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
