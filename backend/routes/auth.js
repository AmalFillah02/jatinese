// routes/auth.js

const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Endpoint untuk Registrasi Pengguna Baru
// URL -> POST /api/auth/register

// Endpoint untuk Login
// URL -> POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email dan password harus diisi.' });
  }

  try {
    // 1. Cari pengguna berdasarkan email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ error: 'Email atau password salah.' });
    }

    // 2. Bandingkan password yang diinput dengan hash di database
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Email atau password salah.' });
    }

    // 3. Jika valid, buat token JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'your-default-secret-key', // Ganti dengan secret key Anda
      { expiresIn: '1h' } // Token akan kadaluarsa dalam 1 jam
    );

    res.json({ message: 'Login berhasil!', token });
  } catch (error) {
    res.status(500).json({ error: 'Gagal melakukan login.' });
  }
});

module.exports = router;