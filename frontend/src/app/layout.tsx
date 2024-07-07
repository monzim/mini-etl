import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/Provider";
import { siteConfig } from "@/lib/site-config";

const quickSand = Quicksand({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    images: siteConfig.images,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="">
      <header>
        <script
          defer
          src="https://cloud.umami.is/script.js"
          data-website-id="f904d246-7f3b-4abc-96ab-0c9338660e01"
        ></script>
      </header>
      <body className={cn(quickSand.className)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <Toaster
            toastOptions={{
              classNames: {
                error: "bg-destructive",
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
