# Green Room — the EventSpacePro design system

EventSpacePro helps venue owners and event planners design, book, and visualize event spaces — from 2D floor plans to 3D walkthroughs, powered by an AI layout assistant. It's a two-sided marketplace: venue owners/managers list and manage spaces; event planners search, book, and design layouts for them. The core product surface is a dashboard (projects, events, favorites, templates) that opens into a dense 2D floor-plan editor with a 3D preview and an AI assistant that generates layouts from natural language prompts.

**Sources used to build this system**
- Figma file "EventSpacePro" (mounted virtual filesystem) — 46 frames covering Auth, Dashboard, Projects, New Event/Project flows, the 2D drag-and-drop editor, 3D preview/overlay views, AI generation flow, and modals (Assets, Save). This file defines **0 formal Figma components** — every screen is built from raw layers — so it was read as ground truth for exact colors, type, spacing and layout geometry rather than a component library.
- GitHub repo [dtechoracle/EventSpacePro-frontend](https://github.com/dtechoracle/EventSpacePro-frontend) (branch `main`) — the real Next.js codebase. Explore it further for the live component implementations (`components/`, `pages/(components)/`), state stores (`store/`), and the floor-plan engine (`components/tools/`, `components/renderers/`, `lib/`).

Anyone with access to these can go deeper than this system does — re-reading the Figma frames for a screen not yet built here, or the GitHub repo for real interaction logic behind any recreated screen.

## Components
- **Forms**: Button, Input
- **Navigation**: SidebarNav
- **Data display**: EventCard, ProjectCard, Badge
- **Feedback**: Panel, PanelItem
- **Editor**: ToolbarButton

### Intentional additions
The Figma file defines no reusable components, so this set was derived from repeating visual patterns actually used across the real screens (dashboard cards, sidebar nav, auth form fields, editor toolbar, card context menus) — sized to what the product needs, not a generic starter kit.

## Content fundamentals
- **Voice**: direct, encouraging, second person ("Ready to create another masterpiece?", "Login to design smarter events with AI-powered planning tools."). Reads like a capable assistant, not a corporate tool.
- **Casing**: sentence case almost everywhere ("Create Event with AI", "Continue with Google"); occasional Title Case on short nav labels (Dashboard, Projects, Events).
- **Punctuation**: light use of exclamation points on welcome/empty states ("Hi, John!", "Welcome Back!"); plain periods elsewhere.
- **No emoji** anywhere in the product copy or UI.
- **Numbers stay concrete**: "250/300 Guests.", "$8,000 of $10,000" — real figures, not vague progress language.
- **Empty/error states are plain and short** ("Empty Project") rather than cutesy.

## Visual foundations
- **Color**: navy `#021938` (logo, dark UI) and blue `#0056A9` (primary accent, every solid CTA) are the two brand anchors. Screen text runs on a near-black plum ink `#272235`, not pure black. A purple accent `#4E1CD8` shows up for AI-flavored moments in the live codebase. Backgrounds are a warm off-white `#FDFDFF` (cards/panels) over a light lavender-tinted page background `#F6F4FA` (dashboard canvas, sidebar).
- **Type**: Instrument Sans throughout (weights 400–700), geometric and rounded, with noticeably **tight, size-scaled negative tracking** (-0.015em at 16px tightening to -0.03em at 24px+) — a signature of this brand's type feel. Instrument Serif appears rarely, italic, for one-off decorative lines. A licensed display face ("Haas Grot Disp Trial") was used for the "EventSpacePro." wordmark text in a couple of auth frames — substituted here with Instrument Sans Bold; flagged below.
- **Spacing**: built on a **6px base unit** (6/12/16/20/24/30/36/48/60/72), not the usual 4 or 8px grid — copied verbatim from the Figma auto-layout gaps.
- **Radii**: 12px on inputs, 24px on dashboard cards, 32px on the full-height auth panel, and fully pill-rounded (999px) on every primary/secondary button and the nav logo mark. Project-browse cards use a squarer 12px.
- **Shadows**: mostly absent. Cards use a near-invisible inset+outset hairline (`rgba(0,0,0,0.02)` at 0.5px) rather than drop shadows; the one exception is the circular logo mark, which has a glossy multi-layer inset-highlight shadow (white insets top/bottom + soft outer glow) to read as a lacquered button. Dropdown/context menus get a real soft shadow.
- **Backgrounds**: flat color, no photography, no textures or gradients on screens — one exception is the auth screen's dark panel, which has a large soft blue radial blob (`rgba(9,51,187,0.65)`) behind the welcome copy.
- **Animation**: minimal — sidebar width/label transitions and mobile-drawer slide-ins use spring/easeInOut motion (~200–300ms) in the live app; hover states are simple opacity/color fades, no bounce.
- **Hover/press**: buttons darken slightly and lift ~1px on hover (see `--shadow-btn-hover`); cards get a blue-tinted border and soft shadow on hover; no visible "pressed/active" shrink observed.
- **Borders**: almost never a visible stroke — most separation is via subtle background-tint changes (`rgba(0,0,0,0.03–0.05)`) instead of borders.
- **Corners over borders**: this brand favors soft radius + faint shadow over a bordered-card look.

## Iconography
- The live codebase's own nav icon set (`assets/icons/nav/`) is a small custom SVG set (SquaresFour, DropboxLogo, CalendarCheck, ChartScatter, Gear, Sparkle, BellRinging, CalendarDots, SignOut, chevron-down) — copied verbatim, used at 20–24px, single-color (currentColor-style black fills).
- The floor-plan editor's own toolbar uses plain Unicode glyphs as tool icons in the live app (⬚ ▬ ▭ ○ ✋) rather than an icon font — reflected in the ToolbarButton component/card.
- Google's `google.svg` mark is copied in for the "Continue with Google" auth button.
- No emoji anywhere in the UI.

## Fonts — substitution flagged
**Instrument Sans** and **Instrument Serif** are both free on Google Fonts and are loaded live via `@import` in `tokens/typography.css` — no substitution needed there.
Two low-usage fonts from the Figma file are licensed/proprietary and were substituted:
- **Haas Grot Disp Trial** (75 Bold, 8 uses — the "EventSpacePro." wordmark on auth screens) → substituted with **Instrument Sans 700**.
- **Satoshi Variable** (10 uses) → substituted with **Instrument Sans**.
If you have licensed files for either, drop them in `assets/fonts/` and update `tokens/typography.css` with real `@font-face` rules and I'll swap the substitutions out.

## Assets
- `assets/brand/` — `mainLogo.svg` (navy-on-white wordmark+mark), `mainLogoLight.svg` (white-on-dark), `small-logo.png` (collapsed-sidebar mark), `logo-mark.svg` (bare "Planet" glyph from Figma, used in the circular logo chip).
- `assets/icons/nav/` — the 10 sidebar nav icons, `assets/icons/google.svg`.
- `assets/textures/` — `bg.jpg`, `noise.png` (used sparingly behind auth/marketing panels in the live app).
- `assets/illustrations/sample-profile.svg` — placeholder avatar illustration used in the live sidebar's profile row.

## UI kits
- `ui_kits/dashboard/` — Dashboard home, Projects grid, New Event flow, and the 2D floor-plan editor shell, wired together as a click-through prototype (`index.html`).

## Index
- `styles.css` — root stylesheet, imports everything under `tokens/`.
- `tokens/` — `colors.css`, `typography.css`, `spacing.css`, `effects.css` (radii/shadows/motion).
- `guidelines/` — 12 foundation specimen cards (colors, type, spacing, radii, shadows, brand marks) shown in the Design System tab.
- `components/` — see the Components section above; each folder has `<Name>.jsx` + `.d.ts` + `.prompt.md` + a `.card.html` demo.
- `ui_kits/dashboard/` — full click-through product recreation.
- `templates/dashboard-app/` — starter template for a new EventSpacePro-branded screen.
- `assets/` — brand, icons, textures, illustrations (see above).
- `SKILL.md` — Claude Code-compatible skill wrapper for this system.
- `github.md` — source-repo sync record.

## Caveats & ask
- The Figma file defines no formal components — the component set above is my best synthesis of the product's real repeating patterns; if you have a component library page in Figma I didn't see, point me to it and I'll rebuild from that instead.
- Two low-usage display fonts (Haas Grot Disp Trial, Satoshi) are proprietary and were substituted with Instrument Sans — send the real font files if you'd like pixel-exact wordmarks.
- The 2D/3D floor-plan editor is the most complex surface in the product (walls, assets, dimensioning, AI operations) and only its outer shell + toolbar is recreated here — deeper editor interactions live in the real codebase (`components/tools/`, `components/renderers/`, `lib/wallGeometry.ts`) and are worth a follow-up pass if you want the editor UI kit taken further.
- Please iterate with me — flag any color, spacing, or copy that reads wrong against the real product and I'll correct it.
