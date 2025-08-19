'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import authenticatedFetch from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button"; // Impor Button
import { toast } from "sonner";
import * as XLSX from 'xlsx'; // BARU: Impor library xlsx
import { Download, ArrowLeft } from 'lucide-react'; // BARU: Impor ikon download

export default function PaymentsHistoryPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await authenticatedFetch('/payments');
        if (!response.ok) throw new Error('Gagal memuat riwayat pembayaran.');
        const data = await response.json();
        setPayments(data);
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  // BARU: Fungsi untuk menangani ekspor ke Excel
  const handleExport = () => {
    if (payments.length === 0) {
      toast.warning("Tidak ada data untuk diekspor.");
      return;
    }

    // 1. Format data agar sesuai dengan struktur spreadsheet
    const dataToExport = payments.map(p => ({
      'ID Pembayaran': `PAY-${p.id}`,
      'Tanggal Bayar': new Date(p.createdAt).toLocaleDateString('id-ID'),
      'No. Faktur': `INV-${p.invoice.id}`,
      'Pelanggan': p.invoice.salesOrder.customer.name,
      'Metode': p.method,
      'Jumlah': p.amount
    }));

    // 2. Buat worksheet dari data yang sudah diformat
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);

    // 3. Buat workbook baru dan tambahkan worksheet ke dalamnya
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Riwayat Pembayaran");

    // 4. Buat file Excel dan picu unduhan di browser
    XLSX.writeFile(workbook, "Laporan_Buku_Kas.xlsx");
    
    toast.success("Laporan berhasil diunduh!");
  };

  if (loading) return <p className="p-8">Memuat riwayat pembayaran...</p>;

  return (
    <div className="container mx-auto p-8 space-y-8">

      <div className="flex justify-between items-center">

        <div className="flex justify-between items-center">
        <Link href="/">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke menu
          </Button>
        </Link>
      </div>

        <h1 className="text-3xl font-bold">Riwayat Pembayaran (Buku Kas)</h1>
        <Button onClick={handleExport}>
          <Download className="mr-2 h-4 w-4" />
          Ekspor ke Excel
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Semua Transaksi Pembayaran</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID Pembayaran</TableHead>
                <TableHead>Tgl. Bayar</TableHead>
                <TableHead>No. Faktur</TableHead>
                <TableHead>Pelanggan</TableHead>
                <TableHead>Metode</TableHead>
                <TableHead className="text-right">Jumlah</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map(payment => (
                <TableRow key={payment.id}>
                  <TableCell className="font-medium">PAY-{payment.id}</TableCell>
                  <TableCell>{new Date(payment.createdAt).toLocaleDateString('id-ID')}</TableCell>
                  <TableCell>INV-{payment.invoice.id}</TableCell>
                  <TableCell>{payment.invoice.salesOrder.customer.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{payment.method}</Badge>
                  </TableCell>
                  <TableCell className="text-right font-bold">Rp {new Intl.NumberFormat('id-ID').format(payment.amount)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
