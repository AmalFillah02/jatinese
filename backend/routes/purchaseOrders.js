// routes/purchaseOrders.js

const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET: Mendapatkan semua riwayat pesanan pembelian
router.get('/', async (req, res) => {
  try {
    const purchaseOrders = await prisma.purchaseOrder.findMany({
      orderBy: { createdAt: 'desc' },
      include: { supplier: true, items: { include: { material: true } } },
    });
    res.json(purchaseOrders);
  } catch (error) {
    res.status(500).json({ error: 'Tidak bisa mengambil riwayat pesanan pembelian.' });
  }
});

// POST: Membuat pesanan pembelian baru (TANPA mengubah stok)
router.post('/', async (req, res) => {
  const { supplierId, items } = req.body;

  if (!supplierId || !items || items.length === 0) {
    return res.status(400).json({ error: 'Pemasok dan item harus diisi.' });
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

      const newPurchaseOrder = await tx.purchaseOrder.create({
        data: {
          supplierId: parseInt(supplierId),
          totalAmount: totalAmount,
          status: 'DIBUAT', // Status awal
        },
      });

      // Buat item-item pesanan
      await tx.purchaseOrderItem.createMany({
        data: items.map(item => ({
          purchaseOrderId: newPurchaseOrder.id,
          materialId: item.materialId,
          quantity: item.quantity,
          price: item.price,
        })),
      });

      return newPurchaseOrder;
    });

    res.status(201).json({ message: 'Pesanan pembelian berhasil dibuat!', data: result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// BARU: PATCH - Menandai pesanan telah diterima & MENAMBAH STOK
router.patch('/:id/receive', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await prisma.$transaction(async (tx) => {
      // 1. Ambil pesanan dan item-itemnya
      const purchaseOrder = await tx.purchaseOrder.findUnique({
        where: { id: parseInt(id) },
        include: { items: true },
      });

      if (!purchaseOrder) throw new Error('Pesanan pembelian tidak ditemukan.');
      if (purchaseOrder.status === 'DITERIMA') throw new Error('Pesanan ini sudah pernah diterima.');

      // 2. Tambah stok untuk setiap item
      for (const item of purchaseOrder.items) {
        await tx.material.update({
          where: { id: item.materialId },
          data: { stock: { increment: item.quantity } },
        });
      }

      // 3. Update status pesanan menjadi "DITERIMA"
      const updatedOrder = await tx.purchaseOrder.update({
        where: { id: parseInt(id) },
        data: { status: 'DITERIMA' },
      });

      return updatedOrder;
    });

    res.json({ message: 'Barang berhasil diterima dan stok telah diperbarui!', data: result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;