import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BackToTop from "@/components/ui/BackToTop";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5
};

export const metadata: Metadata = {
  metadataBase: new URL('https://bigwins.stanford.edu'),
  title: {
    default: "Big Wins in Social Science | Stanford Impact Labs",
    template: "%s | Big Wins in Social Science"
  },
  description: "8 lessons from social science research that achieved large-scale societal impact, with case studies demonstrating pathways from research to policy.",
  keywords: ["social science", "research impact", "policy research", "evidence-based policy", "Stanford Impact Labs", "case studies", "research translation"],
  authors: [{ name: "Stanford Impact Labs" }],
  creator: "Stanford Impact Labs",
  publisher: "Stanford Impact Labs",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://bigwins.stanford.edu",
    siteName: "Big Wins in Social Science",
    title: "Big Wins in Social Science | Stanford Impact Labs",
    description: "8 lessons from social science research that achieved large-scale societal impact, with case studies demonstrating pathways from research to policy.",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "Big Wins in Social Science - 8 Lessons from Research That Changed the World"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Big Wins in Social Science | Stanford Impact Labs",
    description: "8 lessons from social science research that achieved large-scale societal impact",
    images: ["/images/og-image.png"],
    creator: "@StanfordImpact"
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
        <BackToTop />
      </body>
    </html>
  );
}
