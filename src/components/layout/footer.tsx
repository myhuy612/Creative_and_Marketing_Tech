import Link from "next/link";
import {
  Sparkles,
  Twitter,
  Linkedin,
  Instagram,
  Facebook,
} from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border/40 bg-background">
      <div className="container mx-auto px-4 py-10">
        <div className="grid gap-10 md:grid-cols-3">
          {/* BRAND */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-orange-600 via-orange-500 to-amber-400 text-white shadow-md">
                <Sparkles className="h-5 w-5" />
              </div>
              <span className="text-lg font-semibold tracking-tight">
                MarketGen AI
              </span>
            </Link>

            <p className="text-sm text-muted-foreground max-w-sm">
              AI-powered tools to help marketers generate content, create brand
              visuals, and build audience insights faster.
            </p>

            {/* SOCIAL ICONS (MOCK) */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                aria-label="X (mock)"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/60 text-foreground hover:text-orange-600 hover:border-orange-400 hover:bg-orange-50 transition"
              >
                <Twitter className="h-5 w-5 stroke-[2.2]" />
              </button>

              <button
                type="button"
                aria-label="LinkedIn (mock)"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/60 text-foreground hover:text-orange-600 hover:border-orange-400 hover:bg-orange-50 transition"

              >
                <Linkedin className="h-5 w-5 stroke-[2.2]" />
              </button>

              <button
                type="button"
                aria-label="Instagram (mock)"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/60 text-foreground hover:text-orange-600 hover:border-orange-400 hover:bg-orange-50 transition"

              >
                <Instagram className="h-5 w-5 stroke-[2.2]" />
              </button>

              <button
                type="button"
                aria-label="Facebook (mock)"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/60 text-foreground hover:text-orange-600 hover:border-orange-400 hover:bg-orange-50 transition"

              >
                <Facebook className="h-5 w-5 stroke-[2.2]" />
              </button>
            </div>
          </div>

          {/* FEATURES */}
          <div className="space-y-3">
            <p className="text-sm font-semibold">Features</p>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/generate"
                  className="text-muted-foreground hover:text-foreground transition"
                >
                  Text Generator
                </Link>
              </li>
              <li>
                <Link
                  href="/generate/image"
                  className="text-muted-foreground hover:text-foreground transition"
                >
                  Image Generator
                </Link>
              </li>
              <li>
                <Link
                  href="/generate/product-target-audience"
                  className="text-muted-foreground hover:text-foreground transition"
                >
                  Target Audience Generator
                </Link>
              </li>
            </ul>

            <div className="pt-4">
              <Link
                href="/"
                className="text-sm text-muted-foreground hover:text-foreground transition"
              >
                Back to Home
              </Link>
            </div>
          </div>

          {/* LEGAL + CONTACT */}
          <div className="space-y-3">
            <p className="text-sm font-semibold">Legal</p>
            <ul className="space-y-2 text-sm">
              <li className="text-muted-foreground">
                Privacy Policy 
              </li>
              <li className="text-muted-foreground">
                Terms of Service 
              </li>
            </ul>

            <div className="pt-4 space-y-1">
              <p className="text-sm font-semibold">Contact</p>
              <p className="text-sm text-muted-foreground">
                Email: support@marketgen.ai
              </p>
              <p className="text-sm text-muted-foreground">
                Melbourne, Australia
              </p>
            </div>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="mt-10 flex flex-col gap-2 border-t border-border/40 pt-6 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>&copy; {year} MarketGen AI. All rights reserved.</p>
          <p className="text-muted-foreground/80">
            Marketing content generation made simple.
          </p>
        </div>
      </div>
    </footer>
  );
}
