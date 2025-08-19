// routes/payments.js

const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET: Mendapatkan semua riwayat pembayaran
router.get('/', async (req, res) => {
  try {
    const payments = await prisma.payment.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        invoice: {
          include: {
            salesOrder: {
              include: {
                customer: true,
              },
            },
          },
        },
      },
    });
    res.json(payments);
  } catch (error) {
    console.error("[Payments GET] Error:", error); // Logging tambahan
    res.status(500).json({ error: 'Tidak bisa mengambil riwayat pembayaran.' });
  }
});


// POST: Mencatat pembayaran baru untuk sebuah faktur
router.post('/', async (req, res) => {
  const { invoiceId, amount, method } = req.body;

  // Logging untuk melihat data yang masuk
  console.log(`[Payments POST] Menerima permintaan untuk Invoice ID: ${invoiceId}, Amount: ${amount}, Method: ${method}`);

  if (!invoiceId || !amount || !method) {
    return res.status(400).json({ error: 'Invoice ID, jumlah, dan metode pembayaran harus diisi.' });
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const invoice = await tx.invoice.findUnique({
        where: { id: parseInt(invoiceId) },
      });

      if (!invoice) {
        throw new Error('Faktur tidak ditemukan.');
      }
      if (invoice.status === 'PAID') {
        throw new Error('Faktur ini sudah lunas.');
      }

      const newPayment = await tx.payment.create({
        data: {
          invoiceId: parseInt(invoiceId),
          amount: parseFloat(amount),
          method: method,
        },
      });

      const updatedInvoice = await tx.invoice.update({
        where: { id: parseInt(invoiceId) },
        data: { status: 'PAID' },
      });

      return { newPayment, updatedInvoice };
    });

    res.status(201).json({
      message: 'Pembayaran berhasil dicatat!',
      data: result,
    });

  } catch (error) {
    // Logging error yang lebih detail
    console.error(`[Payments POST] Gagal mencatat pembayaran untuk Invoice ID: ${invoiceId}. Error:`, error.message);
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
