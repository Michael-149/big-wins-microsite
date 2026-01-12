'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`bg-white border-b border-gray-200 sticky top-0 z-50 transition-all duration-200 ${
        scrolled ? 'shadow-sm' : ''
      }`}
    >
      <nav className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12" aria-label="Main navigation">
        <div className={`flex justify-between items-center transition-all duration-200 ${
          scrolled ? 'h-16' : 'h-20'
        }`}>
          {/* Logo */}
          <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
            <Image
              src="/images/SIL-Logo-RGB-Colour-soft.png"
              alt="Stanford Impact Labs"
              width={200}
              height={60}
              className={`w-auto transition-all duration-200 ${
                scrolled ? 'h-9' : 'h-11'
              }`}
              priority
            />
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-6 md:gap-8">
            <Link
              href="/lessons"
              className="text-gray-700 hover:text-sil-primary transition-colors font-medium text-sm md:text-base"
            >
              Lessons
            </Link>
            <Link
              href="/case-studies"
              className="text-gray-700 hover:text-sil-primary transition-colors font-medium text-sm md:text-base"
            >
              Case Studies
            </Link>
            <Link
              href="/about"
              className="text-gray-700 hover:text-sil-primary transition-colors font-medium text-sm md:text-base"
            >
              About
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
