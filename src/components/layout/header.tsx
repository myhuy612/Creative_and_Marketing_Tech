"use client";

import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const [query, setQuery] = useState("");

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
        
        {/* LEFT SIDE — Logo + Nav */}
        <div className="flex items-center space-x-6">
          
          {/* LOGO */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-tr from-orange-600 via-orange-500 to-amber-400 text-white shadow-md">
              <Sparkles className="h-5 w-5" />
            </div>

            <span className="text-2xl font-semibold tracking-tight text-[#1a1a1a]">
              MarketGen AI
            </span>
          </Link>

          {/* LINKS — BLACK TEXT */}
          <nav className="flex items-center space-x-3">
            <Link
              href="/text"
              className="px-4 py-1.5 rounded-full bg-white text-black border border-gray-300 hover:bg-gray-100 transition"
            >
              Text Generator
            </Link>

            <Link
              href="/image"
              className="px-4 py-1.5 rounded-full bg-white text-black border border-gray-300 hover:bg-gray-100 transition"
            >
              Image Generator
            </Link>
          </nav>
        </div>

        {/* RIGHT SIDE — Search */}
        <div className="flex items-center space-x-4">
          <div className="relative hidden md:block">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search…"
              className="w-48 rounded-full border border-gray-300 px-4 py-1.5 text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

      </div>
    </header>
  );
}
