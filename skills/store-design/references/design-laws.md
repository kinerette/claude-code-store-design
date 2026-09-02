# Design laws

The decision table says *which* sections to lay. This file says how to lay them
so the page does not read as generated.

Every rule is written as **the fault it repairs**, because a rule without its
fault is a preference, and preferences do not survive contact with a product
they were not written for. Each of these came out of a page that failed.

---

## The three signatures of a generated page

Measured, not guessed. These three are what a machine reaches for when nobody
has decided anything, and a visitor recognises the combination instantly even if
they cannot name it.

1. **A purple gradient.**
2. **A coloured glow or halo behind an element.**
3. **A cream background.**

**The rule:** none of the three, ever. Cream is the strongest attractor of all —
a page in cream with a desaturated photograph reads as a newspaper: old, thin,
unconfident. Name the darkest point of the page first, and let the colour come
out of the **material of the product** rather than a palette chosen in the
abstract.

A related tell, worth knowing separately: **a flat slab of colour behind a block
of text** is the signature of a generated section. Keep the ground neutral.

---

## Colour

### The colour bath

**The fault:** an accent colour escapes and takes the background, the cards, the
buttons and the photograph. The page then wears *your* brand instead of the
merchant's. A page that is entirely red is exactly as wrong as one that is
entirely blue — the problem was never the hue.

**The rule:** the component is the garment, not the brand. The merchant's site
wears it. So: **neutral ground, and the colour stays inside the component.**

This is measurable, and worth measuring on the 1440 render:

- **chromatic surface** — every clearly coloured pixel (saturation ≥ 0.28)
- **accent surface** — the chromatic pixels whose hue is within 25° of the
  declared accent
- **dominant hue** — the peak of the hue histogram

**Threshold: the accent must occupy no more than 15% of the surface.** Past
that it is a bath, not an accent, and a merchant with a pink brand will not be
able to wear the piece.

---

## Composition

### Nothing touches the edges

**The fault:** an element flush to the viewport edge reads as a rendering
accident rather than a decision, and on a phone it reads as broken.

**The rule:** nothing touches the edges. Define a margin token for 390 and a
wider one for 1440. A full-bleed is an explicit decision, reserved for the hero.

### Nothing overflows, ever

**The fault:** a button that spills out of the frame at an odd width. Content
that cannot be reached is not a layout, it is a defect.

**The rule:** `scrollWidth === clientWidth` at every width. This is a check you
run, not an intention you hold.

### One highlighted figure at a time

**The fault:** two large numbers on one screen compete, and the visitor reads
neither.

**The rule:** one prominent figure per section. If a second matters, it is
smaller, or it is in the next section.

### Legible at 390px

**The fault:** a layout designed at 1440 and squeezed. Columns crush, type drops
below readability, and a dense line gets truncated with an ellipsis — which
throws away the word that was carrying the meaning.

**The rule, as a check:** no horizontal overflow, no text under 12px, no column
crushed below roughly 82px. **A line that is too dense folds. It never
truncates.** Aim the type at a reader of 45 on a phone, because that is who is
buying: 14px is the floor for anything that must be read.

### Recompose, never scale down

**The fault:** shrinking the whole layout to fit. Everything becomes small and
nothing becomes simpler.

**The rule:** when space runs out, the composition *loses parts* the way the
real thing would — a sidebar goes, secondary columns go. You recompose. You do
not scale.

### Alternate the grounds

**The fault:** twelve sections on one background become an undifferentiated
scroll, and the visitor cannot tell how far through they are.

**The rule:** alternate the section backgrounds down the page. The change of
ground is what marks a new idea. Keep genuinely saturated pieces rare — roughly
one in fourteen — so that the one you choose actually lands.

### "And then" runs horizontally

**The fault:** a sequence of steps stacked vertically is read as a list. The
reader does not experience it as a progression, so the argument it was carrying
is lost.

**The rule:** when a section says *and then*, lay it horizontally. Progression
is a direction on the page.

### A carousel has to turn

**The fault:** a carousel that sits still is a cropped image with dots under it.
Nobody swipes it, so everything behind slide one is never seen.

**The rule:** if it is a carousel, it moves on its own. If it must not move, it
is not a carousel — make it a grid.

### The product breaks the frame

**The fault:** a product photograph sitting obediently inside its card looks
like stock, and the card has to be tall enough to contain it.

**The rule:** let the product overflow its frame — tilted a few degrees,
breaking the top edge. Two effects at once: it is seen, and the card can stay
thin because the product's height is no longer the card's height.

Two conditions:

- The shadow is a real `drop-shadow` that follows the cut-out silhouette. A
  `box-shadow` draws the shadow of a rectangle and gives away the montage
  immediately.
- **At 390px, nothing overflows.** An object leaving its cell on a narrow screen
  leaves the *screen*, and unreachable content is a defect, not a layout.

### Judge the page, not the section

**The fault:** components get placed *because they exist*. Nothing in a generic
build measures whether the page coheres, so a page can contain every recommended
block and still be worth less than the sum of them.

**The rule:** hunting "the worst defect in this section" converges on zero small
defects, never on a good page. If a block does not earn its place beside its
neighbours, remove it. Removing is a decision.

### One hop in the head

**The fault:** a screen that needs two chained deductions is a failed screen,
however handsome. The visitor makes the first hop and stops.

**The rule:** one hop between what is shown and what it means. A test: blur the
screen until you cannot read it. If what remains does not say what the section is
for, the section is doing all its work in the words.

---

## Motion

### The fly to the cart

**The fault:** an item is added and nothing visibly moves, so the buyer is not
sure it worked and opens the cart to check — which takes them off the product
page, where the second purchase was going to happen.

**The rule:** the product physically travels to the cart icon. The gesture
confirms the add without a word.

- Clone the product image as a ghost: `position: fixed`, high `z-index`, a
  `drop-shadow`. Start at the click point, aim at the centre of the cart anchor.
- Trajectory: `scale 1 → 0.18`, `opacity 1 → 0.3`, **duration 0.7 s**, curve
  `back.in(1.2)`. The `back.in` is what gives it momentum — the piece draws back
  slightly before it leaves.
- On arrival the cart icon bounces: `scale 1 → 1.18`, 0.12 s, yoyo, one
  repetition.
- Use an animation library if one is present, **fall back to the Web Animations
  API** otherwise. Never a hard dependency for this.
- `prefers-reduced-motion: reduce` → **do nothing at all** and return
  immediately.
- The drawer opens only after the promise resolves: the gesture finishes, *then*
  the cart appears.

### Not too much movement

**The fault:** a page where several things move at once is tiring to look at,
and tiredness reads as cheapness.

**The rule:** one thing moves at a time, and only in response to something the
visitor did.

### Never animate a property that re-lays the page

**The fault:** animating a layout property frame by frame. On one document we
measured layout at **356 ms per frame** doing this — reported by the user as "10
fps". The same effect moved onto `transform` took **0.5 ms**.

**The rule:** per-frame animation touches `transform` and `opacity` only. If you
measure it, measure layout duration, not the frame callbacks — the callbacks look
healthy while the page is unusable.

---

## Type, image and ornament

### No glow, no halo, no shadow ringing a component

**The fault:** a soft shadow placed around every card to "lift" it. It lifts
nothing, it fogs the whole page, and it is on the short list of things that make
a layout look automatically generated.

**The rule:** no decorative glow or ambient shadow around elements. A real
`drop-shadow` that follows a cut-out product is a different thing and is
allowed — it is describing an object, not decorating a box.

### Never a serif in a headline

**The fault:** the model reaches for a serif to signal "editorial", and the page
reads as made by an AI. It is the most recognisable typographic tell there is.

**The rule:** no serif in a title. Ban the *class*, not a list of names — an
unfamiliar serif is still a serif. Use a modern grotesque, one family for
headings and one for running text.

### Never the default system font either

**The fault:** the opposite failure. An unstyled system stack is what a page
looks like when nobody chose anything, and it is the first sign of a rushed
site.

**The rule:** choose a real family and commit to it. The personality of a page
comes from its composition — spacing, rhythm, crops — not from a typeface doing
the work alone.

### Never crush, condense or stretch a typeface

**The fault:** a squeezed headline is visible to everyone and attributable by
nobody. It reads as cheap.

**The rule:** no `font-stretch`, no `scaleX`, no condensed cut standing in for
the regular one. If the headline does not fit, the headline is too long or the
size is wrong. Fix the text, not the letterforms.

### Never scale text with a transform

**The fault:** `transform: scale()` rasterises. Text rendered at one size and
then stretched ships visibly soft, and it decomposes badly at high zoom.

**The rule:** render at the final size. If an entire document must be scaled,
use `zoom`, which re-renders, rather than `transform`, which resamples. No 3D or
scale transform on anything containing type to be read.

### A logo is never redrawn by hand

**The fault:** a logo assembled from SVG shapes or CSS layers reads as a diagram
of a logo. It has no material and never sits right against a photograph.

**The rule:** use the real asset. Never reconstruct a mark in markup. Where an
avatar is needed and no photograph exists, **use initials** — not a drawn logo,
not a stock face.

### Never invent a figure that commits you

**The fault:** a generated statistic is a fabricated fact, and it is checkable.
A conversion rate, an uptime percentage, a review count or a customer logo that
nobody earned is a false statement the moment it ships.

**The rule:** no invented number anywhere. A demonstration figure is *visibly* an
example, or it is not there. See `references/proof.md`.

### The second photographed state

**The fault:** a page can be cloned in an afternoon when every state of the
product is the same photograph under different CSS. The clone looks identical
because it is identical.

**The rule:** when an interaction reveals a different state of an object, it
reveals **a genuinely different photograph** of that object — a second shot, not
a filter on the first. A CSS gradient, an agent reproduces. A second exposure it
does not have, it cannot.

This is also the honest ceiling of any file of rules: the distance between a
correct page and a striking one is mostly photography, and no skill ships that.

---

## What this file deliberately does not contain

The rules, not the library. We maintain a large set of built sections that
encode these laws; they are not in this repository and will not be. A rule you
understand transfers to a product it was never written for. A block you paste
does not.

If you want the sections themselves, the audit that rejects a page unable to
take money, and the photographic direction that goes with them, that is
[uxgen](https://www.uxgen.ai). What is here is free, complete on its own terms,
and enough to make the next page better.
