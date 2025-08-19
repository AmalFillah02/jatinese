'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import authenticatedFetch from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from "sonner";
import { ArrowLeft } from 'lucide-react';

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');

  // BARU: State untuk mengontrol dialog secara manual
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchInvoices = async () => {
    try {
      const response = await authenticatedFetch('/invoices');
      if (!response.ok) throw new Error('Gagal memuat daftar faktur.');
      const data = await response.json();
      setInvoices(data);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleOpenPaymentDialog = (invoice) => {
    setSelectedInvoice(invoice);
    setPaymentAmount(invoice.amount);
    setPaymentMethod('TRANSFER');
    setIsDialogOpen(true); // Buka dialog secara manual
  };

  const handleRecordPayment = () => {
    if (!selectedInvoice) return;
    
    const promise = () => new Promise(async (resolve, reject) => {
        try {
            const response = await authenticatedFetch('/payments', {
                method: 'POST',
                body: JSON.stringify({
                    invoiceId: selectedInvoice.id,
                    amount: parseFloat(paymentAmount),
                    method: paymentMethod,
                }),
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error);
            
            fetchInvoices(); // Muat ulang data untuk update status
            resolve(result);
        } catch (err) {
            reject(err);
        }
    });

    toast.promise(promise, {
        loading: 'Mencatat pembayaran...',
        success: 'Pembayaran berhasil dicatat!',
        error: (err) => err.message,
        // BARU: Tutup dialog setelah notifikasi selesai
        finally: () => setIsDialogOpen(false),
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PAID': return <Badge className="bg-green-500 text-white">Lunas</Badge>;
      case 'SENT': return <Badge variant="secondary">Terkirim</Badge>;
      case 'OVERDUE': return <Badge variant="destructive">Jatuh Tempo</Badge>;
      default: return <Badge variant="outline">Draft</Badge>;
    }
  };

  if (loading) return <p className="p-8">Memuat daftar faktur...</p>;

  return (
    // BARU: Kontrol dialog dengan state
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <div className="container mx-auto p-8 space-y-8">
        <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Daftar Faktur</h1>
        <Link href="/">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke menu
          </Button>
        </Link>
      </div>
        <Card>
          <CardHeader><CardTitle>Semua Faktur</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>No. Faktur</TableHead>
                  <TableHead>Pelanggan</TableHead>
                  <TableHead>Tgl. Dibuat</TableHead>
                  <TableHead>Jatuh Tempo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Jumlah</TableHead>
                  <TableHead className="text-center">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map(invoice => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">INV-{invoice.id}</TableCell>
                    <TableCell>{invoice.salesOrder.customer.name}</TableCell>
                    <TableCell>{new Date(invoice.createdAt).toLocaleDateString('id-ID')}</TableCell>
                    <TableCell>{new Date(invoice.dueDate).toLocaleDateString('id-ID')}</TableCell>
                    <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                    <TableCell className="text-right font-bold">Rp {new Intl.NumberFormat('id-ID').format(invoice.amount)}</TableCell>
                    <TableCell className="text-center">
                      {invoice.status !== 'PAID' && (
                        // BARU: DialogTrigger sekarang hanya memicu pembukaan dialog
                        <DialogTrigger asChild>
                          <Button size="sm" onClick={() => handleOpenPaymentDialog(invoice)}>
                            Catat Pembayaran
                          </Button>
                        </DialogTrigger>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Catat Pembayaran untuk INV-{selectedInvoice?.id}</DialogTitle>
          <DialogDescription>
            Isi detail pembayaran di bawah ini. Klik simpan setelah selesai.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount" className="text-right">Jumlah</Label>
            <Input id="amount" type="number" value={paymentAmount} onChange={(e) => setPaymentAmount(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Metode</Label>
            <Select onValueChange={setPaymentMethod} defaultValue={paymentMethod}>
                <SelectTrigger className="col-span-3"><SelectValue placeholder="Pilih metode" /></SelectTrigger>
                <SelectContent>
                    <SelectItem value="TRANSFER">Transfer Bank</SelectItem>
                    <SelectItem value="CASH">Tunai (Cash)</SelectItem>
                    <SelectItem value="QRIS">QRIS</SelectItem>
                </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          {/* BARU: Hapus DialogClose, tombol ini sekarang hanya memanggil fungsi */}
          <Button type="button" onClick={handleRecordPayment}>Simpan Pembayaran</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
