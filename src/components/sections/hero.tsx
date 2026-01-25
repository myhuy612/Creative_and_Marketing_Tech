import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden py-20 md:py-28">
      {/* DARK ORANGE BACKGROUND GRADIENT (KEEP THIS) */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#FB923C] via-[#F97316] to-[#C2410C]" />

      {/* Optional subtle vignette for depth */}
      <div className="absolute inset-0 bg-black/10" />

      <div className="relative container mx-auto px-4">
        {/* CENTER CARD */}
        <div className="mx-auto max-w-5xl">
          <div
            className="
              rounded-[2.5rem]
              bg-[#FFF3E6]
              px-8 py-16 md:px-16 md:py-20
              text-center
              shadow-[0_30px_80px_rgba(0,0,0,0.25)]
              border border-black/5
            "
          >
            {/* HEADLINE */}
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.05]">
              <span className="text-black">Create smarter.</span>
              <br />
              <span className="text-[#F97316]">Market faster.</span>
            </h1>

            {/* SUBTEXT */}
            <p className="mx-auto mt-6 max-w-3xl text-lg md:text-xl text-black/60 leading-relaxed">
              Use AI to create visuals, craft marketing text, and uncover audience
              insights instantly.
            </p>

            {/* SINGLE CTA */}
            <div className="mt-12 flex justify-center">
              <Button
                asChild
                className="
                  h-14 px-10 rounded-full text-base md:text-lg font-semibold
                  bg-[#F97316] text-white
                  shadow-[0_10px_24px_rgba(249,115,22,0.45)]
                  hover:bg-[#EA580C]
                  hover:-translate-y-0.5
                  transition-all
                "
              >
                <Link
                  href="/generate/combined-mock"
                  className="inline-flex items-center gap-2"
                >
                  Start Creating Now
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
