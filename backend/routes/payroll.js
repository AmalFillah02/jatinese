// routes/payroll.js

const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// BARU: GET - Mengecek status penggajian untuk bulan ini
router.get('/status', async (req, res) => {
  try {
    const now = new Date();
    const currentMonth = now.getMonth() + 1; // getMonth() 0-11, jadi +1
    const currentYear = now.getFullYear();

    // 1. Ambil semua karyawan aktif
    const activeEmployees = await prisma.employee.findMany({
      where: { status: 'AKTIF', salary: { gt: 0 } },
      orderBy: { name: 'asc' },
    });

    // 2. Ambil riwayat penggajian untuk bulan & tahun ini
    const paidHistory = await prisma.payrollHistory.findMany({
      where: { month: currentMonth, year: currentYear },
      select: { employeeId: true }, // Hanya butuh ID karyawan
    });
    const paidEmployeeIds = new Set(paidHistory.map(p => p.employeeId));

    // 3. Gabungkan data: tambahkan status 'isPaid' ke setiap karyawan
    const employeesWithStatus = activeEmployees.map(emp => ({
      ...emp,
      isPaidThisMonth: paidEmployeeIds.has(emp.id),
    }));

    res.json(employeesWithStatus);
  } catch (error) {
    res.status(500).json({ error: 'Tidak bisa mengambil status penggajian.' });
  }
});

// POST: Menjalankan proses penggajian (Dirombak)
router.post('/run', async (req, res) => {
  try {
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    const result = await prisma.$transaction(async (tx) => {
      let salaryCategory = await tx.expenseCategory.findUnique({ where: { name: 'Gaji Karyawan' } });
      if (!salaryCategory) {
        salaryCategory = await tx.expenseCategory.create({ data: { name: 'Gaji Karyawan' } });
      }

      const paidHistory = await tx.payrollHistory.findMany({
        where: { month: currentMonth, year: currentYear },
        select: { employeeId: true },
      });
      const paidEmployeeIds = new Set(paidHistory.map(p => p.employeeId));
      
      // Ambil karyawan yang AKTIF, punya gaji, DAN BELUM dibayar bulan ini
      const employeesToPay = await tx.employee.findMany({
        where: {
          status: 'AKTIF',
          salary: { gt: 0 },
          id: { notIn: Array.from(paidEmployeeIds) }, // Filter penting!
        },
      });

      if (employeesToPay.length === 0) {
        throw new Error('Semua karyawan aktif sudah digaji untuk bulan ini.');
      }

      // Proses penggajian
      for (const employee of employeesToPay) {
        // Buat catatan pengeluaran
        const newExpense = await tx.expense.create({
          data: {
            expenseCategoryId: salaryCategory.id,
            description: `Gaji ${now.toLocaleString('id-ID', { month: 'long' })} ${currentYear} untuk ${employee.name}`,
            amount: employee.salary,
          },
        });
        // Buat catatan riwayat penggajian
        await tx.payrollHistory.create({
          data: {
            employeeId: employee.id,
            month: currentMonth,
            year: currentYear,
            amountPaid: employee.salary,
            expenseId: newExpense.id,
          },
        });
      }
      
      return {
        processedCount: employeesToPay.length,
        totalSalaryPaid: employeesToPay.reduce((sum, emp) => sum + emp.salary, 0),
      };
    });

    res.status(201).json({ message: `Penggajian berhasil diproses untuk ${result.processedCount} karyawan.`, data: result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
