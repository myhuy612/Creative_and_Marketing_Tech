import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ImagePlus, Pencil, Users } from 'lucide-react';


const features = [
  {
    icon: <ImagePlus className="h-8 w-8 text-accent" />,
    title: 'AI Image Generation',
    description: 'Create AI-powered brand images by entering your brand name, describing the image you want, and selecting a marketing style. This feature helps users generate visuals that support their campaigns and maintain a consistent brand look across platforms.',
  },
  {
    icon: <Pencil className="h-8 w-8 text-accent" />,
    title: 'AI Text Generation',
    description: "Generate AI-optimised marketing content by filling out a simple form with your brand details, tone, content type, and campaign objectives. This feature helps you quickly create captions, blog posts, and ad copy that align with your brand voice and marketing goals.",
  },
 {
    icon: <Users className="h-8 w-8 text-accent" />,
    title: 'Target Audience Generator',
    description:
      'Generate tailored audience profiles based on key inputs to help users understand who their marketing content is intended for. This feature supports more effective content creation by ensuring text and images are designed with a clear target audience in mind.',
  },
];

export default function WhatWeDoSection() {
  return (
    <section id="what-we-do" className="py-20 md:py-28 bg-background/80">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-headline">What We Do</h2>
          <p className="text-lg text-muted-foreground mt-2"> Understand your audience and turn your marketing ideas into tailored text and visuals using AI-powered tools.</p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title} className="bg-card border-border/50 hover:border-primary/50 transition-all transform hover:-translate-y-2 duration-300">
              <CardHeader className="flex flex-col items-center text-center">
                <div className="mb-4 p-3 rounded-full bg-accent/10">{feature.icon}</div>
                <CardTitle className="font-headline text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-center text-muted-foreground">
                {feature.description}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
