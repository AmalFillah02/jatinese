// src/app/(public)/layout.jsx
"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function PublicLayout({ children }) {
  const pathname = usePathname();

  return (
    <div className="bg-black text-black min-h-screen">
      <Header />

      <main>
        {children}
      </main>

      {pathname !== "/gallery" && 
      pathname !== "/gallery/classic" && 
      pathname !== "/gallery/modern" &&
      pathname !== "/gallery/minimalist" &&
      pathname !== "/about" &&<Footer />}

    </div>
  );
}
