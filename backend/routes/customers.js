const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET
router.get('/', async (req, res) => {
    try {
        const customers = await prisma.customer.findMany({
            orderBy: { createdAt: 'desc' },
        });
        res.json(customers);
    } catch (error) {
        res.status(500).json({ error: 'Tidak bisa mengambil data pelanggan.' });
    }
});

//POST
router.post('/', async (req, res) => {
    const { name, phone, address } = req.body;

    if (!name || !phone) {
        return res.status(400).json({ error: 'Nama dan No. Telepon wajib diisi.' });
    }

    // Validasi format nomor telepon (hanya angka + optional + di awal, panjang 8-15 digit)
    const phoneRegex = /^(\+?\d{8,15})$/;
    if (!phoneRegex.test(phone)) {
        return res.status(400).json({ error: 'Format nomor telepon tidak valid.' });
    }

    // Opsional: Auto format jadi +62 kalau dimulai dengan 0
    let formattedPhone = phone;
    if (phone.startsWith('0')) {
        formattedPhone = '+62' + phone.slice(1);
    }

    try {
        const newCustomer = await prisma.customer.create({
            data: { name, phone: formattedPhone, address },
        });
        res.status(201).json(newCustomer);
    } catch (error) {
        if (error.code === 'P2002') { // error jika no. sudah terdaftar
            return res.status(409).json({ error: 'No. Telepon sudah terdaftar.' });
        }
        res.status(500).json({ error: 'Gagal membuat customer baru.' });
    }
});

//PUT
router.put('/:id', async (req, res) => {
    const {id} = req.params;
    const {name, phone, address} = req.body;

    if (!name || !phone) {
        return res.status(400).json({ error: 'Nama dan No. Telepon wajib diisi.' });
    }

    try {
        const updatedCustomer = await prisma.customer.update({
            where: {id: parseInt(id)},
            data: { name, phone, address },
        });
        res.json(updatedCustomer);
    } catch (error) {
        res.status(500).json({ error: `Gagal memperbarui customer dengan ID ${id}.` });
    }
});

// DELETE: Menghapus pelanggan berdasarkan ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.customer.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: `Gagal menghapus pelanggan dengan ID ${id}.` });
  }
});

module.exports = router;