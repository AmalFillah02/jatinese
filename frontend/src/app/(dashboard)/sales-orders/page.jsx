'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import authenticatedFetch from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { PlusCircle, Trash2, ShoppingCart, ArrowLeft } from 'lucide-react';
import { toast } from "sonner";

export default function SalesOrderPage() {
  // Data master
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  
  // State untuk form utama
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [orderItems, setOrderItems] = useState([]); // Menyimpan item-item pesanan

  // State untuk form tambah item
  const [currentItem, setCurrentItem] = useState({ productId: '', quantity: 1, name: '', price: 0 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Ambil data pelanggan dan produk saat komponen dimuat
    const fetchData = async () => {
      try {
        const [customersRes, productsRes] = await Promise.all([
          authenticatedFetch('/customers'),
          authenticatedFetch('/products'),
        ]);
        if (!customersRes.ok || !productsRes.ok) throw new Error('Gagal memuat data master.');
        
        const customersData = await customersRes.json();
        const productsData = await productsRes.json();
        setCustomers(customersData);
        setProducts(productsData);
      } catch (err) {
        toast.error(err.message);
      }
    };
    fetchData();
  }, []);

  const handleAddItem = () => {
    if (!currentItem.productId || currentItem.quantity <= 0) {
      toast.warning('Pilih produk dan masukkan jumlah yang valid.');
      return;
    }
    // Cek duplikat
    if (orderItems.some(item => item.productId === currentItem.productId)) {
        toast.warning('Produk sudah ada di dalam pesanan.');
        return;
    }
    setOrderItems([...orderItems, currentItem]);
    // Reset form item
    setCurrentItem({ productId: '', quantity: 1, name: '', price: 0 });
  };

  const handleRemoveItem = (productId) => {
    setOrderItems(orderItems.filter(item => item.productId !== productId));
  };

  const handleProductSelect = (productId) => {
    const product = products.find(p => p.id === parseInt(productId));
    if (product) {
      setCurrentItem({ ...currentItem, productId: product.id, name: product.name, price: product.price });
    }
  };
  
  const calculateTotal = () => {
      return orderItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleSubmitOrder = async () => {
    if (!selectedCustomerId || orderItems.length === 0) {
      toast.warning('Pilih pelanggan dan tambahkan minimal satu produk.');
      return;
    }
    setLoading(true);

    const promise = () => new Promise(async (resolve, reject) => {
      try {
        const payload = {
          customerId: parseInt(selectedCustomerId),
          items: orderItems.map(({ productId, quantity }) => ({ productId, quantity })),
        };
        const response = await authenticatedFetch('/sales-orders', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error);
        
        // Reset form setelah berhasil
        setSelectedCustomerId('');
        setOrderItems([]);
        resolve(result);
      } catch (err) {
        reject(err);
      } finally {
        setLoading(false);
      }
    });

    toast.promise(promise, {
      loading: 'Membuat pesanan...',
      success: 'Pesanan penjualan berhasil dibuat!',
      error: (err) => err.message,
    });
  };

  return (
    <div className="container mx-auto p-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Buat Pesanan Penjualan Baru</h1>
        <Link href="/">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke menu
          </Button>
        </Link>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Kolom Kiri: Detail Pesanan */}
        <div className="lg:col-span-2 space-y-6">
            <Card>
                <CardHeader><CardTitle>Detail Pesanan</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label>Pilih Pelanggan</Label>
                        <Select onValueChange={setSelectedCustomerId} value={selectedCustomerId}>
                            <SelectTrigger><SelectValue placeholder="-- Pilih Pelanggan --" /></SelectTrigger>
                            <SelectContent>
                                {customers.map(c => <SelectItem key={c.id} value={String(c.id)}>{c.name} - {c.phone}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="border-t pt-4">
                        <Label>Tambah Produk ke Pesanan</Label>
                        <div className="flex items-end gap-4 mt-2">
                            <div className="flex-grow">
                                <Select onValueChange={handleProductSelect}>
                                    <SelectTrigger><SelectValue placeholder="-- Pilih Produk --" /></SelectTrigger>
                                    <SelectContent>
                                        {products.map(p => <SelectItem key={p.id} value={String(p.id)}>{p.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="w-24">
                                <Input type="number" min="1" value={currentItem.quantity} onChange={(e) => setCurrentItem({...currentItem, quantity: parseInt(e.target.value) || 1})} />
                            </div>
                            <Button type="button" onClick={handleAddItem}><PlusCircle className="h-4 w-4" /></Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader><CardTitle>Item Pesanan</CardTitle></CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader><TableRow><TableHead>Produk</TableHead><TableHead>Jumlah</TableHead><TableHead>Harga Satuan</TableHead><TableHead>Subtotal</TableHead><TableHead></TableHead></TableRow></TableHeader>
                        <TableBody>
                            {orderItems.map(item => (
                                <TableRow key={item.productId}>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell>{item.quantity}</TableCell>
                                    <TableCell>Rp {new Intl.NumberFormat('id-ID').format(item.price)}</TableCell>
                                    <TableCell>Rp {new Intl.NumberFormat('id-ID').format(item.price * item.quantity)}</TableCell>
                                    <TableCell><Button variant="ghost" size="icon" onClick={() => handleRemoveItem(item.productId)}><Trash2 className="h-4 w-4 text-red-500" /></Button></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>

        {/* Kolom Kanan: Ringkasan & Aksi */}
        <div>
            <Card>
                <CardHeader><CardTitle>Ringkasan</CardTitle></CardHeader>
                <CardContent className="space-y-4 text-lg">
                    <div className="flex justify-between"><span>Total:</span> <span className="font-bold">Rp {new Intl.NumberFormat('id-ID').format(calculateTotal())}</span></div>
                </CardContent>
                <CardFooter>
                    <Button onClick={handleSubmitOrder} disabled={loading} className="w-full">
                        <ShoppingCart className="mr-2 h-4 w-4" /> {loading ? 'Memproses...' : 'Buat Pesanan'}
                    </Button>
                </CardFooter>
            </Card>
        </div>
      </div>
    </div>
  );
}
