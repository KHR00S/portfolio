# Design system — "Thermocline"

The site is about one person who works across three layers: networks (day job),
power systems (training) and machine learning (research on lake upwelling).
The visual identity borrows from the two things only he would put on a page:
a lake in cross-section with its temperature layers, and an engineer's
single-line diagram.

## Colour

Two themes share one set of semantic tokens (`src/index.css`).

| Token        | Dark       | Light      | Role                                   |
|--------------|------------|------------|----------------------------------------|
| `--bg`       | `#0A2026`  | `#EDF2EE`  | page                                   |
| `--bg-2`     | `#0F2D35`  | `#E0E9E4`  | raised bands, dialogs                  |
| `--text`     | `#E4EFEA`  | `#0A2026`  | body and headings                      |
| `--muted`    | `#9DB8B2`  | `#3E5A57`  | secondary copy (≥ 4.5:1 on `--bg`)     |
| `--iso`      | `#3B8A86`  | `#7DA8A2`  | isolines, rules, the bus line          |
| `--lamp`     | `#F4B740`  | `#F4B740`  | indicator lamp: CTA fill, live node    |
| `--lamp-ink` | `#F4B740`  | `#8A4F00`  | lamp colour when used as text          |

Amber is an HMI indicator lamp: it means "live" or "act here" and nothing else.

## Type

- **Big Shoulders Display** (700/800) — industrial signage face for the name,
  section titles and big numbers. Mixed case, tight leading.
- **IBM Plex Sans** (400/500/600) — body, navigation, metadata.
- Body 16–18px, line length ≤ 68ch, line-height 1.6. Hero is fluid `clamp()`.
- No all-caps tracked labels, no mono "data" labels, no middle-dot meta strings.

## Layout

```
┌ nav: FS ─────────────── Path Research Builds Credentials Contact ◐ ┐
│ HERO  canvas lake cross-section, isolines full-bleed                │
│   Fakhrus                                                           │
│   Syakir            lede + Email me / Read the research             │
│   caption: "move across the lake to cause upwelling"                │
├ ABOUT  portrait + story  │ three strata: Network / Power / Learning ┤
├ PATH   date │ ■── bus line (single-line diagram), live node lit     ┤
├ RESEARCH  featured paper (image) + two rows                         ┤
├ BUILDS    list rows, links to the real repos                        ┤
├ CREDENTIALS  awards as big rows, certificate shelf, show all        ┤
└ CONTACT  email in display type, links                               ┘
```

Left-aligned throughout.

## Principles

1. One signature: the interactive lake. Everything else stays quiet.
2. Structure means something: the vertical bus line only appears where the
   content is a sequence (career path). Strata only where content is layered.
3. Motion answers people: pointer stirs the lake, the bus line follows scroll,
   the theme switch wipes from the toggle. No fade-up on every section.
4. Reduced motion: the lake renders one still frame, the bus line is drawn,
   the theme switch is instant.
5. Only facts from the CV and the GitHub account. No invented clients or quotes.
