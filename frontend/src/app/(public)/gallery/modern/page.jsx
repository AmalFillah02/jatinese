"use client";

import { useState } from "react";
import Image from "next/image";

const products = [
  {
    id: 1,
    title: "Aksara Chair",
    price: 7100000,
    category: "chair",
    image: "/images/modern/kursi/aksara.png",
    description:
      "",
    tags: ["Modern"],
  },
  {
    id: 2,
    title: "Arkana Chair",
    price: 7100000,
    category: "chair",
    image: "/images/modern/kursi/arkana.png",
    description:
      "",
    tags: ["Modern"],
  },
  {
    id: 3,
    title: "Embrace Chair",
    price: 7100000,
    category: "chair",
    image: "/images/modern/kursi/embrace.png",
    description:
      "",
    tags: ["Modern"],
  },
  {
    id: 4,
    title: "Jalin Chair",
    price: 7100000,
    category: "chair",
    image: "/images/modern/kursi/jalin.png",
    description:
      "",
    tags: ["Modern"],
  },
  {
    id: 5,
    title: "Plywood Chair",
    price: 7100000,
    category: "chair",
    image: "/images/modern/kursi/plywood.png",
    description:
      "",
    tags: ["Modern"],
  },
  {
    id: 6,
    title: "Rattan Chair",
    price: 7100000,
    category: "chair",
    image: "/images/modern/kursi/rattan.png",
    description:
      "",
    tags: ["Modern"],
  },
  {
    id: 7,
    title: "Rectangle Chair",
    price: 7100000,
    category: "chair",
    image: "/images/modern/kursi/rectangle.png",
    description:
      "",
    tags: ["Modern"],
  },
  {
    id: 8,
    title: "Silhouette Chair",
    price: 7100000,
    category: "chair",
    image: "/images/modern/kursi/silhouette.png",
    description:
      "",
    tags: ["Modern"],
  },
  {
    id: 9,
    title: "Teduh Chair",
    price: 7100000,
    category: "chair",
    image: "/images/modern/kursi/teduh.png",
    description:
      "",
    tags: ["Modern"],
  },

  // meja
  {
    id: 10,
    title: "Atlas Frame",
    price: 8800000,
    category: "table",
    image: "/images/modern/meja/atlasFrame.png",
    description:
      "",
    tags: ["Modern"],
  },
  {
    id: 11,
    title: "Axis",
    price: 8800000,
    category: "table",
    image: "/images/modern/meja/axis.png",
    description:
      "",
    tags: ["Modern"],
  },
  {
    id: 12,
    title: "Clear Horizon",
    price: 8800000,
    category: "table",
    image: "/images/modern/meja/clearHorizon.png",
    description:
      "",
    tags: ["Modern"],
  },
  {
    id: 13,
    title: "Live Edge",
    price: 8800000,
    category: "table",
    image: "/images/modern/meja/liveEdge.png",
    description:
      "",
    tags: ["Modern"],
  },
  {
    id: 14,
    title: "Pointes Table",
    price: 8800000,
    category: "table",
    image: "/images/modern/meja/pointes.png",
    description:
      "",
    tags: ["Modern"],
  },
  {
    id: 15,
    title: "River Table",
    price: 8800000,
    category: "table",
    image: "/images/modern/meja/river.png",
    description:
      "",
    tags: ["Modern"],
  },

  //bufet
  {
    id: 16,
    title: "Chilly Sideboard",
    price: 9500000,
    category: "sideboard",
    image: "/images/modern/sideboard/chilly.png",
    description:
      "",
    tags: ["Modern"],
  },
  {
    id: 17,
    title: "Parallel Sideboard",
    price: 9500000,
    category: "sideboard",
    image: "/images/modern/sideboard/parallel.png",
    description:
      "",
    tags: ["Modern"],
  },
  {
    id: 18,
    title: "Rhythm",
    price: 9500000,
    category: "sideboard",
    image: "/images/modern/sideboard/rhythm.png",
    description:
      "",
    tags: ["Modern"],
  },
  {
    id: 19,
    title: "Stark",
    price: 9500000,
    category: "sideboard",
    image: "/images/modern/sideboard/stark.png",
    description:
      "",
    tags: ["Modern"],
  },
  {
    id: 20,
    title: "Vein Sideboard",
    price: 9500000,
    category: "sideboard",
    image: "/images/modern/sideboard/vein.png",
    description:
      "",
    tags: ["Modern"],
  },
  {
    id: 21,
    title: "Weaver",
    price: 9500000,
    category: "sideboard",
    image: "/images/modern/sideboard/weave.png",
    description:
      "",
    tags: ["Modern"],
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
