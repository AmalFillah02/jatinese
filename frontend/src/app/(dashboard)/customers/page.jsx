'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
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
import { toast } from "sonner";

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [formData, setFormData] = useState({ name: '', phone: '', address: '' });
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(null);
  const [editData, setEditData] = useState({ name: '', phone: '', address: '' });

  const fetchCustomers = async () => {
    try {
      const response = await authenticatedFetch('/customers');
      if (!response.ok) throw new Error('Gagal mengambil data pelanggan');
      const data = await response.json();
      setCustomers(data);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const promise = () => new Promise(async (resolve, reject) => {
      try {
        const response = await authenticatedFetch('/customers', {
          method: 'POST',
          body: JSON.stringify(formData),
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Gagal menambah pelanggan');
        
        setFormData({ name: '', phone: '', address: '' });
        fetchCustomers();
        resolve(result);
      } catch (err) {
        reject(err);
      }
    });

    toast.promise(promise, {
      loading: 'Menyimpan pelanggan...',
      success: 'Pelanggan baru berhasil ditambahkan!',
      error: (err) => err.message,
    });
  };

  const handleDelete = (id) => {
    const promise = () => new Promise(async (resolve, reject) => {
        if (window.confirm('Yakin ingin menghapus pelanggan ini?')) {
            try {
                const response = await authenticatedFetch(`/customers/${id}`, { method: 'DELETE' });
                if (!response.ok) throw new Error('Gagal menghapus pelanggan');
                fetchCustomers();
                resolve();
            } catch (err) {
                reject(err);
            }
        } else {
            reject('Penghapusan dibatalkan');
        }
    });

    toast.promise(promise, {
        loading: 'Menghapus pelanggan...',
        success: 'Pelanggan berhasil dihapus.',
        error: (err) => err.message,
    });
  };
  
  const handleEdit = (customer) => {
    setEditMode(customer.id);
    setEditData({ name: customer.name, phone: customer.phone, address: customer.address || '' });
  };
  
  const handleCancelEdit = () => setEditMode(null);
  
  const handleUpdate = (id) => {
     const promise = () => new Promise(async (resolve, reject) => {
        try {
            const response = await authenticatedFetch(`/customers/${id}`, {
                method: 'PUT',
                body: JSON.stringify(editData),
            });
            if (!response.ok) throw new Error('Gagal memperbarui pelanggan');
            setEditMode(null);
            fetchCustomers();
            resolve();
        } catch (err) {
            reject(err);
        }
    });
    
    toast.promise(promise, {
        loading: 'Memperbarui data...',
        success: 'Data pelanggan berhasil diperbarui!',
        error: (err) => err.message,
    });
  };

  if (loading) return <p className="p-8">Memuat data pelanggan...</p>;

  return (
    <div className="container mx-auto p-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Manajemen Pelanggan</h1>
        <Link href="/">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke menu
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader><CardTitle>Tambah Pelanggan Baru</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="space-y-2"><Label htmlFor="name">Nama Pelanggan</Label><Input id="name" value={formData.name} onChange={handleInputChange} placeholder="Nama lengkap" required /></div>
            <div className="space-y-2"><Label htmlFor="phone">No. Telepon</Label><Input id="phone" value={formData.phone} onChange={handleInputChange} placeholder="0812..." required /></div>
            <div className="space-y-2"><Label htmlFor="address">Alamat</Label><Input id="address" value={formData.address} onChange={handleInputChange} placeholder="Alamat (opsional)" /></div>
            <Button type="submit" className="w-full"><PlusCircle className="mr-2 h-4 w-4" /> Tambah</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Daftar Pelanggan</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>No. Telepon</TableHead>
                <TableHead>Alamat</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer) => (
                <TableRow key={customer.id}>
                  {editMode === customer.id ? (
                    <>
                      <TableCell><Input value={editData.name} onChange={(e) => setEditData({ ...editData, name: e.target.value })} /></TableCell>
                      <TableCell><Input value={editData.phone} onChange={(e) => setEditData({ ...editData, phone: e.target.value })} /></TableCell>
                      <TableCell><Input value={editData.address} onChange={(e) => setEditData({ ...editData, address: e.target.value })} /></TableCell>
                      <TableCell className="text-right">
                        <Button onClick={() => handleUpdate(customer.id)} size="sm" className="mr-2">Simpan</Button>
                        <Button onClick={handleCancelEdit} size="sm" variant="outline">Batal</Button>
                      </TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell className="font-medium">{customer.name}</TableCell>
                      <TableCell>{customer.phone}</TableCell>
                      <TableCell>{customer.address}</TableCell>
                      <TableCell className="text-right">
                        <Button onClick={() => handleEdit(customer)} variant="ghost" size="icon"><Pencil className="h-4 w-4" /></Button>
                        <Button onClick={() => handleDelete(customer.id)} variant="ghost" size="icon" className="text-red-500 hover:text-red-600"><Trash2 className="h-4 w-4" /></Button>
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
