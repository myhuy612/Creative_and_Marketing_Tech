import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ImagePlus, Pencil,  } from 'lucide-react';


const features = [
  {
    icon: <ImagePlus className="h-8 w-8 text-accent" />,
    title: 'AI Image Generation',
    description: 'Create high-quality, on-brand visuals tailored to your marketing needs. From social posts to product showcases, generate images that elevate your brand presence instantly.',
  },
  {
    icon: <Pencil className="h-8 w-8 text-accent" />,
    title: 'AI Text Generation',
    description: "Craft compelling marketing copy effortlessly. Produce captions, taglines, product descriptions and campaign messages optimized for clarity, tone, and audience engagement.",
  },
 
];

export default function WhatWeDoSection() {
  return (
    <section id="what-we-do" className="py-20 md:py-28 bg-background/80">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-headline">What We Do</h2>
          <p className="text-lg text-muted-foreground mt-2"> Transform your brand's ideas into polished text and visuals with AI.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
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
