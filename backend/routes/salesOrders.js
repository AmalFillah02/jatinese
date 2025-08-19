// routes/salesOrders.js

const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET: Mendapatkan semua riwayat pesanan penjualan
router.get('/', async (req, res) => {
  try {
    const salesOrders = await prisma.salesOrder.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        customer: true, // Sertakan data pelanggan
        items: {
          include: {
            product: true, // Sertakan data produk di setiap item
          },
        },
        invoice: true, // Sertakan data faktur yang terhubung
      },
    });
    res.json(salesOrders);
  } catch (error) {
    res.status(500).json({ error: 'Tidak bisa mengambil riwayat pesanan.' });
  }
});

// POST: Membuat pesanan penjualan baru
router.post('/', async (req, res) => {
  const { customerId, items } = req.body; // items adalah array: [{ productId, quantity }]

  if (!customerId || !items || items.length === 0) {
    return res.status(400).json({ error: 'Pelanggan dan minimal satu item produk harus diisi.' });
  }

  try {
    // Lakukan semua operasi dalam satu transaksi yang aman
    const result = await prisma.$transaction(async (tx) => {
      let totalAmount = 0;
      const productDetails = [];

      // 1. Validasi stok dan hitung total harga
      for (const item of items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });

        if (!product) {
          throw new Error(`Produk dengan ID ${item.productId} tidak ditemukan.`);
        }
        if (product.stock < item.quantity) {
          throw new Error(`Stok untuk produk "${product.name}" tidak mencukupi (tersedia: ${product.stock}, diminta: ${item.quantity}).`);
        }
        
        totalAmount += product.price * item.quantity;
        productDetails.push({ ...product, orderQuantity: item.quantity });
      }

      // 2. Buat "kepala" pesanan (SalesOrder)
      const newSalesOrder = await tx.salesOrder.create({
        data: {
          customerId: parseInt(customerId),
          totalAmount: totalAmount,
        },
      });

      // 3. Buat "detail" pesanan (SalesOrderItem)
      for (const product of productDetails) {
        await tx.salesOrderItem.create({
          data: {
            salesOrderId: newSalesOrder.id,
            productId: product.id,
            quantity: product.orderQuantity,
            price: product.price, // Simpan harga saat transaksi
          },
        });

        // 4. Kurangi stok produk
        await tx.product.update({
          where: { id: product.id },
          data: { stock: { decrement: product.orderQuantity } },
        });
      }

      return newSalesOrder;
    });

    res.status(201).json({
      message: 'Pesanan penjualan berhasil dibuat!',
      data: result,
    });

  } catch (error) {
    // Kirim pesan error yang jelas ke frontend
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
