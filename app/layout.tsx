import type { Metadata, Viewport } from "next";
import "./globals.css";

const APP_NAME = "EventSpacePro";

export const metadata: Metadata = {
  title: "EventSpacePro — Design, book, and visualize event spaces",
  description:
    "EventSpacePro turns any venue into an editable 2D floor plan, a walkable 3D preview, and an AI assistant that lays out your event from a single prompt.",
  applicationName: APP_NAME,
  openGraph: {
    title: "EventSpacePro — Design, book, and visualize event spaces",
    description:
      "Turns any venue into an editable 2D floor plan, a walkable 3D preview, and an AI layout assistant.",
    type: "website",
    images: ["/assets/mainLogo.svg"],
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
    <html lang="en">
      <head>
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Sans:ital,wght@0,400..700;1,400..700&family=Instrument+Serif:ital@0;1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div
          id="top"
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {children}
        </div>
      </body>
    </html>
  );
}