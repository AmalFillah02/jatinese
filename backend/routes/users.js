// routes/users.js
const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');

// GET: Mendapatkan semua pengguna
router.get('/', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: { id: true, email: true, createdAt: true }, // Jangan kirim password hash
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Tidak bisa mengambil data pengguna.' });
  }
});

// POST: Membuat pengguna baru (hanya untuk admin)
router.post('/', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email dan password harus diisi.' });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: { email, password: hashedPassword },
    });
    res.status(201).json({ id: newUser.id, email: newUser.email });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'Email sudah digunakan.' });
    }
    res.status(500).json({ error: 'Gagal membuat pengguna baru.' });
  }
});

module.exports = router;