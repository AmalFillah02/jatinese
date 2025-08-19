'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import authenticatedFetch from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowUpRight, ArrowDownRight, Minus, ChevronsRight, Target, Download, ArrowLeft } from 'lucide-react';
import { toast } from "sonner";
import * as XLSX from 'xlsx';

function ReportCard({ title, value, icon, color }) {
  const IconComponent = icon;
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <IconComponent className={`h-4 w-4 text-muted-foreground ${color}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          Rp {new Intl.NumberFormat('id-ID').format(value)}
        </div>
      </CardContent>
    </Card>
  );
}

export default function ProfitLossPage() {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await authenticatedFetch('/reports/profit-loss');
        if (!response.ok) throw new Error('Gagal memuat data laporan.');
        const data = await response.json();
        setReportData(data);
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, []);

  const handleExport = () => {
    if (!reportData) return;
    const dataToExport = [
      { Keterangan: 'Total Pendapatan (Penjualan)', Jumlah: reportData.totalRevenue },
      { Keterangan: 'Total Biaya Bahan Baku (Pembelian)', Jumlah: reportData.totalCostOfGoods },
      { Keterangan: 'Laba Kotor', Jumlah: reportData.grossProfit },
      {}, // Baris kosong sebagai pemisah
      { Keterangan: 'Total Biaya Operasional', Jumlah: reportData.totalOperationalCost },
      { Keterangan: 'Laba Bersih', Jumlah: reportData.netProfit },
    ];
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Laba Rugi");
    worksheet["!cols"] = [{ wch: 35 }, { wch: 20 }];
    // Format sel sebagai mata uang
    worksheet['B2'].z = '"Rp"#,##0';
    worksheet['B3'].z = '"Rp"#,##0';
    worksheet['B4'].z = '"Rp"#,##0';
    worksheet['B6'].z = '"Rp"#,##0';
    worksheet['B7'].z = '"Rp"#,##0';
    XLSX.writeFile(workbook, "Laporan_Laba_Rugi_Lengkap.xlsx");
    toast.success("Laporan berhasil diunduh!");
  };

  if (loading) return <p className="p-8">Menghitung laporan...</p>;
  if (!reportData) return <p className="p-8 text-red-500">Gagal memuat data laporan.</p>;

  return (
    <div className="container mx-auto p-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Laporan Laba Rugi</h1>
        <div>
          <Link href="/?menu=laporan" className="mr-4">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Submenu
            </Button>
          </Link>
          <Button onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" /> Ekspor ke Excel
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 items-center">
        <ReportCard title="Pendapatan" value={reportData.totalRevenue} icon={ArrowUpRight} color="text-green-500" />
        <ChevronsRight className="h-8 w-8 text-gray-300 hidden lg:block" />
        <ReportCard title="Laba Kotor" value={reportData.grossProfit} icon={Minus} color="text-blue-500" />
        <ChevronsRight className="h-8 w-8 text-gray-300 hidden lg:block" />
        <ReportCard title="Laba Bersih" value={reportData.netProfit} icon={Target} color={reportData.netProfit >= 0 ? "text-green-500" : "text-red-500"} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
            <CardHeader><CardTitle>Detail Perhitungan</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                <div className="flex justify-between"><span>Total Pendapatan</span><span>Rp {new Intl.NumberFormat('id-ID').format(reportData.totalRevenue)}</span></div>
                <div className="flex justify-between"><span>(-) Total Biaya Bahan Baku</span><span className="text-red-600">Rp {new Intl.NumberFormat('id-ID').format(reportData.totalCostOfGoods)}</span></div>
                <hr/>
                <div className="flex justify-between font-bold"><span>Laba Kotor</span><span>Rp {new Intl.NumberFormat('id-ID').format(reportData.grossProfit)}</span></div>
                <div className="flex justify-between mt-4"><span>(-) Total Biaya Operasional</span><span className="text-red-600">Rp {new Intl.NumberFormat('id-ID').format(reportData.totalOperationalCost)}</span></div>
                <hr/>
                <div className="flex justify-between font-bold text-lg"><span>Laba Bersih</span><span>Rp {new Intl.NumberFormat('id-ID').format(reportData.netProfit)}</span></div>
            </CardContent>
        </Card>
        <Card>
            <CardHeader><CardTitle>Catatan</CardTitle></CardHeader>
            <CardContent className="text-sm text-gray-600">
                <p>Laporan ini menghitung Laba Bersih dengan mengurangi Total Pendapatan dengan Biaya Bahan Baku dan Biaya Operasional.</p>
                <p className="mt-2">Ini memberikan gambaran yang lebih akurat tentang profitabilitas bisnis Anda.</p>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
