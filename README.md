# JATiNESE WOOD - Enterprise ERP System

## Deskripsi
**JATiNESE WOOD** adalah sistem ERP (Enterprise Resource Planning) berbasis web yang dirancang khusus untuk industri kayu/furniture. Aplikasi ini merupakan solusi terintegrasi untuk mengelola seluruh aspek operasional bisnis, dari manajemen inventaris, produksi, penjualan, hingga keuangan dan sumber daya manusia.

---

## 🏗️ Teknologi yang Digunakan

### Frontend
- **Next.js 13.5.11** - React framework dengan Server-Side Rendering (SSR)
- **React 18** - Library UI untuk membangun komponen interaktif
- **TailwindCSS 3** - Framework CSS untuk styling yang responsif
- **shadcn/ui** - Koleksi komponen UI pre-built
- **Lucide React** - Icon library modern
- **Framer Motion** - Animasi dan transisi
- **GSAP** - Animasi advanced
- **Three.js / @react-three/fiber** - 3D rendering dengan materi
- **Recharts** - Visualisasi data berupa chart
- **Date-fns** - Manipulasi tanggal

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js 5** - Framework web server
- **Prisma 6.13** - ORM untuk database management
- **TypeScript** - JavaScript dengan tipe
- **PostgreSQL** - Database relasional
- **JWT (JSON Web Token)** - Authentication
- **bcryptjs** - Hashing password
- **CORS** - Cross-Origin Resource Sharing

### Desain
- Dark/Light mode
- Responsive (mobile & desktop)
- Material 3D dengan tekstur kayu

---

## 📂 Struktur Proyek

```
jatinese/
├── backend/
│   ├── api/
│   │   └── index.js          # Express app sederhana
│   ├── middleware/
│   │   └── authMiddleware.js # JWT authentication
│   ├── prisma/
│   │   ├── schema.prisma     # Database schema
│   │   └── migrations/       # Database migrations
│   ├── routes/               # 19 route files
│   ├── index.js             # Main server
│   ├── package.json
│   └── tsconfig.json
│
└── frontend/
    ├── src/
    │   ├── app/             # Next.js App Router
    │   │   ├── (auth)/      # Halaman login
    │   │   ├── (dashboard)/ # Dashboard utama
    │   │   │   ├── analysis      # Analitik & charts
    │   │   │   ├── customers     # Manajemen pelanggan
    │   │   │   ├── dashboard     # Dashboard utama
    │   │   │   ├── finance/      # Laporan keuangan
    │   │   │   │   ├── expense-categories
    │   │   │   │   ├── expenses
    │   │   │   │   ├── invoices
    │   │   │   │   └── payments
    │   │   │   ├── hr/           # Human Resources
    │   │   │   │   ├── employees
    │   │   │   │   └── payrolls
    │   │   │   ├── materials     # Stok bahan baku
    │   │   │   ├── production    # Production orders
    │   │   │   ├── products/     # Manajemen produk
    │   │   │   │   └── [id]/     # Detail produk
    │   │   │   ├── purchasing/   # Pembelian bahan baku
    │   │   │   │   ├── purchase-orders
    │   │   │   │   │   └── history
    │   │   │   │   └── suppliers
    │   │   │   ├── reports/      # Laporan
    │   │   │   │   └── profit-loss
    │   │   │   ├── sales-orders/ # Pesanan penjualan
    │   │   │   │   └── history
    │   │   │   └── settings/     # Manajemen user
    │   │   │       └── users
    │   │   └── (public)/        # Halaman publik
    │   │       ├── about       # Tentang
    │   │       ├── gallery     # Galeri produk (3 style)
    │   │       ├── layout.jsx
    │   │       └── page.jsx
    │   ├── components/
    │   │   ├── layout/         # Header, Footer
    │   │   └── ui/             # 18 komponen shadcn/ui
    │   ├── lib/
    │   │   ├── api.js          # API client
    │   │   └── utils.js        # Utility functions
    │   └── middleware.js
    ├── components.json
    ├── next.config.js
    ├── package.json
    ├── tailwind.config.js
    └── postcss.config.js
```

---

## 🗄️ Database Schema (Prisma)

### Model Utama (15 tabel):

| Model | Deskripsi |
|-------|----------|
| **User** | Pengguna sistem (email, password hash) |
| **Customer** | Data pelanggan |
| **Material** | Bahan baku dengan stok |
| **Product** | Produk jadi dengan stok |
| **BomItem** | Bill of Materials (material untuk produk) |
| **ProductionOrder** | Order produksi |
| **SalesOrder** | Pesanan penjualan |
| **SalesOrderItem** | Item pesanan (relasi ke SalesOrder & Product) |
| **Invoice** | Faktur penjualan |
| **Payment** | Pembayaran invoice |
| **Employee** | Karyawan |
| **Supplier** | Pemasok bahan baku |
| **PurchaseOrder** | Pesanan pembelian bahan baku |
| **PurchaseOrderItem** | Item pembelian (relasi ke PurchaseOrder & Material) |
| **ExpenseCategory** | Kategori pengeluaran |
| **Expense** | Catatan pengeluaran |
| **PayrollHistory** | Riwayat gaji per bulan |

### Relasi Penting:
```
Product ↔ BomItem ↔ Material
SalesOrder ↔ SalesOrderItem ↔ Product
PurchaseOrder ↔ PurchaseOrderItem ↔ Material
Invoice ↔ Payment
Employee ↔ PayrollHistory ↔ Expense
```

---

## 🌐 Fitur-Fitur

### 1. **Dashboard Publik**
- Landing page dengan animasi
- Galeri produk dengan 3 style (Classic, Minimalist, Modern)
- Informasi tentang perusahaan

### 2. **Authentication**
- Login/logout dengan JWT
- Protected routes

### 3. **Dashboard Utama**
- Ringkasan bisnis (jumlah produk, material, nilai inventaris)
- Material dengan stok rendah
- Charts: Pie, Bar, Radar, Area

### 4. **Manajemen Produk & Material**
- CRUD Produk
- CRUD Material (bahan baku)
- Bill of Materials (BOM)

### 5. **Production Management**
- Pembuatan order produksi
- Tracking status (SELESAI, DIPROSES, DIBATALKAN)
- Update stok otomatis

### 6. **Sales & Invoice**
- Buat pesanan penjualan
- Generate invoice otomatis
- Tracking status pembayaran

### 7. **Purchasing**
- Buat order pembelian bahan baku
- History purchase orders
- Manajemen supplier

### 8. **Finance**
- Laporan pengeluaran
- Manajemen kategori pengeluaran
- Invoice & payment tracking
- Laporan Profit & Loss

### 9. **Human Resources**
- Manajemen karyawan
- Processing gaji
- Payroll history

### 10. **Customers Management**
- Database pelanggan
- Riwayat pembelian

### 11. **Reports**
- Profit & Loss statement
- Production reports
- Sales reports

---

## 🚀 Instalasi & Setup

### 1. Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

### 2. Setup Environment Variables

```bash
# Backend (.env)
DATABASE_URL="postgresql://..."
JWT_SECRET="your-secret-key"

# Frontend (.env.local)
NEXT_PUBLIC_API_URL="http://localhost:5000/api"
```

### 3. Database Setup

```bash
cd backend
npx prisma migrate dev
npx prisma studio
```

### 4. Run Development

```bash
# Terminal 1 - Backend
cd backend
npm run start

# Terminal 2 - Frontend
cd frontend
npm run dev
```

---

## 📱 Struktur API Routes

| Route | Method | Deskripsi |
|-------|--------|-----------|
| `/api/public/products` | GET | Produk publik (tanpa login) |
| `/api/auth/login` | POST | Login user |
| `/api/auth/register` | POST | Registrasi user |
| `/api/dashboard/summary` | GET | Dashboard analytics |
| `/api/materials` | GET/POST/PUT/DELETE | Material CRUD |
| `/api/products` | GET/POST/PUT/DELETE | Product CRUD |
| `/api/products/:productId/boms` | GET/POST | BOM management |
| `/api/production-orders` | POST/GET | Production orders |
| `/api/customers` | CRUD | Customer management |
| `/api/sales-orders` | CRUD | Sales orders |
| `/api/invoices` | CRUD | Invoice management |
| `/api/payments` | CRUD | Transaction payments |
| `/api/suppliers` | CRUD | Supplier management |
| `/api/purchase-orders` | CRUD | Purchase orders |
| `/api/employees` | CRUD | Employee management |
| `/api/payroll` | POST/GET | Payroll processing |
| `/api/expenses` | CRUD | Expense management |
| `/api/expense-categories` | CRUD | Expense categories |
| `/api/reports` | GET | Business reports |
| `/api/users` | GET/PUT/DELETE | User management |

---

## 🔐 Security Features

- **JWT Authentication** - Token-based auth dengan expiry 1 jam
- **Password Hashing** - bcrypt untuk security
- **Protected Routes** - Middleware protection
- **CORS Configuration** - Restricted origins
- **Input Validation** - Schema validation via Prisma
- **SQL Injection Prevention** - ORM-based queries

---

## 🎨 UI Components (Frontend)

### Layout Components
- **Header** - Navigation dengan responsive menu
- **Footer** - Informasi footer
- **Theme Toggle** - Dark/Light mode switch

### UI Library Components (18):
- Accordion, Alert, Badge, Button
- Calendar, Card, Checkbox
- Dialog, Input, Label
- Popover, Select, Sonner
- Table

### Custom Features:
- **3D Product Viewer** - Three.js interactive
- **Charts Dashboard** - Recharts integration
- **Animation** - Framer Motion + GSAP
- **Date Picker** - React Day Picker

---

## 📊 Tech Stack Diagram

```
                    ┌─────────────────────┐
                    │    JATiNESE WOOD    │
                    │      ERP System     │
                    └──────────┬──────────┘
                               │
           +────────────────────┼────────────────────+
           │                    │                    │
      ┌────▼────┐         ┌────▼────┐          ┌────▼────┐
      │Frontend │         │ Backend │          │  DB     │
      │  Next.js│         │ Node.js │          │PostgreSQL│
      └────┬────┘         └────┬────┘          └────┬────┘
           │                   │                    │
           │                   │                    │
           │        ┌─────────────┐               ┌─────────┐
           │        │   Prisma    │               │ORM Layer│
           │        │   ORM       │               │    DB   │
           │        └──────┬──────┘               └─────────┘
           │               │
           │        ┌──────┴──────┐
           │        │    Routes    │
           │        │            │
           │        │    Middleware│
           │        │            │
           │        │    Auth     │
           └────────┴─────────────┘
```

---

## 🔧 Development Tips

### Running Backend (Development Mode)

```bash
# Edit package.json, ubah script:
"start": "nodemon index.js"
```

### Running Frontend

```bash
npm run dev  # Development
npm run build  # Production build
npm run start  # Production start
```

### Adding New Features

1. Update database schema di `backend/prisma/schema.prisma`
2. Buat migration: `npx prisma migrate dev`
3. Buat route baru di `backend/routes/`
4. Buat komponen di `frontend/src/components/`
5. Update API client di `frontend/src/lib/api.js`

---

## 📝 Notes

### Status Saat Ini:
- Backend menggunakan `express.js` yang di-export sebagai module
- Frontend menggunakan Next.js App Router
- Database menggunakan PostgreSQL dengan Prisma sebagai ORM
- System sudah implementasi full stack ERP

### Fitur Lengkap:
- ✅ Customer & Sales Order Management
- ✅ Product & Material Management
- ✅ Production Order System
- ✅ Billing (Invoice & Payment)
- 💀 Backend express server tidak di-start otomatis (dihapus karena untuk deployment)

### Deployment:
- Backend: Ready untuk deploy ke server dengan Express
- Frontend: Ready untuk deploy ke Vercel/Netlify

---

## 👨‍💻 Contributor

Dikembangkan untuk kebutuhan industri kayu/furniture management.

---


**Version:** 1.0.0  
**Last Updated:** 2025
