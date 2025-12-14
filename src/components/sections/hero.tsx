import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative py-20 md:py-32 bg-gradient-to-b from-[#fff7ef] via-[#ffe9d4] to-[#ffd9b3]">
  {/* BACKGROUND IMAGE */}
    <div
      className="absolute inset-0 bg-cover bg-center"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1617957718614-8c23f060c2d0?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8b3JhbmdlJTIwYmFja2dyb3VuZHxlbnwwfHwwfHx8MA%3D%3D')",
      }}
    />

    {/* YOUR CONTENT */}
    <div className="relative container mx-auto px-4 text-center">

          {/* TITLE */}
          <h1
            className="
              text-4xl md:text-6xl font-bold leading-tight tracking-tight mb-8
              text-white
              [--stroke:2px_black]
              [webkit-text-stroke:var(--stroke)]
            "
          >
            <span>Create smarter.</span>{" "}
            <span
              className="
                text-[hsl(var(--primary))]
                [webkit-text-stroke:0]
                [text-shadow:_0_0_6px_white,_0_0_12px_white,_0_0_18px_white]
              "
            >
              Market faster.
            </span>
          </h1>

        {/* SLOGAN */}
        <p className="mx-auto mb-16 max-w-3xl text-lg md:text-xl leading-relaxed">
          Use AI to create visuals, craft marketing text, and uncover audience insights instantly.
        </p>

        {/* BUTTONS */}
        <div className="mt-4 flex items-center justify-center gap-6">

          {/* TEXT BUTTON */}
          <Button
            asChild
            className="
              rounded-full px-12 py-5 text-xl font-semibold min-h-[60px]
              bg-[hsl(var(--primary))] text-white
              shadow-[0_8px_24px_rgba(255,115,0,0.35)]
              transition-all duration-200
              hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(255,115,0,0.45)]
            "
          >
            <Link href="/generate">Generate Text</Link>
          </Button>

          {/* IMAGE BUTTON */}
          <Button
            asChild
            className="
              rounded-full px-12 py-5 text-xl font-semibold min-h-[60px]
              bg-[hsl(var(--primary))] text-white
              shadow-[0_8px_24px_rgba(255,115,0,0.35)]
              transition-all duration-200
              hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(255,115,0,0.45)]
            "
          >
            <Link href="/generate/image">Generate Images</Link>
          </Button>

          <Button
            asChild
            className="
              rounded-full px-12 py-5 text-xl font-semibold min-h-[60px]
              bg-[hsl(var(--primary))] text-white
              shadow-[0_8px_24px_rgba(255,115,0,0.35)]
              transition-all duration-200
              hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(255,115,0,0.45)]
            "
          >
            <Link href="/generate/profile">Generate Target Audience Profile</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
