// routes/suppliers.js

const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET: Mendapatkan semua data pemasok
router.get('/', async (req, res) => {
  try {
    const suppliers = await prisma.supplier.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(suppliers);
  } catch (error) {
    res.status(500).json({ error: 'Tidak bisa mengambil data pemasok.' });
  }
});

// POST: Membuat data pemasok baru
router.post('/', async (req, res) => {
  const { name, contactPerson, phone, address } = req.body;

  if (!name || !phone) {
    return res.status(400).json({ error: 'Nama pemasok dan No. Telepon harus diisi.' });
  }

  try {
    const newSupplier = await prisma.supplier.create({
      data: { name, contactPerson, phone, address },
    });
    res.status(201).json(newSupplier);
  } catch (error) {
    if (error.code === 'P2002') { // Error jika nama atau no. telepon duplikat
      return res.status(409).json({ error: 'Nama atau No. Telepon sudah digunakan.' });
    }
    res.status(500).json({ error: 'Gagal membuat data pemasok baru.' });
  }
});

// PUT: Memperbarui data pemasok berdasarkan ID
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, contactPerson, phone, address } = req.body;

  try {
    const updatedSupplier = await prisma.supplier.update({
      where: { id: parseInt(id) },
      data: { name, contactPerson, phone, address },
    });
    res.json(updatedSupplier);
  } catch (error) {
    res.status(500).json({ error: `Gagal memperbarui pemasok dengan ID ${id}.` });
  }
});

// DELETE: Menghapus data pemasok berdasarkan ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.supplier.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: `Gagal menghapus pemasok dengan ID ${id}.` });
  }
});

module.exports = router;