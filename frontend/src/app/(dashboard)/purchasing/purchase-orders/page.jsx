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
import { PlusCircle, Trash2, Truck, ArrowLeft } from 'lucide-react';
import { toast } from "sonner";

export default function PurchaseOrderPage() {
  // Data master
  const [suppliers, setSuppliers] = useState([]);
  const [materials, setMaterials] = useState([]);
  
  // State untuk form utama
  const [selectedSupplierId, setSelectedSupplierId] = useState('');
  const [orderItems, setOrderItems] = useState([]);

  // State untuk form tambah item - Diubah agar value awalnya string kosong
  const [currentItem, setCurrentItem] = useState({ materialId: '', quantity: '', price: '', name: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [suppliersRes, materialsRes] = await Promise.all([
          authenticatedFetch('/suppliers'),
          authenticatedFetch('/materials'),
        ]);
        if (!suppliersRes.ok || !materialsRes.ok) throw new Error('Gagal memuat data master.');
        
        const suppliersData = await suppliersRes.json();
        const materialsData = await materialsRes.json();
        setSuppliers(suppliersData);
        setMaterials(materialsData);
      } catch (err) {
        toast.error(err.message);
      }
    };
    fetchData();
  }, []);

  const handleAddItem = () => {
    // Ubah input string menjadi angka untuk validasi
    const quantity = parseFloat(currentItem.quantity);
    const price = parseFloat(currentItem.price);

    if (!currentItem.materialId || isNaN(quantity) || quantity <= 0 || isNaN(price) || price <= 0) {
      toast.warning('Pilih bahan, masukkan jumlah, dan harga yang valid.');
      return;
    }
    if (orderItems.some(item => item.materialId === currentItem.materialId)) {
        toast.warning('Bahan baku sudah ada di dalam pesanan.');
        return;
    }
    
    // Tambahkan item dengan nilai yang sudah diubah menjadi angka
    setOrderItems([...orderItems, { ...currentItem, quantity, price }]);
    
    // Reset form item ke string kosong
    setCurrentItem({ materialId: '', quantity: '', price: '', name: '' });
  };

  const handleRemoveItem = (materialId) => {
    setOrderItems(orderItems.filter(item => item.materialId !== materialId));
  };

  const handleMaterialSelect = (materialId) => {
    const material = materials.find(m => m.id === parseInt(materialId));
    if (material) {
      setCurrentItem({ ...currentItem, materialId: material.id, name: material.name });
    }
  };
  
  const calculateTotal = () => {
      return orderItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleSubmitOrder = async () => {
    if (!selectedSupplierId || orderItems.length === 0) {
      toast.warning('Pilih pemasok dan tambahkan minimal satu bahan baku.');
      return;
    }
    setLoading(true);

    const promise = () => new Promise(async (resolve, reject) => {
      try {
        const payload = {
          supplierId: parseInt(selectedSupplierId),
          items: orderItems.map(({ materialId, quantity, price }) => ({ materialId, quantity, price })),
        };
        const response = await authenticatedFetch('/purchase-orders', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error);
        
        setSelectedSupplierId('');
        setOrderItems([]);
        resolve(result);
      } catch (err) {
        reject(err);
      } finally {
        setLoading(false);
      }
    });

    toast.promise(promise, {
      loading: 'Membuat pesanan pembelian...',
      success: 'Pesanan pembelian berhasil dibuat! Stok telah diperbarui.',
      error: (err) => err.message,
    });
  };

  return (
    <div className="container mx-auto p-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Buat Pesanan Pembelian Baru</h1>
        <Link href="/">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke menu
          </Button>
        </Link>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 space-y-6">
            <Card>
                <CardHeader><CardTitle>Detail Pesanan Pembelian</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label>Pilih Pemasok</Label>
                        <Select onValueChange={setSelectedSupplierId} value={selectedSupplierId}>
                            <SelectTrigger><SelectValue placeholder="-- Pilih Pemasok --" /></SelectTrigger>
                            <SelectContent>
                                {suppliers.map(s => <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="border-t pt-4">
                        <Label className="font-medium">Tambah Bahan Baku</Label>
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-2 items-end">
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="material-select" className="text-sm text-gray-600">Bahan Baku</Label>
                                <Select onValueChange={handleMaterialSelect} value={currentItem.materialId ? String(currentItem.materialId) : ""}>
                                    <SelectTrigger id="material-select"><SelectValue placeholder="Pilih..." /></SelectTrigger>
                                    <SelectContent>
                                        {materials.map(m => <SelectItem key={m.id} value={String(m.id)}>{m.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="quantity" className="text-sm text-gray-600">Jumlah</Label>
                                {/* Diubah agar tidak ada fallback value */}
                                <Input id="quantity" type="number" min="1" placeholder="Jumlah" value={currentItem.quantity} onChange={(e) => setCurrentItem({...currentItem, quantity: e.target.value})} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="price" className="text-sm text-gray-600">Harga Satuan</Label>
                                {/* Diubah agar tidak ada fallback value */}
                                <Input id="price" type="number" min="0" placeholder="Harga" value={currentItem.price} onChange={(e) => setCurrentItem({...currentItem, price: e.target.value})} />
                            </div>
                            <Button type="button" onClick={handleAddItem} className="w-full">
                                <PlusCircle className="mr-2 h-4 w-4" /> Tambah
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader><CardTitle>Item Pesanan</CardTitle></CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader><TableRow><TableHead>Bahan Baku</TableHead><TableHead>Jumlah</TableHead><TableHead>Harga Satuan</TableHead><TableHead>Subtotal</TableHead><TableHead></TableHead></TableRow></TableHeader>
                        <TableBody>
                            {orderItems.map(item => (
                                <TableRow key={item.materialId}>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell>{item.quantity}</TableCell>
                                    <TableCell>Rp {new Intl.NumberFormat('id-ID').format(item.price)}</TableCell>
                                    <TableCell>Rp {new Intl.NumberFormat('id-ID').format(item.price * item.quantity)}</TableCell>
                                    <TableCell><Button variant="ghost" size="icon" onClick={() => handleRemoveItem(item.materialId)}><Trash2 className="h-4 w-4 text-red-500" /></Button></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>

        <div>
            <Card>
                <CardHeader><CardTitle>Ringkasan</CardTitle></CardHeader>
                <CardContent className="space-y-4 text-lg">
                    <div className="flex justify-between"><span>Total:</span> <span className="font-bold">Rp {new Intl.NumberFormat('id-ID').format(calculateTotal())}</span></div>
                </CardContent>
                <CardFooter>
                    <Button onClick={handleSubmitOrder} disabled={loading} className="w-full">
                        <Truck className="mr-2 h-4 w-4" /> {loading ? 'Memproses...' : 'Buat Pesanan Pembelian'}
                    </Button>
                </CardFooter>
            </Card>
        </div>
      </div>
    </div>
  );
}
