"use client";

import Link from "next/link";
<<<<<<< HEAD
import { Sparkles, MoreVertical } from "lucide-react";
=======
import { Sparkles, Menu } from "lucide-react";
>>>>>>> d3d25fc13c77d45b70638227b3b954774d26e9f3
import { useState, useRef } from "react";

export default function Header() {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const hideTimeoutRef = useRef<number | null>(null);

  const handleMouseEnter = () => {
    // Cancel any scheduled hide
    if (hideTimeoutRef.current !== null) {
      window.clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    // Hide after 3 seconds
    hideTimeoutRef.current = window.setTimeout(() => {
      setIsOpen(false);
      hideTimeoutRef.current = null;
    }, 3000); // 3000ms = 3 seconds for the dropdown options to show after hovering
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
        {/* LEFT SIDE — Logo only */}
        <div className="flex items-center space-x-3">
          <Link href="/" className="flex items-center space-x-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-tr from-orange-600 via-orange-500 to-amber-400 text-white shadow-md">
              <Sparkles className="h-5 w-5" />
            </div>

            <span className="text-2xl font-semibold tracking-tight text-[#1a1a1a]">
              MarketGen AI
            </span>
          </Link>
        </div>

        {/* RIGHT SIDE — Generate menu + Search */}
        <div className="flex items-center space-x-4">
<<<<<<< HEAD
          {/* 3-dots dropdown (hover + 6s delay hide) */}
=======
          {/* SEARCH INPUT */}
          <div className="relative hidden md:block">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search…"
              className="w-48 rounded-full border border-gray-300 px-4 py-1.5 text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* 3-lines dropdown (hover + 6s delay hide) */}
>>>>>>> d3d25fc13c77d45b70638227b3b954774d26e9f3
          <div
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <button className="inline-flex items-center justify-center rounded-full bg-white p-2 text-sm font-semibold text-gray-900 shadow-xs border border-gray-300 hover:bg-gray-100">
<<<<<<< HEAD
              <MoreVertical className="h-5 w-5 text-gray-500" />
=======
              <Menu className="h-6 w-6 text-gray-500" />
>>>>>>> d3d25fc13c77d45b70638227b3b954774d26e9f3
            </button>

            {isOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-md bg-white shadow-lg border border-black/5 z-50">
                <div className="py-1">
                  <Link
                    href="/generate"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Text Generator
                  </Link>
                  <Link
                    href="/generate/image"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Image Generator
                  </Link>
                </div>
              </div>
            )}
          </div>

<<<<<<< HEAD
          {/* SEARCH INPUT */}
          <div className="relative hidden md:block">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search…"
              className="w-48 rounded-full border border-gray-300 px-4 py-1.5 text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
=======
>>>>>>> d3d25fc13c77d45b70638227b3b954774d26e9f3
        </div>
      </div>
    </header>
  );
}
