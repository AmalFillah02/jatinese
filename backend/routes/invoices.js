// routes/invoices.js

const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET: Mendapatkan semua faktur
router.get('/', async (req, res) => {
  try {
    const invoices = await prisma.invoice.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        salesOrder: {
          include: {
            customer: true, // Sertakan data pelanggan di setiap faktur
          },
        },
      },
    });
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ error: 'Tidak bisa mengambil data faktur.' });
  }
});

// POST: Membuat faktur baru dari sebuah Sales Order
router.post('/', async (req, res) => {
  const { salesOrderId } = req.body;

  if (!salesOrderId) {
    return res.status(400).json({ error: 'Sales Order ID harus diisi.' });
  }

  try {
    // 1. Cari Sales Order yang sesuai
    const salesOrder = await prisma.salesOrder.findUnique({
      where: { id: parseInt(salesOrderId) },
    });

    if (!salesOrder) {
      return res.status(404).json({ error: 'Sales Order tidak ditemukan.' });
    }

    // 2. Cek apakah faktur untuk pesanan ini sudah ada
    const existingInvoice = await prisma.invoice.findUnique({
        where: { salesOrderId: parseInt(salesOrderId) },
    });

    if (existingInvoice) {
        return res.status(409).json({ error: 'Faktur untuk pesanan ini sudah pernah dibuat.' });
    }

    // 3. Buat faktur baru
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 30); // Jatuh tempo 30 hari dari sekarang

    const newInvoice = await prisma.invoice.create({
      data: {
        salesOrderId: salesOrder.id,
        amount: salesOrder.totalAmount,
        dueDate: dueDate,
        status: 'SENT', // Anggap faktur langsung dikirim
      },
    });

    res.status(201).json({
      message: 'Faktur berhasil dibuat!',
      data: newInvoice,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Gagal membuat faktur.' });
  }
});

module.exports = router;