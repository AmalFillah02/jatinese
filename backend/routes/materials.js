// routes/materials.js

const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET: Mendapatkan semua material
// URL-nya menjadi '/' karena '/api/materials' sudah didefinisikan di index.js
router.get('/', async (req, res) => {
  try {
    const materials = await prisma.material.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(materials);
  } catch (error) {
    res.status(500).json({ error: 'Tidak bisa mengambil data material' });
  }
});

// POST: Membuat material baru
router.post('/', async (req, res) => {
  try {
    const { name, stock, unit } = req.body;
    const newMaterial = await prisma.material.create({
      data: { name, stock: parseFloat(stock), unit },
    });
    res.status(201).json(newMaterial);
  } catch (error) {
    res.status(500).json({ error: 'Tidak bisa membuat material baru' });
  }
});

// PUT: Memperbarui material berdasarkan ID
// URL-nya menjadi '/:id'
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, stock, unit } = req.body;
  try {
    const updatedMaterial = await prisma.material.update({
      where: { id: parseInt(id) },
      data: { name, stock: parseFloat(stock), unit },
    });
    res.json(updatedMaterial);
  } catch (error) {
    res.status(500).json({ error: `Tidak bisa memperbarui material dengan ID ${id}` });
  }
});

// DELETE: Menghapus material berdasarkan ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.material.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: `Tidak bisa menghapus material dengan ID ${id}` });
  }
});

// Jangan lupa ekspor router-nya
module.exports = router;