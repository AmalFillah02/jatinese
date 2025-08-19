'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import authenticatedFetch from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import * as XLSX from 'xlsx'; // Impor library xlsx
import { Download, ArrowLeft } from 'lucide-react';

export default function PurchaseHistoryPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const response = await authenticatedFetch('/purchase-orders');
      if (!response.ok) throw new Error('Gagal memuat riwayat pesanan.');
      const data = await response.json();
      setOrders(data);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleReceiveOrder = (orderId) => {
    const promise = () => new Promise(async (resolve, reject) => {
      try {
        const response = await authenticatedFetch(`/purchase-orders/${orderId}/receive`, {
          method: 'PATCH',
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error);
        fetchOrders(); // Muat ulang data untuk update status
        resolve(result);
      } catch (err) {
        reject(err);
      }
    });

    toast.promise(promise, {
      loading: 'Memproses penerimaan barang...',
      success: 'Barang berhasil diterima & stok diperbarui!',
      error: (err) => err.message,
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'DITERIMA': return <Badge className="bg-green-500 text-white">Diterima</Badge>;
      case 'DIKIRIM': return <Badge variant="secondary">Dikirim</Badge>;
      default: return <Badge variant="outline">Dibuat</Badge>;
    }
  };

  // Fungsi untuk menangani ekspor ke Excel
  const handleExport = () => {
    if (orders.length === 0) {
      toast.warning("Tidak ada data untuk diekspor.");
      return;
    }

    const dataToExport = [];
    orders.forEach(order => {
      order.items.forEach(item => {
        dataToExport.push({
          'ID Pesanan': `PO-${order.id}`,
          'Pemasok': order.supplier.name,
          'Tanggal Pesan': new Date(order.createdAt).toLocaleDateString('id-ID'),
          'Status': order.status,
          'Nama Barang': item.material.name,
          'Jumlah': item.quantity,
          'Harga Satuan': item.price,
          'Subtotal': item.quantity * item.price,
        });
      });
    });

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Riwayat Pembelian");

    worksheet["!cols"] = [
        { wch: 12 }, { wch: 25 }, { wch: 15 }, { wch: 12 },
        { wch: 30 }, { wch: 10 }, { wch: 15 }, { wch: 15 },
    ];

    XLSX.writeFile(workbook, "Laporan_Pesanan_Pembelian.xlsx");
    toast.success("Laporan berhasil diunduh!");
  };

  if (loading) return <p className="p-8">Memuat riwayat pesanan...</p>;

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

        <h1 className="text-3xl font-bold">Riwayat Pesanan Pembelian</h1>
        <Button onClick={handleExport}>
          <Download className="mr-2 h-4 w-4" />
          Ekspor ke Excel
        </Button>
      </div>
      <Card>
        <CardHeader><CardTitle>Daftar Semua Pesanan</CardTitle></CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {orders.map(order => (
              <AccordionItem value={`item-${order.id}`} key={order.id}>
                <AccordionTrigger>
                  <div className="flex justify-between items-center w-full pr-4">
                    <span>PO #{order.id} - {order.supplier.name}</span>
                    <span className="text-gray-500">{new Date(order.createdAt).toLocaleDateString('id-ID')}</span>
                    {getStatusBadge(order.status)}
                    <span className="font-bold">Rp {new Intl.NumberFormat('id-ID').format(order.totalAmount)}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <Table>
                    <TableHeader><TableRow><TableHead>Bahan Baku</TableHead><TableHead>Jumlah</TableHead><TableHead>Harga Satuan</TableHead><TableHead className="text-right">Subtotal</TableHead></TableRow></TableHeader>
                    <TableBody>
                      {order.items.map(item => (
                        <TableRow key={item.id}><TableCell>{item.material.name}</TableCell><TableCell>{item.quantity}</TableCell><TableCell>Rp {new Intl.NumberFormat('id-ID').format(item.price)}</TableCell><TableCell className="text-right">Rp {new Intl.NumberFormat('id-ID').format(item.price * item.quantity)}</TableCell></TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {order.status !== 'DITERIMA' && (
                    <div className="text-right mt-4">
                      <Button onClick={() => handleReceiveOrder(order.id)}>
                        Tandai Telah Diterima
                      </Button>
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
