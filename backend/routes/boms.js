// erp-mebel-backend/routes/boms.js

const express = require('express');
// WAJIB: Gunakan { mergeParams: true } untuk mewarisi :productId dari router induk
const router = express.Router({ mergeParams: true });
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET: Mendapatkan semua resep untuk satu produk
// Rute ini menjadi '/' karena '/api/products/:productId/boms' sudah ditangani di index.js
router.get('/', async (req, res) => {
  // Ambil productId dari req.params, bukan req.query
  const { productId } = req.params;

  if (!productId || isNaN(parseInt(productId))) {
    return res.status(400).json({ error: "Product ID dari URL tidak valid." });
  }

  try {
    const bomItems = await prisma.bomItem.findMany({
      where: { productId: parseInt(productId) },
      include: { material: true },
    });
    res.json(bomItems);
  } catch (error) {
    res.status(500).json({ error: `Tidak bisa mengambil resep.` });
  }
});

// POST: Membuat item resep baru
router.post('/', async (req, res) => {
  const { productId } = req.params;
  const { materialId, quantity } = req.body;

  if (!materialId || !quantity) {
    return res.status(400).json({ error: "materialId dan quantity harus diisi." });
  }

  try {
    const newBomItem = await prisma.bomItem.create({
      data: {
        productId: parseInt(productId),
        materialId: parseInt(materialId),
        quantity: parseFloat(quantity),
      },
    });
    res.status(201).json(newBomItem);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'Bahan baku ini sudah ada dalam resep produk.' });
    }
    res.status(500).json({ error: 'Tidak bisa menambah resep.' });
  }
});

// DELETE: Menghapus item resep
// Rutenya menjadi '/:materialId' untuk menargetkan material spesifik dalam BOM produk
router.delete('/:materialId', async (req, res) => {
  const { productId, materialId } = req.params;

  try {
    await prisma.bomItem.delete({
      where: {
        productId_materialId: {
          productId: parseInt(productId),
          materialId: parseInt(materialId),
        },
      },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: `Tidak bisa menghapus resep.` });
  }
});

module.exports = router;