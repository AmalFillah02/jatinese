// src/components/LogoutButton.jsx

'use client'; // WAJIB: Tandai sebagai Client Component karena ada interaksi (onClick)

import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { LogOut } from 'lucide-react';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    // Hapus token dari cookie
    Cookies.remove('token');
    // Arahkan pengguna kembali ke halaman login
    router.push('/login');
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center w-30 p-2 rounded-lg hover:text-white text-gray-700 font-medium"
    >
      <LogOut className="mr-3 h-5 w-5" /> Logout
    </button>
  );
}