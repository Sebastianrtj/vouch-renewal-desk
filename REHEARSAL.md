# Rehearsal: walkthrough

`src/Tour.tsx`, a Stageshow stage on the How it works page. Film it at `/?capture=tour`.

**Gold copied:** `hero-demo` for the frame (one browser window pinned a gutter in, bleeding off the bottom) and the cursor script. The window's content is the prototype's own `Case` component rather than a faux screen.

**Story:** open a source, approve the strategy, send the outreach, hand off, choose markets, answer a carrier from the case file, land on two comparable quotes. Plays once and holds the result; Replay remounts it. The poster for reduced motion is the comparison.

**Changed from the gold:** Vouch's tokens and fonts; real components instead of bars, at realistic fidelity because the screens are the subject; a scrolling page (`Scroll`) instead of a fixed panel; no compact design.

**Film:** `node scripts/film.mjs "http://localhost:5183/?capture=tour" --select '#example' --out evidence/tour.png --every 2600 --count 12 --gate`. Contact sheet in `evidence/tour.png`.

**Gate: not passed.** Fixed along the way: cards popping in and out, a 275px jump when the answer closed, a scroll clamp, hard edges on the evidence fold. Still reported: 1px settle shifts after a card's height glide, text moved by layout during folds ("steps in its box"), and the status pill changing from Question to Quote in place.

**Not checked:** a phone-width compact design (the stage scales down instead), dark theme, the fresh-eye review in `references/review.md`, frame-by-frame stepping of each press.
