import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SvgDefs from "./components/SvgDefs";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.eventspacepro.com"),
  title: "EventSpacePro — AI event floor plans in 2D | See the space before it's set",
  description:
    "Describe your event and get a to-scale 2D event floor plan drafted by AI in seconds, then fine-tune every table yourself. Built in Lagos.",
  applicationName: "EventSpacePro",
  alternates: {
    canonical: "https://www.eventspacepro.com/",
  },
  openGraph: {
    type: "website",
    siteName: "EventSpacePro",
    url: "https://www.eventspacepro.com/",
    title: "EventSpacePro — AI event floor plans in 2D",
    description:
      "See the space before it's set. Describe your event, get an AI first draft of your floor plan, then refine every table to scale.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "EventSpacePro: AI event floor plans in 2D. See the space before it's set.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "EventSpacePro — AI event floor plans in 2D",
    description:
      "See the space before it's set. Describe your event, get an AI first draft of your floor plan, then refine every table to scale.",
    images: ["/og-image.jpg"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#021938",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <SvgDefs />
        {children}
      </body>
    </html>
  );
}
