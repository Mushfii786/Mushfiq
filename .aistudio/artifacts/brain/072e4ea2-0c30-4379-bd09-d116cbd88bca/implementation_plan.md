# Implementation Plan: Professional Cinematic Hero Section

Transform the hero page into a premier, commercial-grade visual director and creator showcase, replacing the generic SaaS-style elements with high-end cinematic editorial polish.

---

## 1. Cinematic Background & Showreel Ambience
- **Ambient Showreel Background**: Integrate a high-definition, looping cinematic reel backdrop with subtle film grain, dark vignette overlays, and an optional 2.39:1 anamorphic letterbox feel.
- **Audio Equalizer & Sound Toggle**: Add a sleek glassmorphism sound control (`Muted` / `Sound Active` with subtle animated audio wave bars) in the lower corner of the hero.
- **Full Showreel Theater Modal**: Connect a dedicated "Watch Full Reel" button that opens an immersive darkroom theater player with scrubbing and audio.

---

## 2. Refined Editorial Typography & Identity
- **Monochrome & Warm Amber Palette**: Shift away from neon SaaS gradients to a refined luxury aesthetic—deep blacks (`#050505`), bone white (`#F8F9FA`), and warm amber/gold cinematic accents.
- **Director-Level Title Hierarchy**:
  - *Eyebrow Header*: `MUHAMMED MUSHFIQ — CREATIVE DIRECTOR & CINEMATOGRAPHER`
  - *Main Headline*: `Directing & Crafting Cinematic Stories That Resonate.`
  - *Credential Pill*: `Based in Kerala, India • Available for Global Commissions`
  - *Live Availability Badge*: Discrete emerald pulse badge: `Open for Freelance & Commercial Projects`.

---

## 3. High-Converting Professional Action Bar
- **Primary CTA**: `Watch Showreel` with a glowing play badge.
- **Secondary CTA**: `Book Commission / Contact` linking smoothly to inquiry channels.
- **Quick Links**: Direct links to `Selected Works` and instant WhatsApp messaging.

---

## 4. Director Credentials & Milestone Bar
- Place a subtle, high-trust horizontal stats and credentials strip at the bottom of the hero:
  - `5+ Years Directing & Editing`
  - `40+ Projects Delivered`
  - `250K+ Visual Impressions`
  - `Commercial · Music Video · Narrative`

---

## 5. Performance & Mobile Polish
- Ensure mobile touch devices receive an ultra-crisp optimized poster frame and smooth touch interactions.
- Full `prefers-reduced-motion` support and GPU-accelerated 120Hz/144Hz animations.

---

## Verification & Testing
- Verify video playback and audio mute toggles across Chrome/Safari/Firefox without autoplay errors.
- Confirm flawless responsiveness across mobile (375px, 414px), tablet (768px, 1024px), and desktop.
- Run `compile_applet` and `lint_applet` to ensure zero compilation or TypeScript errors.
