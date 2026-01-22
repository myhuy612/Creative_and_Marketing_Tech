"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Wand2,
  FileText,
  Image as ImageIcon,
  Users,
  BarChart3,
} from "lucide-react";

import GenerateContentForm from "@/components/forms/generate-content-form";
import GenerateImageForm from "@/components/forms/generate-image-form";
import ProductTargetAudiencePanel from "@/components/forms/product-target-audience";
import MarketingInsightsPanel from "@/components/forms/marketing-insights-panel";

type Mode = "text" | "image" | "audience" | "insights";

export default function GeneratePage() {
  const [mode, setMode] = useState<Mode>("text");

  const tabBase =
    "w-full rounded-xl border px-5 py-4 transition-all flex flex-col items-center justify-center gap-2 text-center";
  const tabActive = "border-primary bg-primary/10 shadow-sm";
  const tabIdle = "border-border hover:bg-muted/50";
  const tabDisabled =
    "border-border bg-muted/30 text-muted-foreground cursor-not-allowed";

  return (
    <section className="min-h-dvh bg-gradient-to-b from-[#fff7ef] via-[#ffe9d4] to-[#ffd9b3]">
      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-4xl">
          <Card className="border-border/50 bg-white/95 backdrop-blur">
            <CardHeader className="text-center space-y-2">
              <CardTitle className="flex items-center justify-center gap-2 text-3xl md:text-4xl font-bold">
                <Wand2 className="h-7 w-7 text-primary" />
                Generate
              </CardTitle>

              <p className="text-muted-foreground">
                Choose a tool below, then complete the form.
              </p>
            </CardHeader>

            <CardContent className="space-y-8">
              {/* TOOL SELECTOR */}
              <div className="rounded-2xl border border-border/60 bg-muted/20 p-5">
                <p className="text-sm font-medium text-center mb-4">
                  Select a tool
                </p>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
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

                  <button
                    type="button"
                    onClick={() => setMode("audience")}
                    className={`${tabBase} ${
                      mode === "audience" ? tabActive : tabIdle
                    }`}
                  >
                    <Users className="h-5 w-5" />
                    <span className="font-semibold">Target Audience</span>
                  </button>

                  {/* 🚧 MARKETING INSIGHTS (COMING SOON) */}
                  <button
                    type="button"
                    onClick={() => setMode("insights")}
                    className={`${tabBase} ${
                      mode === "insights" ? tabActive : tabIdle
                    }`}
                  >
                    <BarChart3 className="h-5 w-5" />
                    <span className="font-semibold">Marketing Insights</span>
                  </button>
                </div>
              </div>

              {/* FORMS */}
              <div className="pt-2">
                {mode === "text" && <GenerateContentForm />}
                {mode === "image" && <GenerateImageForm />}
                {mode === "audience" && <ProductTargetAudiencePanel />}
                {mode === "insights" && <MarketingInsightsPanel />}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
