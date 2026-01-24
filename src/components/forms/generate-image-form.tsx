"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

const ImageSchema = z.object({
  brandName: z.string().min(1, "Brand name is required"),
  description: z.string().min(1, "Description is required"),
  marketingStyle: z.string().optional(),
});

type FormValues = z.infer<typeof ImageSchema>;

export default function GenerateImageForm() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(ImageSchema),
    defaultValues: {
      brandName: "",
      description: "",
      marketingStyle: "clean, modern, minimalistic",
    },
  });

  async function onSubmit(values: FormValues) {
    setLoading(true);
    setImageUrl(null);

    try {
      const response = await fetch("/api/generate/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok || data?.error) {
        toast({
          title: "Error",
          description: data?.error ?? "Failed to generate image.",
          variant: "destructive",
        });
      } else {
        setImageUrl(data.image);
      }
    } catch {
      toast({
        title: "Error",
        description: "Request failed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Toaster />

      <div className="grid gap-6 lg:grid-cols-12">
        {/* LEFT: INPUTS */}
        <Card className="lg:col-span-6">
          <CardHeader>
            <CardTitle>Inputs</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  name="brandName"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Brand Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., AeroStride" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="description"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Describe the marketing image you want…" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="marketingStyle"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Marketing Style</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a style" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="clean, modern, minimalistic">Clean</SelectItem>
                          <SelectItem value="vibrant, bold, high contrast">Vibrant</SelectItem>
                          <SelectItem value="luxury, premium, elegant">Luxury</SelectItem>
                          <SelectItem value="playful, colorful, youth style">Playful</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  disabled={loading}
                  type="submit"
                  className="
                    w-full rounded-full py-4 text-lg font-semibold
                    bg-[hsl(var(--primary))] text-white
                    shadow-[0_8px_24px_rgba(255,115,0,0.35)]
                    transition-all duration-200
                    hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(255,115,0,0.45)]
                  "
                >
                  {loading ? "Generating…" : "Generate Image"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* RIGHT: OUTPUT */}
        <Card className="lg:col-span-6">
          <CardHeader>
            <CardTitle>Output</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="rounded-xl border border-border/60 bg-muted/30 p-6 text-sm text-muted-foreground">
                Generating image…
              </div>
            ) : imageUrl ? (
              <div className="flex justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageUrl}
                  alt="Generated marketing visual"
                  className="rounded-lg shadow-lg max-w-full"
                />
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-border/70 bg-muted/20 p-6 text-sm text-muted-foreground">
                Your generated image will appear here after you click <b>Generate Image</b>.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
