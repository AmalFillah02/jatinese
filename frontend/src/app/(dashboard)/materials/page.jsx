'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // BARU: Impor useRouter
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
import { PlusCircle, Pencil, Trash2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

export default function MaterialsPage() {
  const [materials, setMaterials] = useState([]);
  const [name, setName] = useState('');
  const [stock, setStock] = useState('');
  const [unit, setUnit] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editMode, setEditMode] = useState(null);
  const [editData, setEditData] = useState({ name: '', stock: '', unit: '' });
  
  const router = useRouter(); // BARU: Inisialisasi router

  const fetchMaterials = async () => {
    try {
      const response = await authenticatedFetch('/materials');
      if (!response.ok) throw new Error('Gagal mengambil data dari server');
      const data = await response.json();
      setMaterials(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await authenticatedFetch('/materials', {
        method: 'POST',
        body: JSON.stringify({ name, stock: parseFloat(stock), unit }),
      });
      if (!response.ok) throw new Error('Gagal menambahkan material');
      setName('');
      setStock('');
      setUnit('');
      fetchMaterials();
      toast.success('Material baru berhasil ditambahkan!');
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      try {
        const response = await authenticatedFetch(`/materials/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) throw new Error('Gagal menghapus data.');
        fetchMaterials();
        toast.success('Material berhasil dihapus.');
      } catch (err) {
        setError(err.message);
        toast.error(err.message);
      }
    }
  };

  const handleEdit = (material) => {
    setEditMode(material.id);
    setEditData({ name: material.name, stock: material.stock, unit: material.unit });
  };

  const handleCancelEdit = () => {
    setEditMode(null);
  };

  const handleUpdate = async (id) => {
    try {
      const response = await authenticatedFetch(`/materials/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
          name: editData.name,
          stock: parseFloat(editData.stock),
          unit: editData.unit,
        }),
      });
      if (!response.ok) throw new Error('Gagal memperbarui data.');
      setEditMode(null);
      fetchMaterials();
      toast.success('Data material berhasil diperbarui!');
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    }
  };

  if (loading) return <p className="p-8">Memuat...</p>;
  if (error) return <p className="p-8 text-red-500">Error: {error}</p>;

  return (
    <div className="container mx-auto p-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Manajemen Bahan Baku</h1>
        {/* BARU: Ganti Link dengan Button onClick */}
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tambah Material Baru</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="name">Nama Material</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Kayu Jati" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stock">Stok</Label>
              <Input id="stock" type="number" value={stock} onChange={(e) => setStock(e.target.value)} placeholder="e.g., 50" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit">Satuan</Label>
              <Input id="unit" value={unit} onChange={(e) => setUnit(e.target.value)} placeholder="e.g., meter, pcs" required />
            </div>
            <Button type="submit" className="w-full">
              <PlusCircle className="mr-2 h-4 w-4" /> Tambah
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Material</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>Stok</TableHead>
                <TableHead>Satuan</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {materials.map((material) => (
                <TableRow key={material.id}>
                  {editMode === material.id ? (
                    <>
                      <TableCell><Input value={editData.name} onChange={(e) => setEditData({ ...editData, name: e.target.value })} /></TableCell>
                      <TableCell><Input type="number" value={editData.stock} onChange={(e) => setEditData({ ...editData, stock: e.target.value })} /></TableCell>
                      <TableCell><Input value={editData.unit} onChange={(e) => setEditData({ ...editData, unit: e.target.value })} /></TableCell>
                      <TableCell className="text-right">
                        <Button onClick={() => handleUpdate(material.id)} size="sm" className="mr-2">Simpan</Button>
                        <Button onClick={handleCancelEdit} size="sm" variant="outline">Batal</Button>
                      </TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell className="font-medium">{material.name}</TableCell>
                      <TableCell>{material.stock}</TableCell>
                      <TableCell>{material.unit}</TableCell>
                      <TableCell className="text-right">
                        <Button onClick={() => handleEdit(material)} variant="ghost" size="icon">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button onClick={() => handleDelete(material.id)} variant="ghost" size="icon" className="text-red-500 hover:text-red-600">
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
