"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

const ImageSchema = z.object({
  brandName: z.string().min(1),
  description: z.string().min(1),
  marketingStyle: z.string().optional(),
});

type FormValues = z.infer<typeof ImageSchema>;

export default function GenerateImageForm() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(ImageSchema),
    defaultValues: {
      marketingStyle: "clean, modern, minimalistic",
    },
  });

  async function onSubmit(values: FormValues) {
    setLoading(true);
    setImageUrl(null);

    try {
      const response = await fetch("/api/generate/image", {
        method: "POST",
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (data.error) {
        toast({ title: "Error", description: data.error, variant: "destructive" });
      } else {
        setImageUrl(data.image);
      }

    } catch (err) {
      toast({ title: "Error", description: "Request failed", variant: "destructive" });
    }

    setLoading(false);
  }

  return (
    <>
      <Toaster />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

          <FormField
            name="brandName"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Brand Name</FormLabel>
                <FormControl><Input placeholder="Nike, Starbucks…" {...field} /></FormControl>
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
                  <Textarea placeholder="Describe the marketing image…" {...field} />
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
                    <SelectTrigger><SelectValue /></SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="clean, modern, minimalistic">Clean</SelectItem>
                    <SelectItem value="vibrant, bold, high contrast">Vibrant</SelectItem>
                    <SelectItem value="luxury, premium, elegant">Luxury</SelectItem>
                    <SelectItem value="playful, colorful, youth style">Playful</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <Button disabled={loading} type="submit" className="w-full">
            {loading ? "Generating…" : "Generate Image"}
          </Button>
        </form>
      </Form>

      {loading && <p className="text-center p-4">Generating image…</p>}

      {imageUrl && (
        <Card className="mt-8">
          <CardHeader><CardTitle>Generated Image</CardTitle></CardHeader>
          <CardContent className="flex justify-center">
            <img src={imageUrl} className="rounded-lg shadow-lg" />
          </CardContent>
        </Card>
      )}
    </>
  );
}
