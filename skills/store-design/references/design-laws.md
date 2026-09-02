# Design laws

The decision table says *which* sections to lay. This file says how to lay them
so the page does not read as generated.

Every rule below is written as **the fault it repairs**, because a rule without
its fault is a preference, and preferences do not survive contact with a product
they were not written for. These are the constraints we work to. They came out
of pages that failed, one rule per failure.

---

## The tells that a page was made by a machine

A visitor cannot articulate why a page feels generated, but they leave anyway.
Three signals do most of the damage, and all three are cheap to avoid.

### 1. A serif in the headline

**The fault:** the model reaches for a serif to signal "editorial", and the
result reads as a site made by an AI. It is the single most recognisable tell.

**The rule:** no serif in a title. Ever. Use a modern grotesque. Ban the
*class*, not a list of names — a new serif you have not seen before is still a
serif.

### 2. The default system font

**The fault:** the opposite failure. Shipping `system-ui` or an unstyled stack
is the number one slop signal, because it is what a page looks like when nobody
chose anything.

**The rule:** **legibility before personality.** Neither a novelty face nor the
system default. Pick one real family and commit to it. The personality of a page
comes from its *composition* — the spacing, the rhythm, the crops — not from a
font doing the work alone.

### 3. Cream backgrounds and washed-out photography

**The fault:** cream is the model's strongest attractor, and a page in cream
with a desaturated stock photo "looks like a newspaper". It reads as old, thin
and unconfident, and every generated store lands there by default.

**The rule:** name the darkest point of the page before anything else, and let
the colour come out of the **material of the product**, not from a house palette
picked in the abstract. Saturated colour on a deep ground beats cream on white
every time in this category.

---

## Composition

### Alternate the grounds

**The fault:** twelve sections on one background become one undifferentiated
scroll, and the visitor cannot tell how far through they are.

**The rule:** alternate the section backgrounds down the page. The change of
ground is what marks a new idea.

### Nothing touches the edges

**The fault:** an element flush to the viewport edge reads as a rendering
accident, not as a decision — and on a phone it reads as broken.

**The rule:** nothing touches the edges. Every band keeps its margin, including
full-bleed images, which keep their content inside a safe inset even when the
image itself bleeds.

### "Next" runs horizontally

**The fault:** a sequence of steps stacked vertically is a list. The reader does
not experience it as a progression, so the argument it was carrying is lost.

**The rule:** when a section says *and then*, lay it horizontally. Progression is
a direction on the page, not a numbered list.

### A carousel has to turn

**The fault:** a carousel that sits still is a cropped image with dots under it.
Nobody swipes it, so the content behind slide one is never seen.

**The rule:** if it is a carousel, it moves on its own. If it must not move, it
is not a carousel — make it a grid.

### Harmony before presence

**The fault:** components get placed *because they exist*. Nothing in a generic
build measures whether the page coheres, so a page can contain every recommended
block and still be worth less than the sum of them.

**The rule:** judge the whole page, never the section in isolation. Chasing "the
worst defect in this section" converges on zero small defects, never on a good
page. If a block does not earn its place next to its neighbours, remove it —
removing is a decision.

### One hop in the head

**The fault:** a screen that requires two chained deductions is a failed screen,
however handsome. The visitor makes the first hop and stops.

**The rule:** one hop, maximum, between what is shown and what it means. A test:
blur the screen until you cannot read it. If what remains does not say what the
section is for, the section is doing its work in the words alone.

---

## Motion

### The fly to the cart

**The fault:** an item is added and nothing visibly moves, so the buyer is not
sure it worked and checks the cart — which takes them out of the product page,
which is where the second purchase was going to happen.

**The rule:** the item flies to the cart. Around **0.7 s**, on an ease that
overshoots slightly at the start of its return (`back.in`, roughly 1.2). Long
enough to be read as a movement, short enough not to be waited for.

### Never animate a property that re-lays the page

**The fault:** animating a layout property frame by frame. On one document we
measured layout at **356 ms per frame** doing this, which the user reports as
"10 fps". Moving the same effect to `transform` took the same work to **0.5 ms**.

**The rule:** per-frame animation touches `transform` and `opacity` only. If you
need to measure it, measure `LayoutDuration`, not the frame callbacks — the
callbacks will look fine while the page is unusable.

---

## Type and image

### Never crush, condense or stretch a typeface

**The fault:** a squeezed headline is visible to everyone and attributable by
nobody. It reads as cheap.

**The rule:** no `font-stretch`, no `scaleX`, and no condensed cut standing in
for the regular one. If the headline does not fit, the headline is too long or
the size is wrong. Fix the text, not the letterforms.

### Never scale text with a transform

**The fault:** `transform: scale()` rasterises. The text is rendered at one size
and then stretched, so it ships visibly soft — and it is the kind of defect
people live with for months without naming it.

**The rule:** render at the final size. If a whole document must be scaled, use
`zoom`, which re-renders, rather than `transform`, which resamples. No 3D or
scale transform on anything containing type.

### A logo is never drawn by hand in the markup

**The fault:** a logo assembled from SVG shapes or CSS layers reads as a
diagram of a logo. It has no material, and it never sits right against a
photograph.

**The rule:** a logo is composed as an image, in the pixels. Not a stack of
vector primitives written by an agent.

### The second photographed state

**The fault:** a page can be cloned in an afternoon when every state of the
product is the same photograph under different CSS. The clone looks identical
because it *is* identical.

**The rule:** when an interaction reveals a different state of an object, it
reveals **a genuinely different photograph** of that object — a second shot, not
a filter on the first. It is the only difference in this category that a copyist
cannot reproduce without redoing the shoot.

This is also the honest ceiling of any skill like this one: the distance between
a correct page and a striking one is mostly photography, and no file of rules
ships that.

---

## What this file deliberately does not contain

The rules, not the library. We maintain a large set of built sections that
encode these laws, and they are not in this repository and will not be. A rule
you understand transfers to a product it was never written for; a block you
paste does not.

If you want the sections themselves, the audit that rejects a page unable to
take money, and the photography direction that goes with them, that is
[uxgen](https://www.uxgen.ai). What is here is free, complete on its own terms,
and enough to make the next page better.
