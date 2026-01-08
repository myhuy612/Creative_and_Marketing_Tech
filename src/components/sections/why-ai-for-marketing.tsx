import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function WhyAIForMarketingSection() {
  return (
    <section id="why-us" className="py-20 md:py-28 bg-background/80">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold font-headline mb-4">Why AI Matters in Marketing</h2>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-12">
          Your customers aren’t searching the old way anymore. They’re asking AI for recommendations, ideas, and solutions. If your content isn’t built for those answers, you’re missing the moment. Traditional SEO can’t keep your brand visible in an AI-first world. We help you stay front-and-centre by making your messaging readable, relevant, and ready for generative discovery.
        </p>
      </div>
    </section>
  );
}
