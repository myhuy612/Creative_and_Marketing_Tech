import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function WhyAIForMarketingSection() {
  const steps = [
  {
    step: "Step 1",
    title: "Start with an idea",
    desc: (
      <>
        Decide what you want to promote and the key message you want to share.
        This becomes the input for your text and image generation.
      </>
    ),
  },
  {
    step: "Step 2",
    title: "Clarify your audience",
    desc: (
      <>
        Use the{" "}
        <span className="font-semibold text-orange-500">
          Target Audience Generator
        </span>{" "}
        to identify who your content is for, keeping decisions focused and relevant.
      </>
    ),
  },
  {
    step: "Step 3",
    title: "Draft the message",
    desc: (
      <>
        Create on-brand copy with the{" "}
        <span className="font-semibold text-orange-500">
          AI Text Generator
        </span>{" "}
        by selecting your tone, content type, and campaign objective.
      </>
    ),
  },
  {
    step: "Step 4",
    title: "Create matching visuals",
    desc: (
      <>
        Generate campaign-ready visuals using the{" "}
        <span className="font-semibold text-orange-500">
          AI Image Generator
        </span>{" "}
        to match your message and brand style.
      </>
    ),
  },
  {
    step: "Step 5",
    title: "Prepare for launch",
    desc: (
      <>
        Review and refine your text and visuals so everything is aligned,
        consistent, and ready to publish.
      </>
    ),
  },
];

  return (
    <section id="why-us" className="py-20 md:py-28 bg-background/80">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold font-headline mb-4">
          From Idea to Campaign
        </h2>

        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-14">
          A clear and practical workflow that helps you turn an initial idea into
          marketing-ready content.
        </p>

        {/* Steps */}
        <div className="grid gap-6 md:grid-cols-5 text-left">
          {steps.map((item) => (
            <div
              key={item.step}
              className="rounded-xl border border-border bg-card p-6 transition-all duration-300 
             hover:-translate-y-1 hover:shadow-md hover:border-primary hover:ring-1 hover:ring-primary/20
"
            >
              {/* ✅ Change 2 only: orange/primary step badge */}
              <span className="inline-block mb-3 px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                {item.step}
              </span>

              <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>

        <p className="text-sm text-muted-foreground mt-12 max-w-2xl mx-auto">
          This approach reduces guesswork and keeps your marketing content aligned from
          start to finish.
        </p>
      </div>
    </section>
  );
}
