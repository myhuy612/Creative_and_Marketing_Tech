// src/app/generate/image/page.tsx

import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import GenerateImageForm from '@/components/forms/generate-image-form';

export default function GenerateImagePage() {
  return (
    <div className="flex flex-col min-h-dvh bg-background text-foreground">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold font-headline leading-tight tracking-tighter">
              Generate Brand Images
            </h1>
            <p className="text-lg text-muted-foreground mt-2">
              Fill out the form below to generate AI-powered images for your brand.
            </p>
          </div>

          <GenerateImageForm />
        </div>
      </main>
      <Footer />
    </div>
  );
}
