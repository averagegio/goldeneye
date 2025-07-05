'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';

export default function Home() {
  useEffect(() => {
    document.body.style.margin = '0';
    document.body.style.overflow = 'hidden';
  }, []);

  return (
    <main className="min-h-screen relative flex items-center justify-center bg-black">
      {/* Background Image */}
      <div className="fixed inset-0 z-0">
        <Image
          src="/1751500995260-image.gif"
          alt="GoldenEye Spiral"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/30" /> {/* Overlay for better text visibility */}
      </div>

      {/* Content */}
      <div className="relative z-10 text-center">
        <h1 className="text-6xl font-bold text-[#FFD700] mb-8 tracking-wider">
          GOLDENEYE
        </h1>
        <p className="text-xl text-[#FFF8DC] max-w-2xl mx-auto px-4">
          For England, James?
        </p>
      </div>
    </main>
  );
} 