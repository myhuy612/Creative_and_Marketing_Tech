// src/app/generate/combined-mock/layout.tsx
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
