# Mellizo — Landing Page Design Spec

A walkthrough of the visual design of [mellizoai.com](https://mellizoai.com): the palette, type, components and layout of each section, with exact values. All the styling lives in `styles.css` (shared) and a `<style>` block in `index.html` (home page only).

---

## 1. Design direction

- **Mood:** warm, editorial, engineered. Off-white "paper" background, near-black ink, and one strong **ember orange** brand color.
- **Two voices in the type:** a large, light, tightly tracked sans for headlines, and a small UPPERCASE monospace for labels, buttons and metadata. That contrast carries most of the look.
- **Hairlines everywhere:** 1px warm-grey borders split content into a grid of cells (no heavy shadows or cards).
- **One recurring brand motif:** an orange gradient panel ("stage") with animated topographic **contour rings**. It appears in the hero, the closing CTA, and the booking dialog.
- **Bilingual (EN / ES)** and **light / dark** aware throughout.

---

## 2. Color

### Light mode (default)

| Token | Hex | Used for |
|---|---|---|
| `--bg` | `#f4f2ee` | Page background (warm off-white) |
| `--bg-2` | `#ebe8e2` | Secondary fills, window title bars, chips |
| `--surface` | `#ffffff` | Cards, product window, dialog |
| `--ink` | `#0f0e0c` | Primary text, primary button fill |
| `--ink-2` | `#2a2824` | Nav links |
| `--muted` | `#6a655c` | Body copy, leads, labels |
| `--faint` | `#a9a399` | De-emphasized text (statement section) |
| `--line` | `#dcd8cf` | Hairline borders, grid lines |
| `--line-strong` | `#c9c4b9` | Ghost button and language toggle borders |
| `--accent` | `#e0521f` | Label dots, logo, focus rings |
| `--ok` | `#1f8a5b` | "Automated" badge, success states |
| `--pilot` | `#b7791f` | "Pilot" badge |

### Dark mode

Follows `prefers-color-scheme`, or can be forced with `data-theme="dark"`.

| Token | Hex |
|---|---|
| `--bg` | `#0d0c0b` |
| `--bg-2` | `#161513` |
| `--surface` | `#181715` |
| `--ink` | `#f3f0ea` |
| `--ink-2` | `#d6d1c8` |
| `--muted` | `#a19b90` |
| `--faint` | `#6a655c` |
| `--line` | `#2a2825` |
| `--line-strong` | `#3a3733` |
| `--accent` | `#ff6a3d` |
| `--ok` | `#4cc38a` |
| `--pilot` | `#e0a64a` |

### Brand band (the same in light and dark)

| Token | Hex | Role |
|---|---|---|
| `--brand` | `#d4471d` | Main ember orange |
| `--brand-deep` | `#9e2f0d` | Top of the gradient |
| `--brand-glow` | `#ff9157` | Bottom glow |
| `--on-brand` | `#fff6f0` | Text on orange |
| `--on-brand-muted` | `rgba(255,246,240,.76)` | Secondary text on orange |
| `--tile-ink` | `#171512` | Dark tiles, announcement bar, floating result card |

**Stage gradient** (hero, closing CTA, booking panel):
```css
radial-gradient(55% 70% at 50% 108%, #ff9157 0%, transparent 70%),
linear-gradient(180deg, #9e2f0d 0%, #d4471d 60%, #e05a29 100%);
```
Deep red at the top, warming to orange, with a soft glow coming up from the bottom edge.

---

## 3. Typography

**Fonts** (Google Fonts):
- **Geist**, weights 300/400/500/600, for everything.
- **Geist Mono**, weights 400/500, for labels, buttons, badges and metadata.

| Style | Size | Weight | Letter-spacing | Line-height |
|---|---|---|---|---|
| Display (H1) | `clamp(46px, 7.4vw, 104px)` | 400 | `-0.045em` | 0.98 |
| Section title (H2) | `clamp(34px, 4.6vw, 62px)` | 400 | `-0.035em` | 1.02 |
| Statement | `clamp(30px, 3.7vw, 50px)` | 400 | `-0.03em` | 1.12 |
| Stat number | `clamp(36px, 4vw, 54px)` | 400 | `-0.04em` | 1 |
| Cell heading (H3) | 24px | 400 | `-0.02em` | — |
| Lead | `clamp(17px, 1.5vw, 20px)` | 400 | — | 1.5 |
| Body | 17px | 400 | — | 1.55 |
| Mono label | 12px, UPPERCASE | 500 | `0.08em` | — |
| Logo wordmark | 17px, UPPERCASE | 500 | `0.24em` | — |

**Key detail:** headlines are **regular weight (400), never bold**, and tracked very tightly. That's what makes them read as editorial rather than "startup bold". Emphasis inside text comes from **color** (muted to ink), not weight.

**Section label pattern:** a mono uppercase label with a **7px orange dot** before it, e.g. `● HOW WE WORK`. It sits above every H2.

---

## 4. Layout and spacing

- **Max content width:** 1240px, centered, with 32px side padding (16px on phones).
- **Section padding:** 120px top and bottom (88px under 1000px wide).
- **Section header:** a two-column grid (`1.1fr / 0.9fr`, 48px gap). Title on the left, lead paragraph bottom-aligned on the right. It stacks to one column on tablet.
- **Corner radii:** 20px for big panels (stage, dialog), 14px for the product window, 12px for tiles, 4px for buttons. Buttons are almost square on purpose, to look engineered.
- **Hairline cell grid:** content cells share 1px borders like a table (no gaps or shadows). Cell padding is 32px 30px 36px.
- **Background grid:** the hero has a faint 96×96px line grid, masked by a radial fade so it only shows in the top-right.

---

## 5. Components

### Buttons
- **Primary:** ink fill, bg-colored text, mono 13px uppercase. Padding `6px 6px 6px 18px`, with a **30×30px square icon box** on the right holding a ↗ arrow. Lifts 1px on hover.
- **Ghost:** transparent with a `--line-strong` border. The border turns to ink on hover.
- **Light:** white fill, dark text. Used on the orange closing band.

### Header
- **Announcement bar** on top: dark (`#171512`), 11px mono text, orange dot.
- **Sticky nav**, 68px tall, with a **frosted glass** background: `bg` at 86% opacity plus `blur(12px) saturate(1.4)`, and a hairline bottom border.
- **Logo:** two overlapping circles (one outline, one 30% filled) in accent orange, plus the "MELLIZO" wordmark with wide tracking. The mark stands for the "twin".
- Right side: an **EN | ES toggle** (mono, bordered segments, the active one filled with ink) and a "Book a call" button.

### Contour rings (signature motif)
- 16 concentric ellipses drawn with JavaScript (`site.js`), converging on a focal point. The ellipse ratio is 0.46, so they look like a topographic map seen in perspective.
- Stroke is `--on-brand`, opacity fading from 0.32 to 0.06 going outward.
- The inner 4 rings **"breathe"**: a 6s ease-in-out loop that scales to 1.05 and fades to 50%. It's turned off under `prefers-reduced-motion`.

### Product window mock
- A fake app window: white surface, 14px radius, a title bar with three grey dots, a 160px sidebar and a main panel.
- Long, warm shadow: `0 40px 80px -30px rgba(40,12,0,.45)`.
- Inside are **workflow rows** with flow chips (`WhatsApp → Excel → ERP`) and status **badges**:
  - Green "Automated", amber "Pilot · day 3", grey "Mapped". Each badge uses its color as text over a 12–14% tint of the same color.

### Industry tiles
- Three tiles, 4:3.4 aspect ratio, 12px radius, each with its own background and abstract line art:
  - **Healthcare:** ember gradient with a heartbeat line.
  - **Manufacturing:** near-black with Gantt-style bars, one in orange.
  - **Logistics:** dark brown gradient (`#5b4636 → #2b211a`) with a dotted route line and an orange destination dot.
- A mono number (`01`) at the top left, the industry name at the bottom with a ↗ icon box, and mono use-cases underneath.

---

## 6. Page structure (top to bottom)

1. **Announcement bar.** One line of mono text naming the target industries.
2. **Sticky header.** Logo, nav (Company brain · Industries · How we work · Mission), language toggle, Book a call.
3. **Hero**
   - Two-column top (`1.35fr / 0.65fr`): a huge headline, *"Meet your AI twin."*, on the left; lead copy and the CTAs (primary + ghost) on the right, bottom-aligned.
   - Below that, a full-width **orange stage** (min 600px tall) with contour rings. The **product window** sits centered on it, with two floating cards breaking out of its edges:
     - A white **WhatsApp bubble** (top-left), showing a customer order message.
     - A dark **result card** (bottom-right), showing "Order created in ERP" and a green "Confirmed".
   - The story it tells: *a WhatsApp message becomes an ERP order automatically.*
4. **Statement.** One large paragraph. The first sentence is in faint grey, and the key sentence is in full ink color. This is the "read the bold part" trick, done with color instead of weight.
5. **"Why AI stalls."** A bordered two-column block: copy on the left, and on the right three hairline cells (Focused / Embedded / Owned) on a `bg-2` background.
6. **Company brain.** The section header plus a live product panel (`#brain-demo`, animated by `brain.js`) that walks through the platform left to right, in the whiteboard order:
   - **01 Connect:** the client's systems (Salesforce · CRM, WhatsApp, Email, Oracle · ERP, Excel) as hairline rows with mono initials. A row's border turns orange when it emits a record.
   - **02 Extract:** a mono "raw record" table on `--bg`, where messy pipe-separated rows land at the top.
   - **03 Transform:** clean event logs (`order.created`, `invoice.received`…) with an orange left rule on the newest.
   - **04 Load:** the brain, drawn as a small **orange stage with contour rings**, holding a graph of business entities (Customer, Deal, Order, SKU, Invoice, Payment, Supplier). Each loaded record pings its entities, lights the link between them and adds a new node; the oldest added nodes fade out.
   - **05 Ask:** a full-width row where a question is typed ("What was EBITDA yesterday?") and answered with a big number, a muted detail line and mono source chips (`ERP`, `Excel`). The entities used for the answer stay highlighted in the graph.
   - Orange square "packets" travel along dashed pipes between the columns. Under 1000px the columns stack and the pipes turn vertical. The demo only runs while it's on screen, and under `prefers-reduced-motion` it shows a static state with the answers changing slowly.
7. **Industries.** The section header plus the three art tiles.
8. **How we work.** *"A platform to onboard. A team to implement."* Two stacked **layers**, each a hairline-bordered row with a 340px intro panel on the left and three numbered cells on the right:
   - **Layer 01 · Platform:** the intro panel is an orange **stage with contour rings** (the same look as the brain in the Company brain demo): *"The company brain"*, plus a mono link back up to `#brain`. Cells: 01 Connect · 02 Unify · 03 Ask.
   - A mono connector line with a dashed vertical rule, *"Built on the brain"*, joins the two layers.
   - **Layer 02 · Implementation:** the intro panel is a dark `--tile-ink` tile: *"Your AI twin, at work"*. Cells: 01 Map · 02 Build · 03 Hand off.
   - The row of three **big stats** sits directly under the implementation layer (`1–5` days per sprint, `0` new tools, `100%` owned).
   - Under 1000px each intro panel stacks on top of its cells.
9. **Mission / closing CTA.** An orange stage inset 16px from the page edges, centered text, the contour rings coming down from the top, and a white "Book a call" button. 130px vertical padding.
10. **Footer.** Three columns (brand + tagline, Industries, Mellizo links), a hairline, then a mono bottom row with © and "Built in Latin America".

---

## 7. Booking dialog

Every "Book a call" button opens an **in-page modal** instead of leaving the site.
- Up to 1120×860px, 20px radius, with a blurred dark backdrop (`rgba(15,14,12,.6)` + 6px blur).
- **Left panel (340px):** the orange stage gradient with contour rings, the logo, the title *"Book a call with Mellizo"*, and a numbered agenda list (01/02/03) separated by translucent white hairlines.
- **Right:** an embedded **Cal.com** calendar, themed with the brand colors (orange `#e0521f` in light mode, `#ff9157` in dark).
- Entry animation: 0.28s, moving up 12px and scaling from 0.985, with `cubic-bezier(.2,.8,.2,1)`.
- On mobile it goes full-screen and the orange panel shrinks to a header strip.

---

## 8. Motion and interaction

All motion is subtle and turned off under `prefers-reduced-motion`.
- Buttons lift 1px on hover (0.15s).
- Contour rings breathe (6s loop).
- Dialog slides up when it opens.
- Smooth scrolling for anchor links, with an 80px offset for the sticky header.
- Focus rings: 2px accent-orange outline, 3px offset.

---

## 9. Responsive behavior

| Breakpoint | Changes |
|---|---|
| ≤ 1100px | Floating hero cards tuck in closer to the window |
| ≤ 1000px | Hero and section headers stack to one column; tiles and 3-col cells stack; section padding goes to 88px |
| ≤ 760px | Nav links and the header button are hidden (logo + language toggle only) |
| ≤ 640px | 16px gutters; product window sidebar hidden; dark result card hidden; tiles become 4:3; closing band inset drops to 8px |

---

## 10. Language switching

- Every piece of copy exists twice in the HTML: `data-l="en"` and `data-l="es"`. CSS hides whichever language isn't active.
- On first visit the language comes from the browser (Spanish if the browser language starts with `es`). After that, the visitor's choice is remembered in `localStorage`.
- The page `<title>` and meta description switch too.

---

*Source files: `index.html`, `styles.css`, `site.js`, `brain.js`. The Industries page (`industries.html`) reuses the same system.*
