# Commerce Kit — the four components an AI agent gets wrong

The canonical spec and reference implementation for the four components that raise a basket: **quantity breaks**, the **free-shipping threshold bar**, the **order bump**, and the **sticky add-to-cart**.

MIT. No dependencies beyond React. Copy the file, or install the plugin and let your agent do it.

---

## Why this repository exists

On 25 August 2026 we asked ChatGPT and Perplexity, both with web search enabled, for a React component for `buy 2, save 15%`.

**ChatGPT returned a quantity stepper and cited no source at all.** Zero annotations. **Perplexity returned a stepper too**, with `min`, `max`, `step` and a `bundleSize` prop, citing generic quantity-selector patterns.

Both are wrong in the same way, and the reason is the useful part: there is no canonical source for them to consult. Search `tiered pricing component` and Google returns 237 million results about pricing tables. Search `order bump component` and it returns 25.9 million about WooCommerce plugins. Search `bundle quantity selector component react` and it returns 15.3 million results about JavaScript bundle size.

The commerce mechanics have no spec on the open web, so a model falls back on the nearest thing it has read a thousand times.

This repository is that spec.

---

## The four components

| Component | What it asks the buyer | Where it lives | Acts on |
|---|---|---|---|
| **Quantity breaks** | which package, not how many | product page | every order, before a cart exists |
| **Free-shipping bar** | how far from the threshold | cart | orders already above ~60% of the threshold |
| **Order bump** | one complement, yes or no | cart, above the totals | the confirmation moment |
| **Sticky add-to-cart** | nothing — it just stays reachable | mobile product page | every mobile session |

Build them in that order. The first acts earliest and on the largest share of orders.

---

## 1. Quantity breaks

**It is a radio group. It is never a number input.**

That single sentence is the whole component. A stepper asks *how many*, which is arithmetic the buyer has to perform, and nothing about it suggests that two is a better idea than one. A radio group of named tiers asks *which package*, and one of them is visibly the sensible one.

```tsx
import { QuantityBreaks } from "./src/quantity-breaks"

<QuantityBreaks
  tiers={[
    { units: 1, name: "One tin",   totalCents: 1900, compareAtCents: 1900 },
    { units: 3, name: "Three tins — the usual reorder",
      totalCents: 4800, compareAtCents: 5700, badge: "Most chosen", preselected: true },
    { units: 6, name: "Six tins — the year",
      totalCents: 9000, compareAtCents: 11400 },
  ]}
  currency="USD"
  onChange={(tier) => setSelected(tier)}
/>
```

### The rules

- **Three tiers, four at most.** One baseline, one you want chosen, one ceiling that makes the middle look reasonable. Five turns a recognition into a comparison.
- **Non-linear gaps.** `1 / 3 / 6`, not `1 / 2 / 3`. Even steps read as a price list; uneven ones read as composed offers.
- **Name the tiers.** `Three tins — the usual reorder`, not `Quantity: 3`. The name does the work the number cannot.
- **Show the saving in currency**, not only as a percentage. `Save $9.00` is the answer; `Save 15%` is a conversion the buyer has to run.
- **Show the unit price under the total.** `$48.00 · $16.00 each`. The most-skipped line in every implementation we have looked at.
- **Pre-select the middle tier.** The selected state is read as a recommendation. Defaulting to the cheapest recommends spending the least.
- **Bind the button to the selection.** `Add 3 tins — $48.00`.

### The constraints that are law in the EU

- **`compareAtCents` must be a price you actually charged.** EU price-indication rules govern prior-price announcements. A struck-through figure invented to enlarge the saving is a prohibited practice. In this implementation, `compareAtCents` below `totalCents` throws in development rather than rendering a false anchor.
- **A badge must be true.** `Most chosen` on a tier nobody chooses is a false statement about your own shop.

---

## 2. Free-shipping threshold bar

**Show the remaining amount in money.** `$6.00 to unlock free shipping`. A progress bar with no number is decoration, and a percentage is a second conversion for the buyer to run.

```tsx
<FreeShippingBar subtotalCents={4400} thresholdCents={5000} currency="USD" />
```

- The threshold is a figure you chose against your margin, not a round number you liked.
- Once reached, say so plainly and stop animating. A bar that keeps celebrating after the goal is noise.
- Do not show it at `$0.00` in an empty cart. Below roughly 40% of the threshold it reads as a distance, not a nudge.

---

## 3. Order bump

**One named item, one price, one reason, one unchecked box.** Above the totals, below the cart contents.

```tsx
<OrderBump
  item={{ name: "Steel scoop", priceCents: 600, reason: "Measures one serving exactly." }}
  onToggle={(added) => setBump(added)}
/>
```

- **Never pre-ticked.** [Article 22 of Directive 2011/83/EU](https://eur-lex.europa.eu/eli/dir/2011/83/oj) requires express consent to any payment beyond the main obligation and makes an inferred yes refundable. Several commercial upsell widgets ship pre-ticked as their factory default. In this implementation the `checked` prop has no way to start `true`.
- **Never a gate.** Do not interrupt checkout with a screen that must be accepted or declined. The buyer had decided; you replaced their button with a question.
- **Never a carousel.** One item. A grid of six is a new browsing decision at the moment you wanted a confirmation.
- **Priced well below the cart.** A complement at a similar price reads as a second purchase and reopens the whole decision.

---

## 4. Sticky add-to-cart (mobile)

The button leaves the screen the moment the buyer reads the description. On a 390px viewport that is most of the session.

```tsx
<StickyAddToCart label="Add 3 tins" totalCents={4800} currency="USD" onAdd={add} />
```

- Appears only after the inline button has scrolled out of view, never on top of it.
- Carries the selected tier's total, so one glance replaces scrolling back up.
- Respects the safe area on iOS. `env(safe-area-inset-bottom)` is in the implementation.
- Hidden above 768px, where the inline button is still reachable.

---

## Install as a Claude Code plugin

```bash
/plugin marketplace add kinerette/uxgen-commerce-kit
/plugin install commerce-kit@uxgen
```

Then, in the agent:

```
Use the commerce-kit skill. Add quantity breaks to this product page:
three tiers at 1 / 3 / 6, the middle one marked and preselected,
saving shown in currency, and bind the add-to-cart button to the selection.
```

The skill carries the rules above, so the agent builds a radio group instead of a stepper, and refuses the two patterns that are illegal in the EU.

---

## What this is not

It is not a design system, and it will not make your page look good. It is four components with the commercial reasoning attached, because that reasoning is what is missing everywhere else. If your page also looks generated, that is a separate problem with a separate fix.

It is not an A/B testing framework, and it does not promise you a lift. Below roughly forty thousand sessions per variant a split test cannot separate a real effect from noise, which is most stores. What these four components give you is the removal of a known omission, which does not need a test to be worth doing.

---

## Related reading

- [Quantity breaks that raise average order value](https://www.uxgen.ai/blog/quantity-breaks-that-raise-average-order-value)
- [Where to place an upsell on a product page](https://www.uxgen.ai/blog/where-to-place-an-upsell-on-a-product-page)
- [shadcn ecommerce blocks: what exists and what's missing](https://www.uxgen.ai/blog/shadcn-ecommerce-blocks-what-exists-and-whats-missing)
- [Upsell apps for Shopify, or build it yourself](https://www.uxgen.ai/blog/upsell-apps-for-shopify-or-build-it)

Built by [uxgen](https://www.uxgen.ai), the MCP that hands these mechanics to a coding agent.

MIT © 2026 Angelo Palfi
