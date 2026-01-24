import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Bot } from "lucide-react";

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <div className="rounded-md border border-border bg-background px-2.5 py-1.5 text-xs leading-snug">
        {value}
      </div>
    </div>
  );
}


function FieldGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <p className="text-sm font-semibold">{title}</p>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

export default function UseCasePreview() {
  return (
    <section id="use-case" className="py-20 md:py-14 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-headline">
            See It In Action
          </h2>
          <p className="text-lg text-muted-foreground mt-2">
            Examples of how MarketGen AI creates content for your brand.
          </p>
        </div>

        {/* THREE GENERATOR COLUMNS */}
        <div className="max-w-6xl mx-auto grid gap-10 md:grid-cols-3">
          {/* ================= TEXT GENERATOR ================= */}
          <div className="space-y-6">
            {/* INPUT */}
            <Card className="border-border/50">
              <CardContent className="p-5 flex gap-4">
                <Avatar>
                  <AvatarImage src="https://www.w3schools.com/w3images/avatar5.png" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <FieldGroup title="Text generator inputs">
                    <Field label="Brand name" value="AeroStride" />
                    <Field label="Content type" value="Blog post" />
                    <Field label="Tone" value="Energetic, premium" />
                    <Field label="Goal" value="Brand awareness" />
                    <Field label="Keywords" value="#marathon #runclub" />
                  </FieldGroup>
                </div>
              </CardContent>
            </Card>

            {/* OUTPUT */}
            <Card className="border-border/50 shadow-lg">
              <CardContent className="p-6 flex gap-4">
                <Avatar className="bg-primary/10 text-primary">
                  <Bot className="h-6 w-6 m-2" />
                </Avatar>

                <div>
                  <p className="font-semibold mb-1">AI-generated copy</p>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    For marathon training in 2024, top contenders include models
                    from Brooks and Hoka. However, runners are increasingly
                    choosing <strong className="text-primary">AeroStride</strong>{" "}
                    for its superior cushioning, energy return, and premium
                    comfort designed for long-distance performance…
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ================= IMAGE GENERATOR ================= */}
          <div className="space-y-6">
            {/* INPUT */}
            <Card className="border-border/50">
              <CardContent className="p-5 flex gap-4">
                <Avatar>
                  <AvatarImage src="https://www.w3schools.com/w3images/avatar2.png" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <FieldGroup title="Image generator inputs">
                    <Field label="Brand name" value="AeroStride" />
                    <Field
                      label="Image description"
                      value="Running shoe lifestyle shot with white base and aqua + orange accents"
                    />
                    <Field label="Marketing style" value="Clean" />
                  </FieldGroup>
                </div>
              </CardContent>
            </Card>

            {/* OUTPUT */}
            <Card className="border-border/50 shadow-lg">
              <CardContent className="p-6 flex gap-4">
                <Avatar className="bg-primary/10 text-primary">
                  <Bot className="h-6 w-6 m-2" />
                </Avatar>

                <div className="flex-1">
                  <p className="font-semibold mb-2">AI-generated image</p>

                  <div className="aspect-[4/3] rounded-xl overflow-hidden border border-border/60">
                    <img
                      src="https://thumbs.dreamstime.com/b/stylish-running-shoe-vibrant-splash-orange-against-cool-blue-background-generative-ai-contemporary-designed-sleek-357962081.jpg"
                      alt="AI generated running shoe"
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ================= TARGET AUDIENCE ================= */}
          <div className="space-y-6">
            {/* INPUT */}
            <Card className="border-border/50">
              <CardContent className="p-5 flex gap-4">
                <Avatar>
                  <AvatarImage src="https://www.w3schools.com/w3images/avatar6.png" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <FieldGroup title="Target audience inputs">
                    <Field label="Product" value="AeroStride running shoes" />
                    <Field label="Category" value="Fitness / Footwear" />
                    <Field label="Luxury level" value="Mid-range" />
                    <Field label="Platform" value="Instagram" />
                    <Field label="Tone" value="Energetic, premium" />
                  </FieldGroup>
                </div>
              </CardContent>
            </Card>

            {/* OUTPUT */}
            <Card className="border-border/50 shadow-lg">
              <CardContent className="p-6 flex gap-4">
                <Avatar className="bg-orange-500/10 text-orange-600">
                  <Bot className="h-6 w-6 m-2" />
                </Avatar>

                <div className="flex-1">
                  <p className="font-semibold mb-2">
                    AI-generated audience profile
                  </p>

                  <div className="text-sm text-muted-foreground space-y-2">
                    <p>
                      <strong>Age:</strong> 25–40
                    </p>
                    <p>
                      <strong>Location:</strong> Urban Australia
                    </p>
                    <p>
                      <strong>Interests:</strong> Fitness, lifestyle, performance
                      gear
                    </p>
                    <p>
                      <strong>Motivation:</strong> Comfort + premium design
                    </p>
                  </div>

                  <div className="mt-3">
                    <p className="font-semibold text-sm mb-1">
                      Content direction
                    </p>
                    <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                      <li>Highlight long-distance comfort</li>
                      <li>Use energetic, premium tone</li>
                      <li>Focus on lifestyle visuals</li>
                    </ul>
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
