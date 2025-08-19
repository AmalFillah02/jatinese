'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { UserCog, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-7 left-4 right-4 md:left-20 md:right-20 z-50">
      <div className="backdrop-blur-lg border border-white/20 rounded-xl p-2 flex justify-between items-center">
        <h1 className="text-xl font-bold tracking-wider pl-4 text-white">
          <Link href="/">JATiNESE WOOD</Link>
        </h1>
        <div className="flex items-center space-x-4">
          {/* Desktop menu */}
          <nav className="hidden md:flex items-center space-x-2 rounded-full p-0.5">
            <Link
              href="/"
              className={`px-4 py-2 rounded-full ${
                pathname === '/' ? 'text-slate-400 opacity-70' : 'text-white'
              }`}
            >
              Home
            </Link>
            <Link
              href="/about"
              className={`px-4 py-2 rounded-full ${
                pathname === '/about' ? 'text-slate-400 opacity-70' : 'text-white'
              }`}
            >
              About
            </Link>
            <Link
              href="/gallery"
              className={`px-4 py-2 rounded-full ${
                pathname.startsWith('/gallery')
                  ? 'text-slate-400 opacity-70'
                  : 'text-white'
              }`}
            >
              Gallery
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-white"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>

          <Link href="/login">
            <Button className="bg-white hover:bg-gray-200 rounded-full font-semibold p-2">
              <UserCog className="h-6 w-6 text-black" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {open && (
        <div className="absolute top-20 left-4 right-4 bg-black/80 backdrop-blur-lg rounded-xl p-4 flex flex-col space-y-2 md:hidden">
          <Link href="/" className={`${pathname === '/' ? 'text-slate-400 opacity-70' : 'text-white'}`}>
            Home
          </Link>
          <Link href="/about" className={`${pathname === '/about' ? 'text-slate-400 opacity-70' : 'text-white'}`}>
            About
          </Link>
          <Link href="/gallery" className={`${pathname.startsWith('/gallery') ? 'text-slate-400 opacity-70' : 'text-white'}`}>
            Gallery
          </Link>
        </div>
      )}
    </header>
  );
}
