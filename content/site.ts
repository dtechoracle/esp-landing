export interface Tutorial {
  title: string;
  youtube: string;
  description?: string;
  category?: string;
  duration?: string;
}

export interface SocialLinks {
  instagram?: string;
  tiktok?: string;
  facebook?: string;
  whatsapp?: string;
  youtube?: string;
  linkedin?: string;
  x?: string;
  [key: string]: string | undefined;
}

export interface ProofQuote {
  quote: string;
  name: string;
  role: string;
  city: string;
}

export interface ProofStat {
  value: string;
  label: string;
}

export interface SiteContent {
  SIGN_UP_URL: string;
  LOG_IN_URL: string;
  SOCIALS: SocialLinks;
  TUTORIALS: Tutorial[];
  LEAD_MAGNET: {
    title: string;
    url: string;
  };
  TRUST_EXTRAS: {
    logos: Array<{ src: string; alt?: string }>;
    stats: Array<{ value: string; label?: string }>;
  };
  PROOF: {
    testimonials: ProofQuote[];
    stats: ProofStat[];
  };
}

export const CONTENT: SiteContent = {
  SIGN_UP_URL: "https://app.eventspacepro.com/auth/signup",
  LOG_IN_URL: "https://app.eventspacepro.com/auth/login",

  // Social links shown as icons in the footer of every page.
  // Paste the full web address between the quote marks. Empty = icon hidden.
  SOCIALS: {
    instagram: "https://www.instagram.com/eventspacepro",
    tiktok: "https://www.tiktok.com/@eventspacepro",
    facebook: "https://www.facebook.com/1320475881140251",
    whatsapp: "https://whatsapp.com/channel/0029VbDahNlLdQej7Bpe5L3t",
    youtube: "https://www.youtube.com/channel/UCS8n2vkWGz17rttKhD0rKvQ",
    linkedin: "",
    x: "https://x.com/eventspacepro",
  },

  // Tutorials page. Add one block per YouTube video, in the order you want them shown.
  TUTORIALS: [
    {
      title: "How to create a new project",
      youtube: "https://www.youtube.com/watch?v=gx30ib52FjQ",
      description: "Set up a project to keep an event's floor plans together.",
      category: "Getting started",
      duration: "1:27",
    },
    {
      title: "How to create a new event",
      youtube: "https://www.youtube.com/watch?v=ygk5Hj3QvKU",
      description: "Start a new event and open it in the 2D editor.",
      category: "Getting started",
      duration: "2:03",
    },
    {
      title: "How to view the Tour Guide",
      youtube: "https://www.youtube.com/watch?v=H5vNMy0yAHA",
      description: "Open the built-in tour for a quick walk around the app.",
      category: "Getting started",
      duration: "1:24",
    },
    {
      title: "How to draw a venue",
      youtube: "https://www.youtube.com/watch?v=B_hiccbbJ9Y",
      description: "Draw your own space to scale, ready for your layout.",
      category: "Venues",
      duration: "2:02",
    },
    {
      title: "Using a preloaded venue to create an event floor plan",
      youtube: "https://www.youtube.com/watch?v=TBL6PBi5drE",
      description: "Start your floor plan from a venue that's already drawn for you.",
      category: "Venues",
      duration: "4:01",
    },
    {
      title: "How to dimension objects",
      youtube: "https://www.youtube.com/watch?v=CAS3izvoZbg",
      description: "Add measurements to objects on your plan.",
      category: "Editing",
      duration: "1:20",
    },
    {
      title: "How to apply and edit fills and strokes",
      youtube: "https://www.youtube.com/watch?v=3L9Bk2hVlRA",
      description: "Change the fill and outline of objects on your plan.",
      category: "Editing",
      duration: "1:54",
    },
    {
      title: "How to export floor plans",
      youtube: "https://www.youtube.com/watch?v=fa7VnumkNvQ",
      description: "Save your finished floor plan to share or print.",
      category: "Sharing",
      duration: "2:48",
    },
  ],

  // Lead magnet ("Not ready yet? Get ___ free"). Leave title empty to hide.
  LEAD_MAGNET: { title: "", url: "" },

  // Trust strip extras (logos or numbers). Leave empty to hide.
  TRUST_EXTRAS: { logos: [], stats: [] },

  // Proof section: up to three testimonials and a row of numbers.
  PROOF: {
    testimonials: [
      { quote: "", name: "", role: "", city: "" },
      { quote: "", name: "", role: "", city: "" },
      { quote: "", name: "", role: "", city: "" },
    ],
    stats: [
      { value: "", label: "" },
      { value: "", label: "" },
      { value: "", label: "" },
    ],
  },
};

/** Turns any YouTube link into its video ID */
export function getYoutubeId(url: string): string {
  if (typeof url !== "string") return "";
  const m = url.match(
    /(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:watch\?(?:.*&)?v=|shorts\/|embed\/|live\/|v\/))([A-Za-z0-9_-]{11})/
  );
  return m ? m[1] : /^[A-Za-z0-9_-]{11}$/.test(url.trim()) ? url.trim() : "";
}
