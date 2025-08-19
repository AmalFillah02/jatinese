'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import authenticatedFetch from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { toast } from "sonner";
import { Button } from '@/components/ui/button';
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from 'lucide-react';

export default function SalesHistoryPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fungsi fetchOrders perlu didefinisikan di dalam komponen agar bisa dipanggil ulang
  const fetchOrders = async () => {
    try {
      const response = await authenticatedFetch('/sales-orders');
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

  // FUNGSI YANG HILANG: Untuk membuat faktur
  const handleCreateInvoice = async (salesOrderId) => {
    const promise = () => new Promise(async (resolve, reject) => {
        try {
            const response = await authenticatedFetch('/invoices', {
                method: 'POST',
                body: JSON.stringify({ salesOrderId }),
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
        loading: 'Membuat faktur...',
        success: 'Faktur berhasil dibuat!',
        error: (err) => err.message,
    });
  };


  if (loading) return <p className="p-8">Memuat riwayat pesanan...</p>;

  return (
    <div className="container mx-auto p-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Riwayat Pesanan Penjualan</h1>
        <Link href="/">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke menu
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Semua Pesanan</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {orders.map(order => (
              <AccordionItem value={`item-${order.id}`} key={order.id}>
                <AccordionTrigger>
                  <div className="flex justify-between items-center w-full pr-4">
                    <span>Pesanan #{order.id} - {order.customer.name}</span>
                    <span className="text-gray-500">{new Date(order.createdAt).toLocaleDateString('id-ID')}</span>
                    <span className="font-bold">Rp {new Intl.NumberFormat('id-ID').format(order.totalAmount)}</span>
                    {/* LOGIKA TAMPILAN YANG HILANG: Status faktur */}
                    <div>
                      {order.invoice ? (
                        <Badge variant="secondary">Sudah Dibuat Faktur</Badge>
                      ) : (
                        <Badge variant="destructive">Belum Dibuat Faktur</Badge>
                      )}
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Produk</TableHead>
                        <TableHead>Jumlah</TableHead>
                        <TableHead>Harga Satuan</TableHead>
                        <TableHead className="text-right">Subtotal</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {order.items.map(item => (
                        <TableRow key={item.id}>
                          <TableCell>{item.product.name}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>Rp {new Intl.NumberFormat('id-ID').format(item.price)}</TableCell>
                          <TableCell className="text-right">Rp {new Intl.NumberFormat('id-ID').format(item.price * item.quantity)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {/* LOGIKA TAMPILAN YANG HILANG: Tombol buat faktur */}
                  {!order.invoice && (
                    <div className="text-right mt-4">
                      <Button onClick={() => handleCreateInvoice(order.id)}>
                        Buat Faktur untuk Pesanan Ini
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
