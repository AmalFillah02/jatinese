// erp-mebel-backend/routes/dashboard.js

const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.get('/summary', async (req, res) => {
  try {
    // Ambil data yang sudah ada
    const productCount = await prisma.product.count();
    const materialCount = await prisma.material.count();
    const products = await prisma.product.findMany({
      select: { name: true, price: true, stock: true },
    });
    const totalInventoryValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);
    const lowStockMaterials = await prisma.material.findMany({
      where: { stock: { lt: 10 } },
      orderBy: { stock: 'asc' },
    });

    // --- DATA BARU UNTUK CHARTS ---

    // 1. Data untuk Pie Chart & Radar Chart
    const productStockDistribution = products.map(p => ({ name: p.name, value: p.stock }));
    const materialStockLevels = await prisma.material.findMany({
        select: { name: true, stock: true },
        take: 6, // Ambil 6 material teratas untuk radar chart
    });

    // 2. Data untuk Area Chart (Riwayat Produksi 7 hari terakhir)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const productionHistory = await prisma.productionOrder.groupBy({
      by: ['createdAt'],
      where: { createdAt: { gte: sevenDaysAgo } },
      _sum: { quantity: true },
      orderBy: { createdAt: 'asc' },
    });
    
    // Format data agar mudah dibaca oleh Recharts
    const formattedHistory = productionHistory.map(item => ({
        date: new Date(item.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
        total: item._sum.quantity,
    }));


    res.json({
      productCount,
      materialCount,
      totalInventoryValue,
      lowStockMaterials,
      productStockDistribution, // Data baru
      materialStockLevels,      // Data baru
      productionHistory: formattedHistory, // Data baru
    });

  } catch (error) {
    console.error('Error saat mengambil data summary:', error);
    res.status(500).json({ error: 'Tidak bisa mengambil data ringkasan.' });
  }
});

module.exports = router;