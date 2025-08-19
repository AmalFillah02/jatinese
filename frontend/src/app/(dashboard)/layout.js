// src/app/(dashboard)/layout.js

import Link from 'next/link';
import '../globals.css';
import LogoutButton from '@/components/LogoutButton';
import { Toaster } from "@/components/ui/sonner";

// Layout ini sekarang jauh lebih sederhana, hanya berisi header
export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header Utama */}
      

      {/* Konten Halaman akan memenuhi sisa layar */}
      <main className="flex-1">
        {children}
      </main>
      
      <Toaster richColors position="top-right" />
    </div>
  );
}