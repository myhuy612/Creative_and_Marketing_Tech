"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";
import { generateBrandContent } from "@/ai/flows/generate-brand-content";
import {
  GenerateBrandContentOutput,
  GenerateBrandContentInputSchema,
} from "@/ai/schemas/generate-brand-content";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { toast } from "@/hooks/use-toast";
import { Toaster } from "../ui/toaster";

type FormValues = z.infer<typeof GenerateBrandContentInputSchema>;

export default function GenerateContentForm() {
  const [generatedContent, setGeneratedContent] =
    useState<GenerateBrandContentOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(GenerateBrandContentInputSchema),
    defaultValues: {
      brandName: "",
      brandTone: "Friendly",
      contentType: "Instagram Caption",
      campaignGoal: "",
      keywords: "",
      contentLength: "Medium",
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setGeneratedContent(null);
    try {
        const res = await fetch("/api/generate-brand-content", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(values),
          });
          
          const json = await res.json();
          
          if (!res.ok || !json.success) {
            throw new Error(json?.error || "Failed to generate content");
          }
          
          // Depending on what n8n returns, you might need to map it
          // If your n8n returns { content: "..." }:
          setGeneratedContent(json.data);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to generate content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <Toaster />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
 
          <FormField
            control={form.control}
            name="campaignGoal"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="e.g., post, caption"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />


      <Button
        type="submit"
        disabled={isLoading}
        size="lg"
        className="
          w-full rounded-full py-4 text-lg font-semibold
          bg-[hsl(var(--primary))] text-white
          shadow-[0_8px_24px_rgba(255,115,0,0.35)]
          transition-all duration-200
          hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(255,115,0,0.45)]
        "
      >
        {isLoading ? "Generating..." : "Generate Text"}
      </Button>

        </form>
      </Form>

      {isLoading && <div className="text-center p-8">Loading...</div>}

      {generatedContent && (
        <div className="mt-12 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Generated Content</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">
                {generatedContent.content}
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
