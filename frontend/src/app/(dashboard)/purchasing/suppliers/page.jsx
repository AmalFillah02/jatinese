'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import authenticatedFetch from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { PlusCircle, Pencil, Trash2, ArrowLeft } from 'lucide-react';
import { toast } from "sonner";

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState([]);
  const [formData, setFormData] = useState({ name: '', contactPerson: '', phone: '', address: '' });
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(null);
  const [editData, setEditData] = useState({ name: '', contactPerson: '', phone: '', address: '' });

  const fetchSuppliers = async () => {
    try {
      const response = await authenticatedFetch('/suppliers');
      if (!response.ok) throw new Error('Gagal mengambil data pemasok');
      const data = await response.json();
      setSuppliers(data);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const promise = () => new Promise(async (resolve, reject) => {
      try {
        const response = await authenticatedFetch('/suppliers', {
          method: 'POST',
          body: JSON.stringify(formData),
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Gagal menambah pemasok');
        
        setFormData({ name: '', contactPerson: '', phone: '', address: '' });
        fetchSuppliers();
        resolve(result);
      } catch (err) {
        reject(err);
      }
    });
    toast.promise(promise, { loading: 'Menyimpan...', success: 'Pemasok baru berhasil ditambahkan!', error: (err) => err.message });
  };

  const handleDelete = (id) => {
    const promise = () => new Promise(async (resolve, reject) => {
        if (window.confirm('Yakin ingin menghapus pemasok ini?')) {
            try {
                await authenticatedFetch(`/suppliers/${id}`, { method: 'DELETE' });
                fetchSuppliers();
                resolve();
            } catch (err) { reject(err); }
        } else { reject('Dibatalkan'); }
    });
    toast.promise(promise, { loading: 'Menghapus...', success: 'Pemasok berhasil dihapus.', error: (err) => err.message });
  };
  
  const handleEdit = (supplier) => {
    setEditMode(supplier.id);
    setEditData({ 
        name: supplier.name, 
        contactPerson: supplier.contactPerson || '', 
        phone: supplier.phone, 
        address: supplier.address || '' 
    });
  };
  
  const handleCancelEdit = () => setEditMode(null);
  
  const handleUpdate = (id) => {
     const promise = () => new Promise(async (resolve, reject) => {
        try {
            await authenticatedFetch(`/suppliers/${id}`, { method: 'PUT', body: JSON.stringify(editData) });
            setEditMode(null);
            fetchSuppliers();
            resolve();
        } catch (err) { reject(err); }
    });
    toast.promise(promise, { loading: 'Memperbarui...', success: 'Data pemasok berhasil diperbarui!', error: (err) => err.message });
  };

  if (loading) return <p className="p-8">Memuat data pemasok...</p>;

  return (
    <div className="container mx-auto p-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Manajemen Supplier</h1>
        <Link href="/">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke menu
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader><CardTitle>Tambah Pemasok Baru</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
            <div className="space-y-2"><Label htmlFor="name">Nama Pemasok</Label><Input id="name" value={formData.name} onChange={handleInputChange} required /></div>
            <div className="space-y-2"><Label htmlFor="contactPerson">Narahubung</Label><Input id="contactPerson" value={formData.contactPerson} onChange={handleInputChange} /></div>
            <div className="space-y-2"><Label htmlFor="phone">No. Telepon</Label><Input id="phone" value={formData.phone} onChange={handleInputChange} required /></div>
            <div className="space-y-2"><Label htmlFor="address">Alamat</Label><Input id="address" value={formData.address} onChange={handleInputChange} /></div>
            <Button type="submit" className="w-full"><PlusCircle className="mr-2 h-4 w-4" /> Tambah</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Daftar Pemasok</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow><TableHead>Nama</TableHead><TableHead>Narahubung</TableHead><TableHead>No. Telepon</TableHead><TableHead>Alamat</TableHead><TableHead className="text-right">Aksi</TableHead></TableRow></TableHeader>
            <TableBody>
              {suppliers.map((supplier) => (
                <TableRow key={supplier.id}>
                  {editMode === supplier.id ? (
                    <>
                      <TableCell><Input value={editData.name} onChange={(e) => setEditData({ ...editData, name: e.target.value })} /></TableCell>
                      <TableCell><Input value={editData.contactPerson} onChange={(e) => setEditData({ ...editData, contactPerson: e.target.value })} /></TableCell>
                      <TableCell><Input value={editData.phone} onChange={(e) => setEditData({ ...editData, phone: e.target.value })} /></TableCell>
                      <TableCell><Input value={editData.address} onChange={(e) => setEditData({ ...editData, address: e.target.value })} /></TableCell>
                      <TableCell className="text-right">
                        <Button onClick={() => handleUpdate(supplier.id)} size="sm" className="mr-2">Simpan</Button>
                        <Button onClick={handleCancelEdit} size="sm" variant="outline">Batal</Button>
                      </TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell className="font-medium">{supplier.name}</TableCell>
                      <TableCell>{supplier.contactPerson}</TableCell>
                      <TableCell>{supplier.phone}</TableCell>
                      <TableCell>{supplier.address}</TableCell>
                      <TableCell className="text-right">
                        <Button onClick={() => handleEdit(supplier)} variant="ghost" size="icon"><Pencil className="h-4 w-4" /></Button>
                        <Button onClick={() => handleDelete(supplier.id)} variant="ghost" size="icon" className="text-red-500 hover:text-red-600"><Trash2 className="h-4 w-4" /></Button>
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
