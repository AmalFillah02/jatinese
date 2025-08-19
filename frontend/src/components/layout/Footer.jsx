"use client";

// src/components/layout/Footer.jsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
// import kursi from '/public/kursi.png';
// import logo from '/public/pastel2.png';

export default function Footer() {
  const chairRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.3, // Trigger when 30% of the footer is visible
        rootMargin: '0px 0px -100px 0px' // Trigger slightly before the element is fully visible
      }
    );

    if (chairRef.current) {
      observer.observe(chairRef.current);
    }

    return () => {
      if (chairRef.current) {
        observer.unobserve(chairRef.current);
      }
    };
  }, []);

  return (
    <footer ref={chairRef} className="bg-black text-white relative overflow-hidden">
      <div className="container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Section: Join Us */}
          <div className="lg:col-span-2">
              <Image src="/pastel2.png" alt='logo' width={280} height={280} className="mb-6" />
          </div>
          
          {/* Section: About */}
          <div>
            <h3 className="font-bold text-lg mb-4">About</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/about" className="hover:text-white">About Jatinese Wood</Link></li>
              <li><Link href="/gallery" className="hover:text-white">Gallery</Link></li>
              {/* <li><Link href="/careers" className="hover:text-white">Careers</Link></li>
              <li><Link href="/foundation" className="hover:text-white">Foundation</Link></li> */}
            </ul>
          </div>
          
          {/* Section: Products */}
          <div>
            <h3 className="font-bold text-lg mb-4">Products</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/gallery/minimalist" className="hover:text-white">Minimalist</Link></li>
              <li><Link href="/gallery/classic" className="hover:text-white">Classic</Link></li>
              <li><Link href="/gallery/modern" className="hover:text-white">Modern</Link></li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Section */}
        <div className="mt-20 pt-10 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="my-8 md:my-0">
              <h2 className="text-6xl md:text-8xl font-extrabold tracking-tighter">
                JATiNESE WOOD
              </h2>
            </div>
            <div>{/* Placeholder for alignment */}</div>
          </div>
        </div>
        
        {/* Animated Chair Image */}
        <div className={`absolute bottom-0 right-6 md:right-10 transform transition-all duration-1000 ease-out ${
          isVisible 
            ? 'translate-y-1/4 opacity-100' 
            : 'translate-y-full opacity-0'
        } hover:translate-y-0`}>
          <Image 
            src="/kursi.png"
            alt="Kursi Kayu" 
            width={400}
            height={400}
            style={{ objectFit: 'contain' }} 
            className="drop-shadow-2xl"
          />
        </div>
      </div>
    </footer>
  );
}