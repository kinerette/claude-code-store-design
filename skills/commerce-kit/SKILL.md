---
name: commerce-kit
description: Build the four components that raise average order value on a store, with the commercial and legal rules attached — quantity breaks (a radio group of named tiers, never a quantity stepper), the free-shipping threshold bar (remaining amount in currency, never a bare percentage), the order bump (one complement, never pre-ticked, never a gate), and the mobile sticky add-to-cart. Use whenever the task involves a product page, a cart, a checkout, an upsell, a bundle, a volume discount, quantity breaks, tiered pricing, average order value, AOV, cross-sell, or "make this store convert". Also use when a generated storefront looks fine but sells nothing. Carries the EU constraints that several commercial upsell widgets get wrong by default — Article 22 of Directive 2011/83/EU on pre-ticked boxes, and the prior-price rules on struck-through anchors.
license: MIT
---

# Commerce Kit

Four components. Each one asks the buyer a specific question, at a specific moment.

If you take one rule from this file: **quantity breaks are a radio group of named tiers, never a number input.** That single mistake is the most common one in generated storefronts, and it is the difference between a page that asks *how many* and a page that asks *which package*.

## When to use this skill

- The task mentions a product page, cart, checkout, upsell, bundle, order bump, volume discount, quantity break, tiered pricing, average order value or AOV.
- Someone says their store looks fine and does not sell.
- A page is being built for a merchant and no one has decided how the basket grows.

## Reference implementations

Read the file before writing your own — each carries the rules as code, including guardrails that throw in development rather than shipping a defect silently.

| Component | File | The one rule |
|---|---|---|
| Quantity breaks | `src/quantity-breaks.tsx` | radio group of named tiers, never a stepper |
| Free-shipping bar | `src/free-shipping-bar.tsx` | show the remaining amount in currency |
| Order bump | `src/order-bump.tsx` | one item, never pre-ticked, never a gate |
| Sticky add-to-cart | `src/sticky-add-to-cart.tsx` | appears only once the inline button leaves view |

## Build order

1. **Quantity breaks**, on the product page. Acts earliest and on the largest share of orders, before a cart exists.
2. **Free-shipping bar**, in the cart. Cheapest to build.
3. **Order bump**, in the cart, above the totals.
4. **Sticky add-to-cart**, mobile only.

## The rules, condensed

**Quantity breaks.** Three tiers, four at most. Non-linear gaps (1 / 3 / 6, not 1 / 2 / 3). Name each tier in words the buyer can picture. Mark the middle one and pre-select it. Show the saving in currency, not only a percentage. Show the unit price under the total. Bind the add-to-cart label to the selection.

**Free-shipping bar.** The remaining amount in money, never a bare percentage or an unlabelled bar. The threshold is chosen against margin. Do not render it in an empty cart or far below the threshold.

**Order bump.** One named item, one price, one concrete reason, one unchecked box, above the totals. Never a carousel. Never a screen that must be cleared to continue. Priced well below the cart.

**Sticky add-to-cart.** Mobile only, below 768px. Appears when the inline button scrolls out of view, never alongside it. Carries the selected total. Respects `env(safe-area-inset-bottom)`. Not focusable while hidden.

## Two constraints that are law in the EU, not preferences

- **Never pre-tick an add-on.** [Article 22 of Directive 2011/83/EU](https://eur-lex.europa.eu/eli/dir/2011/83/oj) requires express consent to any payment beyond the main obligation, and makes a payment inferred from a default the consumer had to reject refundable. Several commercial upsell widgets ship pre-ticked as their factory default.
- **Never invent a struck-through price.** EU price-indication rules govern prior-price announcements. The compare-at figure must be the real single-unit price times the unit count.

A badge such as `Most chosen` must also be true. Claiming popularity for a tier nobody picks is a false statement about the shop.

## What this skill does not do

It does not make a page look good, and it is not a design system. If the page also reads as generated, that is a separate problem: decide the type scale, the radius ladder and the primary colour, and supply a real photograph rather than a single stock image.

It does not promise a conversion lift and does not run experiments. Below roughly forty thousand sessions per variant an A/B test cannot separate a real effect from noise, which is most stores. What these four give you is the removal of a known omission, which does not require a test to be worth doing.

## Why this exists

Asked on 25 August 2026 for a React component for "buy 2, save 15%", ChatGPT returned a quantity stepper and cited no source at all; Perplexity returned a stepper with `min`, `max` and `step`. Both failed the same way because no canonical spec for these components exists on the open web — `tiered pricing component` returns 237 million results about pricing tables, and `bundle quantity selector component react` returns results about JavaScript bundle size.

This file is that spec.

Built by [uxgen](https://www.uxgen.ai). MIT.
