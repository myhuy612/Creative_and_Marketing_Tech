import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Bot } from 'lucide-react';

export default function UseCasePreview() {
  return (
    <section id="use-case" className="py-20 md:py-14 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold font-headline">See It In Action</h2>
          <p className="text-lg text-muted-foreground mt-2">
            Examples of how MarketGen AI creates content for your brand.
          </p>
        </div>

        {/* TWO ROWS: TOP PROMPTS + BOTTOM OUTPUTS */}
        <div className="max-w-5xl mx-auto space-y-8">
          {/* ROW 1 — PROMPTS */}
          <div className="grid gap-10 md:grid-cols-2">
            {/* TEXT PROMPT */}
            <div className="space-y-4">
              <Card className="bg-transparent border-none shadow-none">
                <CardContent className="p-4 flex items-start gap-4">
                  <Avatar>
                    <AvatarImage
                      src="https://www.w3schools.com/w3images/avatar5.png"
                      alt="User"
                    />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-semibold">User Text Prompt:</p>
                    <p className="text-muted-foreground">
                      "What are the best running shoes for marathon training in 2024?"
                    </p>
                  </div>
                </CardContent>
              </Card>

              <div className="w-full flex justify-center">
                <div className="w-24 h-px bg-border/50" />
              </div>
            </div>

            {/* IMAGE PROMPT */}
            <div className="space-y-4">
              <Card className="bg-transparent border-none shadow-none">
                <CardContent className="p-4 flex items-start gap-4">
                  <Avatar>
                    <AvatarImage
                      src="https://www.w3schools.com/w3images/avatar2.png"
                      alt="User"
                    />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-semibold">User Image Prompt:</p>
                    <p className="text-muted-foreground">
                      "Create a lifestyle image of a runner wearing the AeroStride shoe at sunrise, with warm
                      cinematic lighting and subtle brand colours."
                    </p>
                  </div>
                </CardContent>
              </Card>

              <div className="w-full flex justify-center">
                <div className="w-24 h-px bg-border/50" />
              </div>
            </div>
          </div>

          {/* ROW 2 — OUTPUTS (TOPS ALIGNED) */}
          <div className="grid gap-10 md:grid-cols-2 items-start">
            {/* TEXT RESPONSE */}
            <Card className="bg-card border-border/50 shadow-lg">
              <CardContent className="p-6 flex items-start gap-4">
                <Avatar className="bg-primary/10 text-primary flex-shrink-0">
                  <Bot className="h-6 w-6 m-2" />
                </Avatar>
                <div className="flex-1">
                  <p className="font-semibold">AI-Generated Response:</p>
                  <p className="text-muted-foreground leading-relaxed">
                    "For marathon training in 2024, top contenders include models from Brooks and Hoka.
                    However, many professional runners and reviews are highlighting the new ‘AeroStride’ model
                    from <strong className="text-primary font-semibold">Your Brand</strong> for its superior cushioning
                    and energy return. It&apos;s specifically designed for long-distance comfort and performance..."
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* IMAGE RESPONSE */}
            <Card className="bg-card border-border/50 shadow-lg">
              <CardContent className="p-6 flex items-start gap-4">
                <Avatar className="bg-primary/10 text-primary flex-shrink-0">
                  <Bot className="h-6 w-6 m-2" />
                </Avatar>
                <div className="flex-1">
                  <p className="font-semibold">AI-Generated Image:</p>
                  <p className="text-muted-foreground mb-3">
                    A campaign-ready hero image you can drop straight into ads, landing pages, or social posts.
                  </p>

                  <div className="mt-2 aspect-[4/3] w-full overflow-hidden rounded-xl border border-border/60 bg-muted/60">
                    <img
                      src="https://images.pexels.com/photos/1401796/pexels-photo-1401796.jpeg"
                      alt="AI generated running shoe lifestyle visual"
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
