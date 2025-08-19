'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import authenticatedFetch from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { DollarSign, ArrowLeft } from 'lucide-react';

export default function PayrollPage() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalSalaryToPay, setTotalSalaryToPay] = useState(0);

  const fetchPayrollStatus = async () => {
    setLoading(true);
    try {
      const response = await authenticatedFetch('/payroll/status');
      if (!response.ok) throw new Error('Gagal memuat data penggajian.');
      const data = await response.json();
      setEmployees(data);
      
      // Hitung total gaji HANYA untuk yang belum dibayar
      const total = data
        .filter(emp => !emp.isPaidThisMonth)
        .reduce((sum, emp) => sum + emp.salary, 0);
      setTotalSalaryToPay(total);
      
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayrollStatus();
  }, []);

  const handleRunPayroll = () => {
    const promise = () => new Promise(async (resolve, reject) => {
        if (window.confirm(`Anda akan memproses penggajian sebesar Rp ${new Intl.NumberFormat('id-ID').format(totalSalaryToPay)}. Lanjutkan?`)) {
            try {
                const response = await authenticatedFetch('/payroll/run', { method: 'POST' });
                const result = await response.json();
                if (!response.ok) throw new Error(result.error);
                fetchPayrollStatus(); // Muat ulang status setelah berhasil
                resolve(result);
            } catch (err) {
                reject(err);
            }
        } else {
            reject('Proses penggajian dibatalkan.');
        }
    });

    toast.promise(promise, {
        loading: 'Memproses penggajian...',
        success: (result) => result.message,
        error: (err) => err.message,
    });
  };

  const employeesToPayCount = employees.filter(e => !e.isPaidThisMonth).length;

  if (loading) return <p className="p-8">Memuat data penggajian...</p>;

  return (
    <div className="container mx-auto p-8 space-y-8">

      <div className="flex justify-between items-center">
      <h1 className="text-3xl font-bold">Proses Penggajian - {new Date().toLocaleString('id-ID', { month: 'long', year: 'numeric' })}</h1>
        <Link href="/?menu=hr">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Submenu
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Status Penggajian Karyawan Aktif</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Karyawan</TableHead>
                <TableHead>Jabatan</TableHead>
                <TableHead>Gaji Bulanan</TableHead>
                <TableHead className="text-center">Status Bulan Ini</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.map(employee => (
                <TableRow key={employee.id}>
                  <TableCell className="font-medium">{employee.name}</TableCell>
                  <TableCell>{employee.position}</TableCell>
                  <TableCell>Rp {new Intl.NumberFormat('id-ID').format(employee.salary)}</TableCell>
                  <TableCell className="text-center">
                    {employee.isPaidThisMonth ? (
                        <Badge className="bg-green-500 text-white">Sudah Dibayar</Badge>
                    ) : (
                        <Badge variant="destructive">Belum Dibayar</Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex justify-between items-center bg-gray-50 p-4">
            <div className="text-lg">
                Total Gaji Akan Dibayar: <span className="font-bold">Rp {new Intl.NumberFormat('id-ID').format(totalSalaryToPay)}</span>
            </div>
            <Button onClick={handleRunPayroll} disabled={employeesToPayCount === 0}>
                <DollarSign className="mr-2 h-4 w-4" />
                {employeesToPayCount > 0 ? `Jalankan Gaji untuk ${employeesToPayCount} Karyawan` : 'Semua Sudah Digaji'}
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
