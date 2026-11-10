# Rehearsal: walkthrough

`src/Tour.tsx`, a Stageshow stage on the How it works page. Film it at `/?capture=tour`.

**Gold copied:** `hero-demo` for the frame (one browser window pinned a gutter in, bleeding off the bottom) and the cursor script. The window's content is the prototype's own `Case` component rather than a faux screen.

**Story:** open a source, approve the strategy, send the outreach, hand off, choose markets, answer a carrier from the case file, land on two comparable quotes. Plays once and holds the result; Replay remounts it. The poster for reduced motion is the comparison.

**Changed from the gold:** Vouch's tokens and fonts; real components instead of bars, at realistic fidelity because the screens are the subject; a scrolling page (`Scroll`) instead of a fixed panel; no compact design.

**Film:** `node scripts/film.mjs "http://localhost:5183/?capture=tour" --select '#example' --out evidence/tour.png --every 2600 --count 12 --gate`. Contact sheet in `evidence/tour.png`.

**Gate: passed** (`rehearsal passed`, Nov 10). Fixed to get there: cards popping in and out, jumps when the answer closed and when a card changed height, a scroll clamp, hard edges on folds, a loose label, a wrapped footer, and a button caught mid-scroll. The film still lists 1px settle shifts and text moved by layout, which the gate does not count, and reports its sampling as incomplete.

**Not checked:** a phone-width compact design (the stage scales down instead), dark theme, the fresh-eye review in `references/review.md`, frame-by-frame stepping of each press.
