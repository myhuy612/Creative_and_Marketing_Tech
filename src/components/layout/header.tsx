"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Bot } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const [query, setQuery] = useState("");

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        
        {/* LEFT SIDE */}
        <div className="mr-4 flex items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Bot className="h-6 w-6 text-primary" />
            <span className="font-bold font-headline">AI for Marketing</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link href="/#what-we-do" className="transition-colors hover:text-foreground/80 text-foreground/60">What We Do</Link>
            <Link href="/#use-case" className="transition-colors hover:text-foreground/80 text-foreground/60">Use Case</Link>
            <Link href="/#why-us" className="transition-colors hover:text-foreground/80 text-foreground/60">Why Us</Link>
          </nav>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex flex-1 items-center justify-end space-x-4">

          {/* SEARCH BAR */}
          <div className="relative hidden md:block">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search…"
              className="w-48 rounded-full border border-gray-300 px-4 py-1.5 text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* BUTTONS */}
          <Button 
            asChild
            style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }}
            className="hover:opacity-90"
          >
            <Link href="/generate">Create Text</Link>
          </Button>

          <Button 
            asChild
            style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }}
            className="hover:opacity-90"
          >
            <Link href="/generate">Create Image</Link>
          </Button>

        </div>
      </div>
    </header>
  );
}
