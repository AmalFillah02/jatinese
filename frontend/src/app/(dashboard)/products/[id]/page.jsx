'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import authenticatedFetch from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PlusCircle, Trash2, ArrowLeft } from 'lucide-react';

export default function ProductDetailPage() {
  const [product, setProduct] = useState(null);
  const [bomItems, setBomItems] = useState([]);
  const [allMaterials, setAllMaterials] = useState([]);
  
  const [selectedMaterialId, setSelectedMaterialId] = useState('');
  const [quantity, setQuantity] = useState('');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const params = useParams();
  const productId = params.id;
  const router = useRouter();

  // --- Fungsi Logika (Tidak Berubah) ---
  const fetchData = useCallback(async () => {
    if (!productId || isNaN(parseInt(productId))) {
      setError("Product ID tidak valid.");
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const [productRes, bomRes, materialsRes] = await Promise.all([
        authenticatedFetch(`/products/${productId}`),
        authenticatedFetch(`/products/${productId}/boms`),
        authenticatedFetch(`/materials`)
      ]);

      if (!productRes.ok) throw new Error(`Gagal mengambil detail produk`);
      if (!bomRes.ok) throw new Error(`Gagal mengambil resep/BOM`);
      if (!materialsRes.ok) throw new Error(`Gagal mengambil bahan baku`);

      const productData = await productRes.json();
      const bomData = await bomRes.json();
      const materialsData = await materialsRes.json();

      setProduct(productData);
      setBomItems(bomData);
      setAllMaterials(materialsData);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAddBomItem = async (e) => {
    e.preventDefault();
    if (!selectedMaterialId) {
        alert('Silakan pilih bahan baku terlebih dahulu.');
        return;
    }
    try {
      const response = await authenticatedFetch(`/products/${productId}/boms`, {
        method: 'POST',
        body: JSON.stringify({ materialId: selectedMaterialId, quantity }),
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Gagal menambah resep');
      }
      setSelectedMaterialId('');
      setQuantity('');
      fetchData();
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };
  
  const handleDeleteBomItem = async (materialId) => {
    if(window.confirm('Yakin ingin menghapus bahan baku ini dari resep?')) {
      try {
        await authenticatedFetch(`/products/${productId}/boms/${materialId}`, {
          method: 'DELETE',
        });
        fetchData();
      } catch(err) {
        alert('Gagal menghapus resep: ' + err.message);
      }
    }
  };
  // --- Akhir Fungsi Logika ---

  if (loading) return <p className="p-8">Memuat data...</p>;
  if (error) return <p className="p-8 text-red-500">Error: {error}</p>;
  if (!product) return <p className="p-8">Produk tidak ditemukan.</p>;

  return (
    <div className="container mx-auto p-8 space-y-8">
      <div>
        <Button variant="outline" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Daftar Produk
        </Button>
        <h1 className="text-3xl font-bold">Resep Produksi (Bill of Materials)</h1>
        <h2 className="text-xl text-gray-500">{product.name}</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tambah Bahan Baku ke Resep</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddBomItem} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="space-y-2">
              <Label htmlFor="material">Pilih Bahan Baku</Label>
              <Select onValueChange={setSelectedMaterialId} value={selectedMaterialId}>
                <SelectTrigger>
                  <SelectValue placeholder="-- Pilih Material --" />
                </SelectTrigger>
                <SelectContent>
                  {allMaterials.map(material => (
                    <SelectItem key={material.id} value={String(material.id)}>{material.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity">Jumlah Dibutuhkan</Label>
              <Input type="number" id="quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="e.g., 5.5" required />
            </div>
            <Button type="submit">
              <PlusCircle className="mr-2 h-4 w-4" /> Tambah ke Resep
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Bahan Baku untuk Resep Ini</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Bahan Baku</TableHead>
                <TableHead>Jumlah</TableHead>
                <TableHead>Satuan</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bomItems.map(item => (
                <TableRow key={item.materialId}>
                  <TableCell className="font-medium">{item.material.name}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{item.material.unit}</TableCell>
                  <TableCell className="text-right">
                    <Button onClick={() => handleDeleteBomItem(item.materialId)} variant="ghost" size="icon" className="text-red-500 hover:text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
