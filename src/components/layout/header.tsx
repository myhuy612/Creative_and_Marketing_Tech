"use client";

import Link from "next/link";
import { Sparkles, MoreVertical } from "lucide-react";
import { useState, useRef } from "react";

export default function Header() {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const hideTimeoutRef = useRef<number | null>(null);

  const handleMouseEnter = () => {
    if (hideTimeoutRef.current !== null) {
      window.clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    hideTimeoutRef.current = window.setTimeout(() => {
      setIsOpen(false);
      hideTimeoutRef.current = null;
    }, 3000);
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

        {/* RIGHT SIDE — Search + Dropdown (far right) */}
        <div className="flex items-center space-x-4 ml-auto">
          {/* SEARCH INPUT */}
          <div className="relative hidden md:block">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search…"
              className="w-56 rounded-full border border-gray-300 px-4 py-1.5 text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* DROPDOWN */}
          <div
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <button className="inline-flex items-center justify-center rounded-full bg-white p-2 text-sm font-semibold text-gray-900 shadow-xs border border-gray-300 hover:bg-gray-100">
              <MoreVertical className="h-5 w-5 text-gray-500" />
            </button>

            {isOpen && (
              <div className="absolute top-full right-0 mt-3 w-72 rounded-xl bg-white shadow-xl border border-black/5 z-50">
                <div className="py-2">
                  <Link
                    href="/generate"
                    className="block px-6 py-3 text-base text-gray-700 hover:bg-gray-100"
                  >
                    Text Generator
                  </Link>
                  <Link
                    href="/generate/image"
                    className="block px-6 py-3 text-base text-gray-700 hover:bg-gray-100"
                  >
                    Image Generator
                  </Link>
                  <Link
                    href="/generate/profile"
                    className="block px-6 py-3 text-base text-gray-700 hover:bg-gray-100"
                  >
                    Target Audience Generator
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
