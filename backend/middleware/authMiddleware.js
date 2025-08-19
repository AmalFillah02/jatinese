// middleware/authMiddleware.js

const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  // 1. Ambil header 'Authorization'
  const authHeader = req.headers['authorization'];

  // 2. Cek jika header ada, ambil tokennya (formatnya "Bearer TOKEN")
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    // Jika tidak ada token, kirim error 401 Unauthorized
    return res.status(401).json({ error: 'Akses ditolak. Token tidak tersedia.' });
  }

  // 3. Verifikasi token
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      // Jika token tidak valid (misal: kadaluarsa), kirim error 403 Forbidden
      return res.status(403).json({ error: 'Token tidak valid.' });
    }

    // Jika token valid, simpan informasi pengguna di request
    req.user = user;

    // Lanjutkan ke endpoint selanjutnya
    next();
  });
}

module.exports = authMiddleware;