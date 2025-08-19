// routes/expenses.js

const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET: Mendapatkan semua transaksi pengeluaran
router.get('/', async (req, res) => {
  try {
    const expenses = await prisma.expense.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        category: true, // Sertakan nama kategori
      },
    });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ error: 'Tidak bisa mengambil data pengeluaran.' });
  }
});

// POST: Membuat catatan pengeluaran baru
router.post('/', async (req, res) => {
  const { description, amount, expenseCategoryId } = req.body;

  if (!description || !amount || !expenseCategoryId) {
    return res.status(400).json({ error: 'Deskripsi, jumlah, dan kategori harus diisi.' });
  }

  try {
    const newExpense = await prisma.expense.create({
      data: {
        description,
        amount: parseFloat(amount),
        expenseCategoryId: parseInt(expenseCategoryId),
      },
    });
    res.status(201).json(newExpense);
  } catch (error) {
    res.status(500).json({ error: 'Gagal mencatat pengeluaran.' });
  }
});

module.exports = router;