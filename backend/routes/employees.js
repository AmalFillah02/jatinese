// routes/employees.js

const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET: Mendapatkan semua data karyawan
router.get('/', async (req, res) => {
  try {
    const employees = await prisma.employee.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: 'Tidak bisa mengambil data karyawan.' });
  }
});

// POST: Membuat data karyawan baru
router.post('/', async (req, res) => {
  const { name, position, phone, joinDate } = req.body;

  if (!name || !position || !phone || !joinDate) {
    return res.status(400).json({ error: 'Semua field harus diisi.' });
  }

  try {
    const newEmployee = await prisma.employee.create({
      data: {
        name,
        position,
        phone,
        joinDate: new Date(joinDate), // Pastikan format tanggal benar
      },
    });
    res.status(201).json(newEmployee);
  } catch (error) {
    if (error.code === 'P2002') { // Error jika no. telepon sudah terdaftar
      return res.status(409).json({ error: 'No. Telepon sudah digunakan.' });
    }
    res.status(500).json({ error: 'Gagal membuat data karyawan baru.' });
  }
});

// PUT: Memperbarui data karyawan berdasarkan ID
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, position, phone, joinDate, status, salary } = req.body;

  try {
    const updatedEmployee = await prisma.employee.update({
      where: { id: parseInt(id) },
      data: {
        name,
        position,
        phone,
        joinDate: new Date(joinDate),
        status,
        salary: parseFloat(salary),
      },
    });
    res.json(updatedEmployee);
  } catch (error) {
    res.status(500).json({ error: `Gagal memperbarui karyawan dengan ID ${id}.` });
  }
});

// DELETE: Menghapus data karyawan berdasarkan ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.employee.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: `Gagal menghapus karyawan dengan ID ${id}.` });
  }
});

module.exports = router;