// routes/productions.js

const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// POST: Membuat sebuah perintah produksi baru
// Ini adalah endpoint utama kita
router.post('/', async (req, res) => {
  const { productId, quantity } = req.body;

  if (!productId || !quantity || quantity <= 0) {
    return res.status(400).json({ error: 'Product ID dan quantity (lebih dari 0) harus diisi.' });
  }

  try {
    // 1. Ambil resep (BOM) untuk produk yang akan dibuat, beserta data materialnya
    const bomItems = await prisma.bomItem.findMany({
      where: { productId: parseInt(productId) },
      include: { material: true }, // Sertakan data stok material saat ini
    });

    if (bomItems.length === 0) {
      return res.status(400).json({ error: 'Produk ini tidak memiliki resep (BOM). Tidak bisa diproduksi.' });
    }

    // 2. Cek apakah stok semua bahan baku mencukupi
    const insufficientMaterials = [];
    for (const item of bomItems) {
      const requiredStock = item.quantity * quantity; // Jumlah dibutuhkan = resep x jumlah produksi
      if (item.material.stock < requiredStock) {
        insufficientMaterials.push(`${item.material.name} (butuh: ${requiredStock}, tersedia: ${item.material.stock})`);
      }
    }

    if (insufficientMaterials.length > 0) {
      return res.status(400).json({
        error: 'Stok bahan baku tidak mencukupi.',
        details: insufficientMaterials,
      });
    }

    // 3. Lakukan semua operasi database dalam satu transaksi
    // Jika salah satu gagal, semua akan dibatalkan (rollback)
    const result = await prisma.$transaction(async (tx) => {
      // a. Kurangi stok setiap bahan baku
      for (const item of bomItems) {
        const requiredStock = item.quantity * quantity;
        await tx.material.update({
          where: { id: item.materialId },
          data: { stock: { decrement: requiredStock } },
        });
      }

      // b. Tambah stok produk jadi
      const updatedProduct = await tx.product.update({
        where: { id: parseInt(productId) },
        data: { stock: { increment: parseInt(quantity) } },
      });

      // c. Buat catatan riwayat produksi
      const productionOrder = await tx.productionOrder.create({
        data: {
          productId: parseInt(productId),
          quantity: parseInt(quantity),
          status: 'SELESAI',
        },
      });

      return { productionOrder, updatedProduct };
    });

    res.status(201).json({
      message: 'Produksi berhasil dicatat!',
      data: result,
    });

  } catch (error) {
    console.error('Error saat proses produksi:', error);
    res.status(500).json({ error: 'Terjadi kesalahan pada server saat proses produksi.' });
  }
});

module.exports = router;