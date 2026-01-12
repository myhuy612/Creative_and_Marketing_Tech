"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import GenerateContentForm from "@/components/forms/generate-content-form";
import GenerateImageForm from "@/components/forms/generate-image-form";

type Mode = "text" | "image";

export default function GeneratePage() {
  const [mode, setMode] = useState<Mode>("text");

  return (
    <section className="container mx-auto px-4 py-10">
      <div className="mx-auto max-w-4xl">
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl">Generate</CardTitle>
            <p className="text-muted-foreground mt-1">
              Choose what you want to generate, then complete the form.
            </p>
          </CardHeader>

          <CardContent className="space-y-6">

            {/* SELECTOR */}
            <div className="max-w-sm">
              <label className="mb-2 block text-sm font-medium">
                Generation type
              </label>

              <Select value={mode} onValueChange={(v) => setMode(v as Mode)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select type…" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text content</SelectItem>
                  <SelectItem value="image">Image content</SelectItem>
                </SelectContent>
              </Select>
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
