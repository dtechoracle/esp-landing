import type { Metadata } from "next";
import TutorialsClient from "./TutorialsClient";

export const metadata: Metadata = {
  title: "Tutorials — EventSpacePro | See the space before it's set",
  description:
    "Step-by-step EventSpacePro video tutorials on YouTube: draw an event floor plan, use the AI layout assistant and share your plan.",
  alternates: {
    canonical: "https://www.eventspacepro.com/tutorials",
  },
  openGraph: {
    type: "website",
    siteName: "EventSpacePro",
    url: "https://www.eventspacepro.com/tutorials",
    title: "EventSpacePro tutorials",
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
    title: "EventSpacePro tutorials",
    description:
      "See the space before it's set. Describe your event, get an AI first draft of your floor plan, then refine every table to scale.",
    images: ["/og-image.jpg"],
  },
};

export default function TutorialsPage() {
  return <TutorialsClient />;
}
