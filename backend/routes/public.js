// Buat file baru di: erp-mebel-backend/routes/public.js

const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET /api/public/products
// Endpoint ini bersifat publik dan tidak memerlukan login
// untuk mengambil semua produk untuk ditampilkan di katalog.
router.get('/products', async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        stock: {
          gt: 0, // Hanya tampilkan produk yang stoknya lebih dari 0
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        name: true,
        price: true,
        // Kita tidak menyertakan 'stock' atau data sensitif lainnya
      },
    });
    res.json(products);
  } catch (error) {
    console.error("Gagal mengambil produk publik:", error);
    res.status(500).json({ error: 'Tidak bisa mengambil data produk.' });
  }
});

module.exports = router;
