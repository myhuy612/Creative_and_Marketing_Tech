// src/app/generate/combined-mock/page.tsx
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wand2, FileText, Image as ImageIcon } from "lucide-react";

import GenerateContentForm from "@/components/forms/generate-content-form";
import GenerateImageForm from "@/components/forms/generate-image-form";

type Mode = "text" | "image";

export default function GeneratePage() {
  const [mode, setMode] = useState<Mode>("text");

  const tabBase =
    "w-full rounded-xl border px-5 py-4 transition-all flex items-center justify-center gap-3";
  const tabActive = "border-primary bg-primary/10 shadow-sm";
  const tabIdle = "border-border hover:bg-muted/50";

  return (
    <section className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-4xl">
        <Card className="border-border/50">
          {/* CENTERED HEADER + ACTION ICON (NOT THE LOGO ICON) */}
          <CardHeader className="text-center space-y-2">
            <CardTitle className="flex items-center justify-center gap-2 text-3xl md:text-4xl font-bold">
              <Wand2 className="h-7 w-7 text-primary" />
              Generate
            </CardTitle>

            <p className="text-muted-foreground">
              Pick a generation type first, then complete the form.
            </p>
          </CardHeader>

          <CardContent className="space-y-8">
            {/* BIG, OBVIOUS GENERATION TYPE */}
            <div className="rounded-2xl border border-border/60 bg-muted/20 p-5">
              <p className="text-sm font-medium text-center mb-4">
                Generation type
              </p>

              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setMode("text")}
                  className={`${tabBase} ${
                    mode === "text" ? tabActive : tabIdle
                  }`}
                >
                  <FileText className="h-5 w-5" />
                  <span className="font-semibold">Text</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMode("image")}
                  className={`${tabBase} ${
                    mode === "image" ? tabActive : tabIdle
                  }`}
                >
                  <ImageIcon className="h-5 w-5" />
                  <span className="font-semibold">Image</span>
                </button>
              </div>
            </div>

            {/* CONDITIONAL FORM */}
            <div className="pt-2">
              {mode === "text" ? <GenerateContentForm /> : <GenerateImageForm />}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
