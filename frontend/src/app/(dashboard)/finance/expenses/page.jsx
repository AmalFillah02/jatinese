'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import authenticatedFetch from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, ArrowLeft } from 'lucide-react';
import { toast } from "sonner";

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({ description: '', amount: '', expenseCategoryId: '' });
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [expensesRes, categoriesRes] = await Promise.all([
        authenticatedFetch('/expenses'),
        authenticatedFetch('/expense-categories')
      ]);
      if (!expensesRes.ok || !categoriesRes.ok) throw new Error('Gagal memuat data.');
      
      const expensesData = await expensesRes.json();
      const categoriesData = await categoriesRes.json();
      setExpenses(expensesData);
      setCategories(categoriesData);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.expenseCategoryId) {
        toast.warning("Silakan pilih kategori biaya.");
        return;
    }
    const promise = () => new Promise(async (resolve, reject) => {
      try {
        const response = await authenticatedFetch('/expenses', {
          method: 'POST',
          body: JSON.stringify({
            ...formData,
            amount: parseFloat(formData.amount),
            expenseCategoryId: parseInt(formData.expenseCategoryId)
          }),
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Gagal mencatat pengeluaran');
        
        setFormData({ description: '', amount: '', expenseCategoryId: '' });
        fetchData(); // Muat ulang data pengeluaran dan kategori
        resolve(result);
      } catch (err) {
        reject(err);
      }
    });

    toast.promise(promise, {
      loading: 'Menyimpan pengeluaran...',
      success: 'Pengeluaran berhasil dicatat!',
      error: (err) => err.message,
    });
  };

  if (loading) return <p className="p-8">Memuat data...</p>;

  return (
    <div className="container mx-auto p-8 space-y-8">
       <div className="flex justify-between items-center">
      <h1 className="text-3xl font-bold">Pencatatan Biaya Operasional</h1>
        <Link href="/">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Submenu
          </Button>
        </Link>
      </div>
      
      <Card>
        <CardHeader><CardTitle>Catat Pengeluaran Baru</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="space-y-2">
              <Label htmlFor="expenseCategoryId">Kategori Biaya</Label>
              <Select onValueChange={(value) => setFormData({...formData, expenseCategoryId: value})} value={formData.expenseCategoryId}>
                <SelectTrigger id="expenseCategoryId"><SelectValue placeholder="-- Pilih Kategori --" /></SelectTrigger>
                <SelectContent>
                  {categories.map(cat => <SelectItem key={cat.id} value={String(cat.id)}>{cat.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi</Label>
              <Input id="description" value={formData.description} onChange={handleInputChange} placeholder="e.g., Pembayaran Listrik Juli" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Jumlah (Rp)</Label>
              <Input id="amount" type="number" value={formData.amount} onChange={handleInputChange} placeholder="e.g., 500000" required />
            </div>
            <Button type="submit" className="w-full"><PlusCircle className="mr-2 h-4 w-4" /> Catat Biaya</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Riwayat Pengeluaran</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tanggal</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Deskripsi</TableHead>
                <TableHead className="text-right">Jumlah</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell>{new Date(expense.createdAt).toLocaleDateString('id-ID')}</TableCell>
                  <TableCell>{expense.category.name}</TableCell>
                  <TableCell className="font-medium">{expense.description}</TableCell>
                  <TableCell className="text-right">Rp {new Intl.NumberFormat('id-ID').format(expense.amount)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
