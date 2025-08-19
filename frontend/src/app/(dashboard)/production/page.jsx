'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import authenticatedFetch from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Hammer, ArrowLeft } from 'lucide-react';
import { toast } from "sonner"; // Impor fungsi toast

export default function ProductionPage() {
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await authenticatedFetch('/products');
        if (!response.ok) throw new Error('Gagal memuat daftar produk');
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        toast.error(err.message); // Ganti setError dengan toast.error
      }
    };
    fetchProducts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProductId) {
        toast.warning('Silakan pilih produk terlebih dahulu.');
        return;
    }
    setLoading(true);

    const promise = () => new Promise(async (resolve, reject) => {
        try {
            const response = await authenticatedFetch('/production-orders', {
                method: 'POST',
                body: JSON.stringify({
                productId: parseInt(selectedProductId),
                quantity: parseInt(quantity),
                }),
            });

            const result = await response.json();
            if (!response.ok) {
                const errorMessage = result.details ? `${result.error} ${result.details.join(', ')}` : result.error;
                throw new Error(errorMessage || 'Terjadi kesalahan.');
            }
            
            setSelectedProductId('');
            setQuantity('');
            resolve(result); // Kirim data sukses ke toast
        } catch (err) {
            reject(err); // Kirim error ke toast
        } finally {
            setLoading(false);
        }
    });

    toast.promise(promise, {
        loading: 'Memproses produksi...',
        success: (result) => `Produksi berhasil! Stok ${result.data.updatedProduct.name} sekarang ${result.data.updatedProduct.stock}.`,
        error: (err) => err.message,
    });
  };

  return (
    <div className="container mx-auto p-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Catat Produksi Baru</h1>
        <Link href="/">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke menu
          </Button>
        </Link>
      </div>
      
      <Card className="max-w-lg">
        <CardHeader><CardTitle>Formulir Produksi</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="product">Pilih Produk yang Akan Dibuat</Label>
              <Select onValueChange={setSelectedProductId} value={selectedProductId}>
                <SelectTrigger id="product"><SelectValue placeholder="-- Pilih Produk --" /></SelectTrigger>
                <SelectContent>
                  {products.map(product => (
                    <SelectItem key={product.id} value={String(product.id)}>{product.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity">Jumlah Produksi</Label>
              <Input type="number" id="quantity" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="e.g., 10" required />
            </div>
            <Button type="submit" disabled={loading} className="w-full bg-green-600 hover:bg-green-700">
              <Hammer className="mr-2 h-4 w-4" />
              {loading ? 'Memproses...' : 'Produksi Sekarang'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
