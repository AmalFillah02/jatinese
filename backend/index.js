// backend/index.js

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Impor rute dan middleware
const materialRoutes = require('./routes/materials');
const productRoutes = require('./routes/products');
const bomRoutes = require('./routes/boms');
const productionRoutes = require('./routes/productions');
const dashboardRoutes = require('./routes/dashboard');
const authRoutes = require('./routes/auth');
const customerRoutes = require('./routes/customers');
const salesOrderRoutes = require('./routes/salesOrders');
const invoiceRoutes = require('./routes/invoices');
const paymentRoutes = require('./routes/payments');
const employeeRoutes = require('./routes/employees');
const supplierRoutes = require('./routes/suppliers');
const purchaseOrderRoutes = require('./routes/purchaseOrders');
const reportRoutes = require('./routes/reports');
const expenseRoutes = require('./routes/expenses');
const expenseCategoryRoutes = require('./routes/expenseCategories');
const payrollRoutes = require('./routes/payroll');
const userRoutes = require('./routes/users');

const authMiddleware = require('./middleware/authMiddleware');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const corsOptions = {
  origin: 'http://localhost:3000', // Hanya izinkan akses dari origin frontend Anda
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: ['Content-Type', 'Authorization'], // WAJIB: Izinkan header Authorization
};

app.use(cors(corsOptions));

app.use(express.json());

// Rute Publik (tidak perlu login)
app.use('/api/auth', authRoutes);

// Rute yang Dilindungi Middleware
app.use('/api/dashboard', authMiddleware, dashboardRoutes);
app.use('/api/materials', authMiddleware, materialRoutes);
app.use('/api/products/:productId/boms', authMiddleware, bomRoutes);
app.use('/api/products', authMiddleware, productRoutes);
app.use('/api/production-orders', authMiddleware, productionRoutes);
app.use('/api/customers', authMiddleware, customerRoutes);
app.use('/api/sales-orders', authMiddleware, salesOrderRoutes);
app.use('/api/invoices', authMiddleware, invoiceRoutes);
app.use('/api/payments', authMiddleware, paymentRoutes);
app.use('/api/employees', authMiddleware, employeeRoutes);
app.use('/api/suppliers', authMiddleware, supplierRoutes);
app.use('/api/payroll', authMiddleware, payrollRoutes);
app.use('/api/purchase-orders', authMiddleware, purchaseOrderRoutes);
app.use('/api/reports', authMiddleware, reportRoutes);
app.use('/api/expenses', authMiddleware, expenseRoutes);
app.use('/api/expense-categories', authMiddleware, expenseCategoryRoutes);
app.use('/api/users', authMiddleware, userRoutes);

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Backend server berjalan di http://localhost:${PORT}`);
});