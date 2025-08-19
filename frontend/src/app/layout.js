// src/app/layout.js

import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Jatinese Wood',
  description: 'Aplikasi ERP Jatinese',
};

// Ini adalah layout paling dasar yang membungkus seluruh aplikasi
export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className={inter.className}>{children}</body>
    </html>
  );
}