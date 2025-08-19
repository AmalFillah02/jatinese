"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";
import { useSearchParams } from "next/navigation";
import { Box, Hammer, ShoppingCart, Truck, Landmark, Briefcase, FileText, BarChart3, ArrowLeft,Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

function MainMenuItem({ icon, label, color, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center p-6 rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all aspect-square ${color}`}
    >
      <div className="text-white">{icon}</div>
      <span className="mt-2 text-sm font-semibold text-white text-center">
        {label}
      </span>
    </button>
  );
}

function SubMenuItem({ href, label }) {
  return (
    <Link
      href={href}
      className="block p-4 rounded-lg hover:bg-gray-100 transition-colors"
    >
      {label}
    </Link>
  );
}

export default function MainMenuPage() {
  const [activeMenu, setActiveMenu] = useState(null);
  const searchParams = useSearchParams();

  const menuConfig = {
    analisis: {
      label: "Analisis",
      icon: <BarChart3 size={48} />,
      color: "bg-rose-500 hover:bg-rose-600",
      href: "/analysis",
    },
    inventaris: {
      label: "Inventaris",
      icon: <Box size={48} />,
      color: "bg-blue-500 hover:bg-blue-600",
      submenus: [
        { href: "/materials", label: "Bahan Baku" },
        { href: "/products", label: "Produk Jadi" },
      ],
    },
    produksi: {
      label: "Produksi",
      icon: <Hammer size={48} />,
      color: "bg-amber-500 hover:bg-amber-600",
      href: "/production",
    },
    penjualan: {
      label: "Penjualan",
      icon: <ShoppingCart size={48} />,
      color: "bg-green-500 hover:bg-green-600",
      submenus: [
        { href: "/customers", label: "Pelanggan" },
        { href: "/sales-orders", label: "Buat Pesanan Baru" },
        { href: "/sales-orders/history", label: "Riwayat Pesanan" },
      ],
    },
    pembelian: {
      label: "Pembelian",
      icon: <Truck size={48} />,
      color: "bg-orange-500 hover:bg-orange-600",
      submenus: [
        { href: "/purchasing/suppliers", label: "Pemasok" },
        {
          href: "/purchasing/purchase-orders",
          label: "Buat Pesanan Pembelian",
        },
        {
          href: "/purchasing/purchase-orders/history",
          label: "Riwayat Pembelian",
        },
        { href: "/purchasing/purchase-invoices", label: "Faktur Pembelian" },
      ],
    },
    keuangan: {
      label: "Keuangan",
      icon: <Landmark size={48} />,
      color: "bg-indigo-500 hover:bg-indigo-600",
      submenus: [
        { href: "/finance/invoices", label: "Daftar Faktur" },
        { href: "/finance/payments", label: "Riwayat Pembayaran" },
        { href: "/finance/expenses", label: "Catat Pengeluaran" },
        { href: "/finance/expense-categories", label: "Kategori Biaya" },
      ],
    },
    hr: {
      label: "HR",
      icon: <Briefcase size={48} />,
      color: "bg-purple-500 hover:bg-purple-600",
      submenus: [
        { href: "/hr/employees", label: "Manajemen Karyawan" },
        { href: "/hr/payrolls", label: "Penggajian" },
      ],
    },
    laporan: {
      label: "Laporan",
      icon: <FileText size={48} />,
      color: "bg-slate-500 hover:bg-slate-600",
      href: "/reports/profit-loss",
    },
    settings: {
      label: "Pengaturan",
      icon: <Settings size={48} />,
      color: "bg-gray-500 hover:bg-gray-600",
      submenus: [{ href: "/settings/users", label: "Manajemen Pengguna" }],
    },
  };

  useEffect(() => {
    const menu = searchParams.get("menu");
    if (menu && menuConfig[menu] && menuConfig[menu].submenus) {
      setActiveMenu(menu);
    }
  }, [searchParams, menuConfig]);

  const currentMenu = activeMenu ? menuConfig[activeMenu] : null;

  return (
    <div className="container mx-auto p-8 bg-gray-300">
      {!currentMenu ? (
        <>
          <h1 className="text-3xl font-bold mb-1 text-center">
            Modul Aplikasi
          </h1>

          <div className="flex items-center">
            <LogoutButton />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {Object.entries(menuConfig).map(([key, item]) =>
              item.href ? (
                <Link key={key} href={item.href} legacyBehavior>
                  <a
                    className={`flex flex-col items-center justify-center p-6 rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all aspect-square ${item.color}`}
                  >
                    <div className="text-white">{item.icon}</div>
                    <span className="mt-2 text-sm font-semibold text-white text-center">
                      {item.label}
                    </span>
                  </a>
                </Link>
              ) : (
                <MainMenuItem
                  key={key}
                  {...item}
                  onClick={() => setActiveMenu(key)}
                />
              )
            )}
          </div>
        </>
      ) : (
        <div>
          <Button
            variant="ghost"
            onClick={() => setActiveMenu(null)}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Menu Utama
          </Button>
          <h1 className="text-3xl font-bold mb-6 flex items-center">
            <span className={`mr-4 p-3 rounded-lg ${currentMenu.color}`}>
              {currentMenu.icon}
            </span>
            {currentMenu.label}
          </h1>
          <Card>
            <CardContent className="p-2">
              {currentMenu.submenus.map((submenu) => (
                <SubMenuItem key={submenu.href} {...submenu} />
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
