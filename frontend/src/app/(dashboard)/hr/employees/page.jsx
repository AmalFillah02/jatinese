'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import authenticatedFetch from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Pencil, Trash2, CalendarIcon, ArrowLeft } from 'lucide-react';
import { toast } from "sonner";
import { format } from "date-fns";

export default function EmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({ name: '', position: '', phone: '', joinDate: new Date(), salary: '' });
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(null);
  const [editData, setEditData] = useState({ name: '', position: '', phone: '', joinDate: new Date(), status: 'AKTIF', salary: 0 });

  const fetchEmployees = async () => {
    try {
      const response = await authenticatedFetch('/employees');
      if (!response.ok) throw new Error('Gagal mengambil data karyawan');
      const data = await response.json();
      setEmployees(data);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEmployees(); }, []);
  
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...formData, salary: parseFloat(formData.salary) || 0 };
    const promise = () => new Promise(async (resolve, reject) => {
      try {
        const response = await authenticatedFetch('/employees', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Gagal menambah karyawan');
        setFormData({ name: '', position: '', phone: '', joinDate: new Date(), salary: '' });
        fetchEmployees();
        resolve(result);
      } catch (err) { reject(err); }
    });
    toast.promise(promise, { loading: 'Menyimpan...', success: 'Karyawan baru berhasil ditambahkan!', error: (err) => err.message });
  };

  const handleDelete = (id) => {
    const promise = () => new Promise(async (resolve, reject) => {
        if (window.confirm('Yakin ingin menghapus karyawan ini?')) {
            try {
                await authenticatedFetch(`/employees/${id}`, { method: 'DELETE' });
                fetchEmployees();
                resolve();
            } catch (err) { reject(err); }
        } else { reject('Dibatalkan'); }
    });
    toast.promise(promise, { loading: 'Menghapus...', success: 'Karyawan berhasil dihapus.', error: (err) => err.message });
  };
  
  const handleEdit = (employee) => {
    setEditMode(employee.id);
    setEditData({ ...employee, joinDate: new Date(employee.joinDate) });
  };
  
  const handleCancelEdit = () => setEditMode(null);
  
  const handleUpdate = (id) => {
     const payload = { ...editData, salary: parseFloat(editData.salary) || 0 };
     const promise = () => new Promise(async (resolve, reject) => {
        try {
            await authenticatedFetch(`/employees/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
            setEditMode(null);
            fetchEmployees();
            resolve();
        } catch (err) { reject(err); }
    });
    toast.promise(promise, { loading: 'Memperbarui...', success: 'Data karyawan berhasil diperbarui!', error: (err) => err.message });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'AKTIF': return <Badge className="bg-green-500 text-white">Aktif</Badge>;
      case 'CUTI': return <Badge variant="secondary">Cuti</Badge>;
      case 'RESIGN': return <Badge variant="destructive">Resign</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) return <p className="p-8">Memuat data karyawan...</p>;

  return (
    <div className="container mx-auto p-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Manajemen Karyawan</h1>
        <Link href="/?menu=hr">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Submenu
          </Button>
        </Link>
      </div>
      
      <Card>
        <CardHeader><CardTitle>Tambah Karyawan Baru</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
            <div className="space-y-2"><Label>Nama</Label><Input id="name" value={formData.name} onChange={handleInputChange} required /></div>
            <div className="space-y-2"><Label>Jabatan</Label><Input id="position" value={formData.position} onChange={handleInputChange} required /></div>
            <div className="space-y-2"><Label>No. Telepon</Label><Input id="phone" value={formData.phone} onChange={handleInputChange} required /></div>
            <div className="space-y-2"><Label>Gaji (Rp)</Label><Input id="salary" type="number" value={formData.salary} onChange={handleInputChange} placeholder="e.g., 5000000" required /></div>
            <div className="space-y-2"><Label>Tgl. Bergabung</Label>
                <Popover>
                    <PopoverTrigger asChild><Button variant={"outline"} className="w-full justify-start text-left font-normal"><CalendarIcon className="mr-2 h-4 w-4" />{formData.joinDate ? format(formData.joinDate, "PPP") : <span>Pilih tanggal</span>}</Button></PopoverTrigger>
                    <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={formData.joinDate} onSelect={(date) => setFormData({...formData, joinDate: date})} initialFocus /></PopoverContent>
                </Popover>
            </div>
            <Button type="submit" className="w-full"><PlusCircle className="mr-2 h-4 w-4" /> Tambah</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Daftar Karyawan</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow><TableHead>Nama</TableHead><TableHead>Jabatan</TableHead><TableHead>Gaji</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Aksi</TableHead></TableRow></TableHeader>
            <TableBody>
              {employees.map((employee) => (
                <TableRow key={employee.id}>
                  {editMode === employee.id ? (
                    <>
                      <TableCell><Input value={editData.name} onChange={(e) => setEditData({ ...editData, name: e.target.value })} /></TableCell>
                      <TableCell><Input value={editData.position} onChange={(e) => setEditData({ ...editData, position: e.target.value })} /></TableCell>
                      <TableCell><Input type="number" value={editData.salary} onChange={(e) => setEditData({ ...editData, salary: e.target.value })} /></TableCell>
                      <TableCell>
                        <Select onValueChange={(value) => setEditData({ ...editData, status: value })} defaultValue={editData.status}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="AKTIF">Aktif</SelectItem><SelectItem value="CUTI">Cuti</SelectItem><SelectItem value="RESIGN">Resign</SelectItem>
                            </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button onClick={() => handleUpdate(employee.id)} size="sm" className="mr-2">Simpan</Button>
                        <Button onClick={handleCancelEdit} size="sm" variant="outline">Batal</Button>
                      </TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell className="font-medium">{employee.name}</TableCell>
                      <TableCell>{employee.position}</TableCell>
                      <TableCell>Rp {new Intl.NumberFormat('id-ID').format(employee.salary)}</TableCell>
                      <TableCell>{getStatusBadge(employee.status)}</TableCell>
                      <TableCell className="text-right">
                        <Button onClick={() => handleEdit(employee)} variant="ghost" size="icon"><Pencil className="h-4 w-4" /></Button>
                        <Button onClick={() => handleDelete(employee.id)} variant="ghost" size="icon" className="text-red-500 hover:text-red-600"><Trash2 className="h-4 w-4" /></Button>
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