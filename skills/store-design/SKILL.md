---
name: store-design
description: Design and build a store, product page, landing page or checkout that sells — deciding which selling mechanics belong on THIS merchant's product rather than pasting a template. Reads the product (one item or a catalogue, impulse or considered, physical or digital, consumable or durable, variants, expiry) and deduces which sections to lay and in what order, each with its reason. Carries quantity breaks (a radio group of named tiers, never a quantity stepper), the free-shipping threshold bar, the order bump (never pre-ticked), the sticky mobile add-to-cart, email capture, the buy box order, and proof that is never fabricated. Use for any product page, landing page, cart, checkout, upsell, bundle, volume discount, tiered pricing, average order value or AOV work, for Shopify sections, and whenever a generated storefront looks fine but sells nothing. Carries the EU rules on pre-ticked add-ons (Article 22, Directive 2011/83/EU) and on struck-through prices.
license: MIT
metadata:
  version: "0.2.0"
  author: uxgen
  homepage: https://www.uxgen.ai
---

# Store design

A page that looks finished and takes no money is the normal outcome of
generating a storefront. Not because the design is bad — because nobody decided
**how the basket grows**, and the components that decide it are the ones a model
has read least about.

This skill is the deciding, not a template.

---

## Do this first

**Read `references/decision-table.md` before laying a single section.**

It is the centre of this skill. Seven questions about the merchant's product,
and from the answers: which mechanics belong on this page, which do not, and in
what order the sections go — each with the reason.

Applying a mechanic whose reason does not hold for this merchant is how a €900
chair ends up with a "buy 3 and save" tier list. The reasons are what make the
table usable on a product it has never seen.

## If you take one rule from this file

**Quantity breaks are a radio group of named tiers, never a number input.**

A stepper asks *how many* — arithmetic the buyer performs, with nothing
suggesting that two is a better idea than one. A radio group of named packages
asks *which one*, and one of them is visibly sensible. It is the most common
defect in a generated storefront, and it is one line of judgement to avoid.

## When to use this skill

- Any product page, landing page, cart, checkout, or Shopify section.
- The task mentions an upsell, a bundle, an order bump, a volume discount, a
  quantity break, tiered pricing, average order value or AOV.
- Someone says their store looks fine and does not sell.
- A page is being built for a merchant and nobody has decided how the basket
  grows.

## Audit an existing store first

```bash
node skills/store-design/scripts/audit-commerce.mjs ./src
```

Zero dependencies, reads only. It reports the defects this skill exists to
prevent — steppers where tiers belong, add-ons that can start ticked,
fabricated ratings and scarcity, struck-through prices not derived from the unit
price, countdowns that reset on refresh — each with a file, a line and the
reason. `--json` for machine output, `--strict` to fail a CI job.

Run it before proposing changes. It turns "your page could be better" into a
list with line numbers.

## The reference files

Load them as the task calls for them. Do not load all of them at once.

| File | Read it when |
|---|---|
| `references/decision-table.md` | **Always, first.** Which mechanics, which order, why |
| `references/design-laws.md` | Laying out any page — composition, colour, the AI tells |
| `references/quantity-breaks.md` | Building the tier list: tier maths, naming, anti-patterns |
| `references/buy-box.md` | Ordering the block that holds price, choice and button |
| `references/proof.md` | Reviews, ratings, credentials — and what to do with none |
| `references/email-capture.md` | Capturing an address without a modal at second zero |
| `references/eu-rules.md` | Before shipping anything with a discount or an add-on |

## Reference implementations

React, no dependencies, MIT. Read the file before writing your own — each one
carries its rules as code, with guardrails that throw in development rather than
shipping a defect silently.

| Component | File | The one rule |
|---|---|---|
| Quantity breaks | `src/quantity-breaks.tsx` | radio group of named tiers, never a stepper |
| Free-shipping bar | `src/free-shipping-bar.tsx` | show the remaining amount in currency |
| Order bump | `src/order-bump.tsx` | one item, never pre-ticked, never a gate |
| Sticky add-to-cart | `src/sticky-add-to-cart.tsx` | appears only once the inline button leaves view |

## The rules, condensed

**Quantity breaks.** Three tiers, four at most. Non-linear gaps (1 / 3 / 6, not
1 / 2 / 3). Name each tier in words the buyer can picture. Mark the middle one
and pre-select it — never the most expensive. Show the saving in currency, not
only a percentage. Show the unit price under the total. Bind the add-to-cart
label to the selection.

**Free-shipping bar.** The remaining amount in money, never a bare percentage or
an unlabelled bar. **Display only** — the threshold and the remainder come from
the same functions that charge shipping at checkout, never from a constant
retyped in a component, or the two copies drift and only one of them bills. Not
in an empty cart, not far below the threshold, never on a digital product.

**Order bump.** One named item, one price, one concrete reason, one unchecked
box, above the totals. Never a carousel. Never a screen that must be cleared to
continue. Priced well below the cart.

**Sticky add-to-cart.** Mobile only, below 768px. Appears when the inline button
scrolls out of view, never alongside it. Carries the selected total. Respects
`env(safe-area-inset-bottom)`. Not focusable while hidden.

**Proof.** Never generate a rating, a review count, a viewer counter or a
testimonial. Build the slot and leave it empty rather than fill it falsely.

## Two constraints that are law in the EU, not preferences

- **Never pre-tick an add-on.** [Article 22 of Directive 2011/83/EU](https://eur-lex.europa.eu/eli/dir/2011/83/oj)
  requires express consent to any payment beyond the main obligation, and makes
  a payment inferred from a default the consumer had to reject refundable.
  Several commercial upsell widgets ship pre-ticked as their factory default.
- **Never invent a struck-through price.** EU price-indication rules govern
  prior-price announcements. The compare-at figure must be the real single-unit
  price times the unit count.

A badge such as `Most chosen` must also be true. Claiming popularity for a tier
nobody picks is a false statement about the shop. Full reasoning in
`references/eu-rules.md`.

## What this skill does not do

It does not run experiments and does not promise a conversion lift. Below
roughly forty thousand sessions per variant an A/B test cannot separate a real
effect from noise, which is most stores. What these mechanics give you is the
removal of a known omission, which does not require a test to be worth doing.

It does not ship a component library. It teaches the decisions and the rules,
and gives four reference implementations to build against. The judgement is the
part that transfers; a pasted component is the part that does not.

## Why this exists

Asked on 25 August 2026 for a React component for "buy 2, save 15%", ChatGPT
returned a quantity stepper and cited no source at all; Perplexity returned a
stepper with `min`, `max` and `step`. Both failed the same way, because no
canonical spec for these components exists on the open web — `tiered pricing
component` returns results about pricing tables, and `bundle quantity selector
component react` returns results about JavaScript bundle size.

This skill is that spec.

Built by [uxgen](https://www.uxgen.ai). MIT.
