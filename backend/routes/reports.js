// routes/reports.js

const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.get('/profit-loss', async (req, res) => {
  try {
    // 1. Hitung total pendapatan (tidak berubah)
    const totalRevenueResult = await prisma.salesOrder.aggregate({
      _sum: { totalAmount: true },
    });
    const totalRevenue = totalRevenueResult._sum.totalAmount || 0;

    // 2. Hitung total biaya bahan baku (tidak berubah)
    const totalCostResult = await prisma.purchaseOrder.aggregate({
      _sum: { totalAmount: true },
    });
    const totalCostOfGoods = totalCostResult._sum.totalAmount || 0;

    // BARU: 3. Hitung total biaya operasional
    const totalExpenseResult = await prisma.expense.aggregate({
        _sum: { amount: true },
    });
    const totalOperationalCost = totalExpenseResult._sum.amount || 0;

    // 4. Hitung Laba Kotor dan Laba Bersih
    const grossProfit = totalRevenue - totalCostOfGoods;
    const netProfit = grossProfit - totalOperationalCost;

    res.json({
      totalRevenue,
      totalCostOfGoods,
      totalOperationalCost, // Data baru
      grossProfit,
      netProfit, // Data baru
    });

  } catch (error) {
    console.error("Error calculating profit-loss:", error);
    res.status(500).json({ error: 'Tidak bisa menghitung data laporan.' });
  }
});

module.exports = router;