# Simply Branded — AI Guide

**Plugin:** Simply Branded
**Type:** Paid upgrade — per-site branding admin UI
**Version:** 2.1.2
**Part of the Simply Design suite** — [simplydesign.com/suite]

---

## What This Plugin Does

Simply Branded gives any Simply Starter site a full visual branding admin — colors, fonts, border radius, border width, and custom CSS — all configurable without touching code. It outputs `--client-*` CSS tokens via `wp_head` at priority 99, which overrides all theme defaults and gives plugins their brand-aware appearance automatically.

Simply Branded is a **paid upgrade** — it's the alternative to building a Client Branded plugin by hand.

---

## Admin UI (Appearance → Simply Branded)

### Color Palette
Six fields, all feeding the `--client-*` token system:

| Field | Tokens generated |
|-------|-----------------|
| Light Neutral | `--client-bg`, `--client-section-light-bg`, and related light section tokens |
| Dark Neutral | `--client-text`, `--client-section-dark-bg`, and related dark section tokens |
| Brand 1 | `--client-section-brand1-bg` and related brand1 tokens |
| Brand 2 | `--client-section-brand2-bg` and related brand2 tokens (optional) |
| Highlight | `--client-accent`, `--client-link`, buttons, badges |
| Highlight 2 | `--client-accent-2` (optional) |

All `--client-section-*` tokens (text, heading, highlight per section color) are **derived automatically** from the 6 palette fields — you don't set them individually.

### Structure
| Field | Token | Notes |
|-------|-------|-------|
| Border Radius | `--client-radius` | Applies to all `ss-card` elements and can be applied to buttons via custom CSS |
| Border Width | `--client-border-width` | Global border width token |

### Fonts
Three font slots:
- **Display font** → `--client-font-display` (headings, titles)
- **Primary font** → `--client-font-primary` (body text)
- **Highlight / Script font** → `--client-font-script` (decorative accent)

Each slot accepts:
- **Font Stylesheet URL** — paste any Google Fonts, cdnfonts, or CSS font service URL
- **Self-Hosted Font** — upload font files via the Upload button; plugin auto-generates `@font-face` (detects weight and italic from filename)

### Custom CSS
Freeform CSS block appended after all token output. Use for any overrides that go beyond tokens.

---

## Token Output

Tokens are output via `wp_head` at **priority 99** — this fires after the theme stylesheet link, so tokens override theme defaults correctly.

---

## Block Editor Color Palette

Simply Branded automatically registers the 6 saved colors as the block editor color palette. This means your brand colors appear in the Gutenberg color picker for all blocks.

---

## Wireframe Mode

Appearance → Simply Starter → toggle "Wireframe Mode" — deactivates Simply Branded (and any Client Branded plugin) so the site renders in the unstyled theme layout. Used to review page structure without brand applied. Deactivation is temporary — toggle back to restore branding.

---

## Simply Branded vs. Client Branded

| | Simply Branded | Client Branded |
|--|---------------|----------------|
| Who configures it | Site owner via WP Admin | Agency AI-built from brand brief |
| Admin UI | Yes — Appearance → Simply Branded | No — values hardcoded |
| Use case | Any Simply Starter site | Agency-built client sites |
| Font loading | Upload or stylesheet URL | Hardcoded @font-face or kit ID |

Use **Simply Branded** when the client will manage their own brand settings. Use a **Client Branded plugin** when the agency builds and owns the configuration.

---

## This Is a Paid Plugin

Simply Branded is part of Simply Suite and is not available as a free standalone plugin.

> **Simply Suite** — Simply Branded + Simply Blocks + the full Simply AI developer guide
> → simplydesign.com/suite
