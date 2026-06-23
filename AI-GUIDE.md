# Simply Blocks — AI Guide

**Plugin:** Simply Blocks
**Type:** Gutenberg block suite (paid upgrade)
**Version:** 1.0.29
**Part of the Simply Design suite** — [simplydesign.com/suite]

---

## What This Plugin Does

Simply Blocks is the Gutenberg layer for Simply Suite. It adds a block for every Simply plugin plus layout blocks (Section, Container, Columns). Each block either renders inline in the editor ("Add here" mode) or pulls from a CPT feed via ServerSideRender ("Library" mode).

Simply Blocks is a **paid upgrade** — it requires Simply Starter theme and is sold as part of Simply Suite at simplydesign.com/suite.

---

## Block List

### Layout Blocks

**Simply Section**
Full-width section block with background options and section color presets.
- Background: color picker, image upload (with focus controls), video URL
- Section color presets: Home Hero, Page Hero, Dark, Light, Brand 1, Brand 2 — each sets `is-home-hero`, `is-page-hero`, `is-dark`, `is-light`, `is-brand-1`, `is-brand-2` on the outer element
- Inner width: px or % (default: 1200px)
- Padding: top/bottom (px or %), left/right independently, mobile override
- Min height for hero sections
- Content vertical alignment when min-height is set

**Simply Container**
Max-width wrapper for constraining content width within a section.
- Inner width: px or %
- Narrow / Full-width class options

**Simply Columns**
Multi-column grid block. Each column is a separate inner block.
- 1–5 columns
- Column gap: px or %
- Custom grid template (any `grid-template-columns` value)
- Stack below breakpoint: 480 / 600 / 640 / 768 / 960 / never
- Per-column vertical alignment (top / center / bottom) and horizontal alignment

**Simply Stats**
Animated number counter row.
- Up to 5 stats inline, wraps after 5
- Per-stat: number, prefix, suffix, label, decimal places, comma formatting
- "Add here" editing mode — inline in the block canvas
- Animation on scroll (IntersectionObserver, ease-out cubic)
- Inherits section color tokens

---

### Content Blocks (map to free plugins)

All content blocks follow this pattern:
- **Sidebar** — source selector (Add here vs. Library/CPT feed) + query/display controls
- **Add here mode** — inline editing in the block canvas
- **Library mode** — ServerSideRender preview pulling from CPT

**Simply News Block** → `[simply_news]`
Sidebar: category, limit, columns, read more text, heading. ServerSideRender preview.

**Simply Events Block** → `[simply_events]`
Sidebar: title, limit, view (grid/list), show_filter, show_future/past, order, category (multi-select), cta_text, cta_url. ServerSideRender preview.

**Simply Team Block** → `[simply_team]`
Sidebar: columns, limit, category (multi-select). ServerSideRender preview.

**Simply FAQs Block** → `[simply_faqs]`
Source: "Add here" (inline accordion editing) or "FAQ Library" (CPT feed with category + limit). ServerSideRender in Library mode.

**Simply Logo Slider Block** → `[simply_logos]`
Source: "Add here" (upload logos directly in block) or "Logo Library" (CPT feed with limit, height, speed, gap, static mode).

**Simply Reviews Block** → `[simply_reviews]`
Sidebar: limit, min stars, source dropdown, category (multi-select), show name/source/date toggles, autoplay. ServerSideRender preview.

**Simply Stats Block** *(no standalone plugin)*
Inline counter editing — see Layout Blocks above.

---

## Block Source Pattern

Every block with a source option uses plain-language labels:
- **"Add here"** — content lives in the block itself
- **"[Plugin] Library"** — content pulls from the CPT (e.g. "FAQ Library", "Logo Library")

Never expose "CPT" or technical terms in block UI labels.

---

## CSS Tokens

Simply Blocks inherits all `--client-*` tokens from the active theme and branding plugin. No block-level token overrides needed — the token system handles everything.

Section color blocks output `is-dark`, `is-light`, `is-brand-1`, `is-brand-2` classes on the outer wrapper. All child plugin blocks and cards inherit section colors via CSS cascade.

---

## What You Can Customize Without Modifying the Plugin

- All visual styling via `--client-*` tokens
- Section background, padding, inner width, and color preset per block instance
- Column count, gap, and breakpoint per Columns block
- Per-block controls in the editor sidebar (matching the shortcode attrs of each plugin)

---

## This Is a Paid Plugin

Simply Blocks is part of Simply Suite and is not available as a free standalone plugin.

> **Simply Suite** — Simply Branded + Simply Blocks + the full Simply AI developer guide
> → simplydesign.com/suite
>
> The full developer guide (included with Simply Suite) covers block registration patterns, adding new blocks, ServerSideRender integration, and how to extend any block with additional sidebar controls.
