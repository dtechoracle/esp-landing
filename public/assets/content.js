/* =====================================================================
   CONTENT — the one file you edit by hand.
   Used by both the home page (index.html) and the tutorials page
   (tutorials.html). Anything left empty ("") stays hidden on the page.
   After editing, save the file and refresh the page.
   ===================================================================== */
var CONTENT = {
  SIGN_UP_URL: "https://app.eventspacepro.com/auth/signup",
  LOG_IN_URL:  "https://app.eventspacepro.com/auth/login",

  // Social links shown as icons in the footer of every page.
  // Paste the full web address between the quote marks. Empty = icon hidden.
  SOCIALS: {
    instagram: "https://www.instagram.com/eventspacepro",
    tiktok:    "https://www.tiktok.com/@eventspacepro",
    facebook:  "https://www.facebook.com/1320475881140251",
    whatsapp:  "https://whatsapp.com/channel/0029VbDahNlLdQej7Bpe5L3t",
    youtube:   "https://www.youtube.com/channel/UCS8n2vkWGz17rttKhD0rKvQ",
    linkedin:  "",
    x:         "https://x.com/eventspacepro"
  },

  // Tutorials page. Add one block per YouTube video, in the order you want them shown.
  // "youtube" accepts any normal YouTube link (watch, youtu.be, shorts or a link copied from "Share").
  // "category" is optional; when two or more categories exist, filter buttons appear automatically.
  // "duration" is optional, e.g. "3:12".
  // Example:
  // { title: "Draw your first floor plan", youtube: "https://youtu.be/VIDEO_ID", description: "From a blank grid to a seated hall.", category: "Getting started", duration: "4:05" },
  TUTORIALS: [
    { title: "How to create a new project", youtube: "https://www.youtube.com/watch?v=gx30ib52FjQ", description: "Set up a project to keep an event's floor plans together.", category: "Getting started", duration: "1:27" },
    { title: "How to create a new event", youtube: "https://www.youtube.com/watch?v=ygk5Hj3QvKU", description: "Start a new event and open it in the 2D editor.", category: "Getting started", duration: "2:03" },
    { title: "How to view the Tour Guide", youtube: "https://www.youtube.com/watch?v=H5vNMy0yAHA", description: "Open the built-in tour for a quick walk around the app.", category: "Getting started", duration: "1:24" },
    { title: "How to draw a venue", youtube: "https://www.youtube.com/watch?v=B_hiccbbJ9Y", description: "Draw your own space to scale, ready for your layout.", category: "Venues", duration: "2:02" },
    { title: "Using a preloaded venue to create an event floor plan", youtube: "https://www.youtube.com/watch?v=TBL6PBi5drE", description: "Start your floor plan from a venue that's already drawn for you.", category: "Venues", duration: "4:01" },
    { title: "How to dimension objects", youtube: "https://www.youtube.com/watch?v=CAS3izvoZbg", description: "Add measurements to objects on your plan.", category: "Editing", duration: "1:20" },
    { title: "How to apply and edit fills and strokes", youtube: "https://www.youtube.com/watch?v=3L9Bk2hVlRA", description: "Change the fill and outline of objects on your plan.", category: "Editing", duration: "1:54" },
    { title: "How to export floor plans", youtube: "https://www.youtube.com/watch?v=fa7VnumkNvQ", description: "Save your finished floor plan to share or print.", category: "Sharing", duration: "2:48" }
  ],

  // Lead magnet ("Not ready yet? Get ___ free"). Leave title empty to hide.
  LEAD_MAGNET: { title: "", url: "" },

  // Trust strip extras (logos or numbers). Leave empty to hide.
  // Example: { logos: [{ src: "/assets/logos/client.svg", alt: "Client name" }], stats: [{ value: "120", label: "plans drawn" }] }
  TRUST_EXTRAS: { logos: [], stats: [] },

  // Proof section: up to three testimonials and a row of numbers.
  // A card only appears once its "quote" is filled in. A stat only appears once its "value" is filled in.
  PROOF: {
    testimonials: [
      { quote: "", name: "", role: "", city: "" },
      { quote: "", name: "", role: "", city: "" },
      { quote: "", name: "", role: "", city: "" }
    ],
    stats: [
      { value: "", label: "" },
      { value: "", label: "" },
      { value: "", label: "" }
    ]
  }
};
