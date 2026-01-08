import Link from 'next/link';
import { Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-border/40">
      <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between">
<<<<<<< HEAD
        <div className="flex items-center space-x-2 mb-4 md:mb-0">
           <Bot className="h-6 w-6 text-primary" />
           <span className="font-bold font-headline">MarketGen AI</span>
        </div>
=======

        {/* LOGO — Black Sparkles only */}
        <Link href="/" className="flex items-center space-x-3 mb-4 md:mb-0">
          <Sparkles className="h-6 w-6 text-muted-foreground" />
          <span className="text-lg font-semibold tracking-tight text-muted-foreground">
            MarketGen AI
          </span>
        </Link>

        {/* COPYRIGHT */}
>>>>>>> d3d25fc13c77d45b70638227b3b954774d26e9f3
        <div className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} MarketGen AI. All rights reserved.
        </div>

      </div>
    </footer>
  );
}
