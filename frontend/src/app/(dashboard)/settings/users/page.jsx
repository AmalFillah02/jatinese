'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import authenticatedFetch from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { PlusCircle, ArrowLeft } from 'lucide-react';
import { toast } from "sonner";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const response = await authenticatedFetch('/users');
      if (!response.ok) throw new Error('Gagal memuat data pengguna.');
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const promise = () => new Promise(async (resolve, reject) => {
      try {
        const response = await authenticatedFetch('/users', {
          method: 'POST',
          body: JSON.stringify(formData),
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Gagal menambah pengguna');
        
        setFormData({ email: '', password: '' });
        fetchUsers();
        resolve(result);
      } catch (err) {
        reject(err);
      }
    });

    toast.promise(promise, {
      loading: 'Menyimpan pengguna...',
      success: 'Pengguna baru berhasil ditambahkan!',
      error: (err) => err.message,
    });
  };

  if (loading) return <p className="p-8">Memuat data...</p>;

  return (
    <div className="container mx-auto p-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Manajemen Akses</h1>
        <Link href="/?menu=hr">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Submenu
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <Card>
          <CardHeader><CardTitle>Tambah Pengguna Baru</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Pengguna</Label>
                <Input id="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="email@baru.com" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" value={formData.password} onChange={handleInputChange} required />
              </div>
              <Button type="submit" className="w-full"><PlusCircle className="mr-2 h-4 w-4" /> Tambah Pengguna</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Daftar Pengguna</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Tanggal Dibuat</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.email}</TableCell>
                    <TableCell>{new Date(user.createdAt).toLocaleDateString('id-ID')}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
