'use client';

import { useState, useEffect } from 'react';
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
import { PlusCircle, Pencil, Trash2, BookText, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

export default function ProductsPage() {
  const [products, setProducts]       = useState([]);
  const [name, setName]               = useState('');
  const [price, setPrice]             = useState('');
  const [stock, setStock]             = useState('');
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);
  const [editMode, setEditMode]       = useState(null);
  const [editData, setEditData]       = useState({ name: '', price: '', stock: '' });

  const fetchProducts = async () => {
    try {
      const response = await authenticatedFetch('/products');
      if (!response.ok) throw new Error('Gagal mengambil data produk');
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const promise = () => new Promise(async (resolve, reject) => {
        try {
            const response = await authenticatedFetch('/products', {
                method: 'POST',
                body: JSON.stringify({ name, price: parseFloat(price), stock: parseInt(stock) }),
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error || 'Gagal menambah produk');
            setName(''); setPrice(''); setStock('');
            fetchProducts();
            resolve(result);
        } catch (err) {
            reject(err);
        }
    });
    toast.promise(promise, { loading: 'Menyimpan...', success: 'Produk baru berhasil ditambahkan!', error: (err) => err.message });
  };

  const handleDelete = (id) => {
    const promise = () => new Promise(async (resolve, reject) => {
        if (window.confirm('Yakin ingin menghapus produk ini?')) {
            try {
                await authenticatedFetch(`/products/${id}`, { method: 'DELETE' });
                fetchProducts();
                resolve();
            } catch (err) { reject(err); }
        } else { reject('Dibatalkan'); }
    });
    toast.promise(promise, { loading: 'Menghapus...', success: 'Produk berhasil dihapus.', error: (err) => err.message });
  };
  
  const handleEdit = (product) => {
    setEditMode(product.id);
    setEditData({ name: product.name, price: product.price, stock: product.stock });
  };
  
  const handleCancelEdit = () => setEditMode(null);
  
  const handleUpdate = (id) => {
     const promise = () => new Promise(async (resolve, reject) => {
        try {
            await authenticatedFetch(`/products/${id}`, {
                method: 'PUT',
                body: JSON.stringify({ ...editData, price: parseFloat(editData.price), stock: parseInt(editData.stock) }),
            });
            setEditMode(null);
            fetchProducts();
            resolve();
        } catch (err) { reject(err); }
    });
    toast.promise(promise, { loading: 'Memperbarui...', success: 'Data produk berhasil diperbarui!', error: (err) => err.message });
  };

  if (loading) return <p className="p-8">Memuat...</p>;
  if (error) return <p className="p-8 text-red-500">Error: {error}</p>;

  return (
    <div className="container mx-auto p-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Manajemen Produk Jadi</h1>
        <Link href="/">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke menu
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tambah Produk Baru</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="name">Nama Produk</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Meja Makan Jati" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Harga</Label>
              <Input id="price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="e.g., 2500000" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stock">Stok</Label>
              <Input id="stock" type="number" value={stock} onChange={(e) => setStock(e.target.value)} placeholder="e.g., 50" required />
            </div>
            <Button type="submit" className="w-full">
              <PlusCircle className="mr-2 h-4 w-4" /> Tambah
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Produk</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>Harga</TableHead>
                <TableHead>Stok</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  {editMode === product.id ? (
                    <>
                      <TableCell><Input value={editData.name} onChange={(e) => setEditData({ ...editData, name: e.target.value })} /></TableCell>
                      <TableCell><Input type="number" value={editData.price} onChange={(e) => setEditData({ ...editData, price: e.target.value })} /></TableCell>
                      <TableCell><Input type="number" value={editData.stock} onChange={(e) => setEditData({ ...editData, stock: e.target.value })} /></TableCell>
                      <TableCell className="text-right">
                        <Button onClick={() => handleUpdate(product.id)} size="sm" className="mr-2">Simpan</Button>
                        <Button onClick={handleCancelEdit} size="sm" variant="outline">Batal</Button>
                      </TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>Rp {new Intl.NumberFormat('id-ID').format(product.price)}</TableCell>
                      <TableCell>{product.stock}</TableCell>
                      <TableCell className="text-right space-x-1">
                        <Link href={`/products/${product.id}`}>
                          <Button variant="outline" size="icon" aria-label="Resep">
                            <BookText className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button onClick={() => handleEdit(product)} variant="ghost" size="icon" aria-label="Edit">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button onClick={() => handleDelete(product.id)} variant="ghost" size="icon" aria-label="Hapus" className="text-red-500 hover:text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
