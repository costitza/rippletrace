import type { Metadata } from "next";
import { Roboto_Slab, Manrope } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const robotoSlab = Roboto_Slab({
  variable: "--font-roboto-slab",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "RippleTrace | Graph-Based Risk Intelligence",
  description: "Predict global supply chain disruptions using AI-powered GraphRAG.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="scroll-smooth">
        <body
          className={`${robotoSlab.variable} ${manrope.variable} antialiased font-manrope`}
        >
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
