import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GoMello — Book Travel with Confidence",
  description: "AI-powered travel search. Compare flights, hotels, and rental cars with full price transparency. No hidden fees. No pressure. No surprises.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
