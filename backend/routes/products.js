// routes/products.js

const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET: Mendapatkan semua produk
router.get('/', async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Tidak bisa mengambil data produk' });
  }
});

// ==========================================================
//      TAMBAHKAN BLOK KODE INI
// ==========================================================
// GET: Mendapatkan satu produk spesifik berdasarkan ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
    });
    // Jika produk ditemukan, kirim datanya. Jika tidak, kirim error 404.
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: `Produk dengan ID ${id} tidak ditemukan.` });
    }
  } catch (error) {
    res.status(500).json({ error: 'Tidak bisa mengambil data produk.' });
  }
});
// ==========================================================


// POST: Membuat produk baru
router.post('/', async (req, res) => {
  try {
    const { name, price, stock } = req.body;
    const newProduct = await prisma.product.create({
      data: { name, price: parseFloat(price), stock: parseInt(stock) },
    });
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: 'Tidak bisa membuat produk baru' });
  }
});

// PUT: Memperbarui produk berdasarkan ID
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, price, stock } = req.body;
  try {
    const updatedProduct = await prisma.product.update({
      where: { id: parseInt(id) },
      data: { name, price: parseFloat(price), stock: parseInt(stock) },
    });
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: `Tidak bisa memperbarui produk dengan ID ${id}` });
  }
});

// DELETE: Menghapus produk berdasarkan ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.product.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: `Tidak bisa menghapus produk dengan ID ${id}` });
  }
});

module.exports = router;