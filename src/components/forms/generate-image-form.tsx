"use client";

<<<<<<< HEAD
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
=======
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

>>>>>>> d3d25fc13c77d45b70638227b3b954774d26e9f3
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
<<<<<<< HEAD
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
=======
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
>>>>>>> d3d25fc13c77d45b70638227b3b954774d26e9f3
    },
  });

  async function onSubmit(values: FormValues) {
<<<<<<< HEAD
    setIsLoading(true);
    setGeneratedContent(null);
    try {
      const result = await generateBrandContent(values);
      setGeneratedContent(result);
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
=======
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
>>>>>>> d3d25fc13c77d45b70638227b3b954774d26e9f3
  }

  return (
    <>
      <Toaster />
      <Form {...form}>
<<<<<<< HEAD
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="brandName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Brand Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., AeroStride" {...field} />
                </FormControl>
=======
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

          <FormField
            name="brandName"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Brand Name</FormLabel>
                <FormControl><Input placeholder="Nike, Starbucks…" {...field} /></FormControl>
>>>>>>> d3d25fc13c77d45b70638227b3b954774d26e9f3
                <FormMessage />
              </FormItem>
            )}
          />

<<<<<<< HEAD
          <div className="grid md:grid-cols-2 gap-8">
            <FormField
              control={form.control}
              name="brandTone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Brand Voice / Tone</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a tone" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Witty">Witty</SelectItem>
                      <SelectItem value="Professional">Professional</SelectItem>
                      <SelectItem value="Friendly">Friendly</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contentType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a content type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Instagram Caption">
                        Instagram Caption
                      </SelectItem>
                      <SelectItem value="Blog Post">Blog Post</SelectItem>
                      <SelectItem value="Ad Copy">Ad Copy</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="campaignGoal"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Campaign Objective (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="e.g., Announce a new product launch"
                    {...field}
                  />
=======
          <FormField
            name="description"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Describe the marketing image…" {...field} />
>>>>>>> d3d25fc13c77d45b70638227b3b954774d26e9f3
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
<<<<<<< HEAD
            control={form.control}
            name="keywords"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Keywords or Hashtags (Optional)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., running, marathon, fitness"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Comma-separated keywords or hashtags.
                </FormDescription>
                <FormMessage />
=======
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
>>>>>>> d3d25fc13c77d45b70638227b3b954774d26e9f3
              </FormItem>
            )}
          />

<<<<<<< HEAD
          <FormField
            control={form.control}
            name="contentLength"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Length Preference</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="Short" />
                      </FormControl>
                      <FormLabel className="font-normal">Short</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="Medium" />
                      </FormControl>
                      <FormLabel className="font-normal">Medium</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="Long" />
                      </FormControl>
                      <FormLabel className="font-normal">Long</FormLabel>
                    </FormItem>
                  </RadioGroup>
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
        {isLoading ? "Generating..." : "Generate Image"}
      </Button>

        </form>
      </Form>

      {isLoading && <div className="text-center p-8">Loading...</div>}

      {generatedContent && (
        <div className="mt-12 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Generated Image Content</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">
                {generatedContent.content}
              </p>
            </CardContent>
          </Card>
        </div>
=======
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
>>>>>>> d3d25fc13c77d45b70638227b3b954774d26e9f3
      )}
    </>
  );
}
