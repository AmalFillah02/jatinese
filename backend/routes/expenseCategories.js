// routes/expenseCategories.js

const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET: Mendapatkan semua kategori biaya
router.get('/', async (req, res) => {
  try {
    const categories = await prisma.expenseCategory.findMany({
      orderBy: { name: 'asc' },
    });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Tidak bisa mengambil data kategori biaya.' });
  }
});

// POST: Membuat kategori biaya baru
router.post('/', async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Nama kategori harus diisi.' });
  }
  try {
    const newCategory = await prisma.expenseCategory.create({ data: { name } });
    res.status(201).json(newCategory);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'Nama kategori sudah ada.' });
    }
    res.status(500).json({ error: 'Gagal membuat kategori baru.' });
  }
});

module.exports = router;