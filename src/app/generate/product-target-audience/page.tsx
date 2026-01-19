import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import ProductTargetAudienceForm from "@/components/forms/product-target-audience";

export default function ProductTargetAudiencePage() {
  return (
    <div className="flex flex-col min-h-dvh bg-gradient-to-b from-[#fff7ef] via-[#ffe9d4] to-[#ffd9b3] text-foreground">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold font-headline leading-tight tracking-tighter text-slate-900">
              Product Target Audience
            </h1>
            <p className="mt-3 text-lg text-muted-foreground">
              Enter product information and let AI infer an ideal target audience
              for your marketing.
            </p>
          </div>

          <ProductTargetAudienceForm />
        </div>
      </main>
      <Footer />
    </div>
  );
}
