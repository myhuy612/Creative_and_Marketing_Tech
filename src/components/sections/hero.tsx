import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative py-20 md:py-32 bg-gradient-to-b from-[#fff7ef] via-[#ffe9d4] to-[#ffd9b3]">
      <div className="container mx-auto px-4 text-center">
        {/* TITLE */}
        <h1 className="text-4xl md:text-6xl font-bold leading-tight tracking-tight mb-8">
          <span className="text-[#111]">Create smarter.</span>{" "}
          <span className="text-[hsl(var(--primary))]">Market faster.</span>
        </h1>

        {/* SLOGAN */}
        <p className="mx-auto mb-12 max-w-2xl text-base md:text-lg">
          Use AI to create visuals, craft marketing text, and uncover audience insights instantly.
        </p>

        {/* BUTTONS WRAPPER */}
        <div className="mt-4 flex items-center justify-center gap-6">

          {/* TEXT BUTTON */}
          <Button
            asChild
            className="
              rounded-full px-10 py-4 text-lg font-semibold
              bg-[hsl(var(--primary))] text-white
              shadow-[0_8px_24px_rgba(255,115,0,0.35)]
              transition-all duration-200
              hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(255,115,0,0.45)]
            "
          >
            <Link href="/generate">Create Text</Link>
          </Button>

          {/* IMAGE BUTTON */}
          <Button
            asChild
            className="
              rounded-full px-10 py-4 text-lg font-semibold
              bg-white/80 text-orange-600 border border-orange-300
              transition-all duration-200
              hover:-translate-y-0.5 hover:bg-white hover:border-orange-400
              hover:shadow-[0_12px_28px_rgba(255,115,0,0.25)]
            "
          >
            <Link href="/generate">Create Images</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
