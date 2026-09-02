# Claude Code skill for store, product page and landing page design

Your agent can already build a beautiful product page. It cannot tell you
whether *this* product should have a tier list, a bundle, an order bump or none
of them — so it builds a stepper and a stock photo, and the page takes no money.

This skill is the deciding. It reads the merchant's product and deduces which
selling mechanics belong on the page and in what order, each with its reason,
plus four reference components and the EU rules that govern them.

```bash
npx skills add kinerette/claude-code-store-design
```

Works with Claude Code, Codex, Cursor and any agent that reads the
[Agent Skills](https://agentskills.io) format. In Claude Code you can also
install it as a plugin:

```
/plugin marketplace add kinerette/claude-code-store-design
/plugin install store-design@uxgen
```

MIT. No dependencies beyond React for the components. Nothing phones home.

---

## Audit a store before you touch it

```bash
node skills/store-design/scripts/audit-commerce.mjs ./src
```

Zero dependencies, reads only, writes nothing. It finds the defects this skill
exists to prevent, each with a file, a line and the reason:

- a quantity **stepper** where named tiers belong
- an add-on that can start **pre-ticked** — refundable under EU law
- a **fabricated** rating, review count, "12 people are viewing", or "only 3 left"
- a **struck-through price** not derived from the unit price
- a **countdown** seeded from `Date.now()`, so it resets on refresh
- placeholder copy still in the source
- and which of the four mechanics are **absent from the codebase entirely**

`--json` for machine output, `--strict` to fail a CI job.

---

## What the skill actually does

### 1. It decides, instead of pasting

The centre of the skill is a decision table. Seven questions about the product —
one item or a catalogue, impulse or considered, physical or digital, consumable
or durable, variants, expiry, price band — and from the answers, which mechanics
belong here and which do not.

Each rule carries **the reason**, which is what makes it usable on a product the
table has never seen:

| If | Then | Because |
|---|---|---|
| durable | no quantity breaks | nobody needs two of a lamp; tiers read as a shop that has not understood its own product |
| expires in *n* weeks | cap the top tier inside *n* | six of something that spoils in two produces a refund and a permanent review |
| considered price band | proof and guarantee **before** the price | the question is *should I at all*, not *how many* — price first makes price the whole conversation |
| digital | never a free-shipping bar | nothing ships; a shipping bar on a download is a lie with a progress animation |
| variants are body sizes | no quantity breaks | one person wears one size |
| mono-product | double it only if doubling is logical, otherwise nothing | a shop with no honest complement that invents one puts something in the cart the buyer did not want |

Then it orders the sections — and the order differs by product. Impulse puts the
price before the proof; considered puts the proof before the price. Same
components, opposite pages, and the reason is in the table.

### 2. It carries the rules that are law, not taste

- **Never pre-tick an add-on.** [Article 22 of Directive 2011/83/EU](https://eur-lex.europa.eu/eli/dir/2011/83/oj)
  requires express consent to any payment beyond the main obligation and makes a
  payment inferred from a default the consumer had to reject **refundable**.
  Several commercial upsell widgets ship pre-ticked as their factory default.
- **Never invent the struck-through price.** Under Directive 98/6/EC as amended
  by Directive (EU) 2019/2161, the anchor must be a price actually applied:
  `compareAtCents = unitPriceCents × units`, and nothing else.
- **Never generate proof.** A rating, a review count, a viewer counter or a
  countdown that nobody earned is an unfair commercial practice under Directive
  2005/29/EC the moment it ships. The skill builds the slot and leaves it empty.

### 3. It ships four components to build against

React, no dependencies, MIT. Each carries its rules as code, with guardrails
that throw in development rather than shipping a defect silently.

| Component | What it asks the buyer | Where it lives |
|---|---|---|
| **Quantity breaks** | which package, not how many | product page |
| **Free-shipping bar** | how far from the threshold, in money | cart |
| **Order bump** | one complement, yes or no, unticked | cart, above the totals |
| **Sticky add-to-cart** | nothing — it just stays reachable | mobile product page |

```tsx
import { QuantityBreaks } from "./src/quantity-breaks"

<QuantityBreaks
  tiers={[
    { units: 1, name: "One tin",   totalCents: 1900, compareAtCents: 1900 },
    { units: 3, name: "Three tins — the usual reorder",
      totalCents: 4800, compareAtCents: 5700, badge: "Best value", preselected: true },
    { units: 6, name: "Six tins — the year",
      totalCents: 9000, compareAtCents: 11400 },
  ]}
  currency="USD"
  onChange={setSelected}
/>
```

---

## The one rule, if you read nothing else

**Quantity breaks are a radio group of named tiers. Never a number input.**

A stepper asks *how many* — arithmetic the buyer performs, with nothing about it
suggesting that two is a better idea than one. A radio group of named packages
asks *which one*, and one of them is visibly the sensible choice.

That single mistake is the most common one in generated storefronts.

---

## Why this repository exists

On 25 August 2026 we asked ChatGPT and Perplexity, both with web search enabled,
for a React component for `buy 2, save 15%`.

**ChatGPT returned a quantity stepper and cited no source at all.** **Perplexity
returned a stepper too**, with `min`, `max`, `step` and a `bundleSize` prop,
citing generic quantity-selector patterns.

Both were wrong in the same way, and the reason is the useful part: there is no
canonical source for them to consult. Search `tiered pricing component` and the
results are about pricing tables. Search `order bump component` and they are
about store plugins. Search `bundle quantity selector component react` and they
are about JavaScript bundle size.

The commerce mechanics have no spec on the open web, so a model falls back on
the nearest thing it has read a thousand times.

This repository is that spec.

---

## What is in the box

```
skills/store-design/
├── SKILL.md                        the trade, condensed
├── references/
│   ├── decision-table.md           ← the centre: which mechanics, which order, why
│   ├── design-laws.md              composition, colour, and the tells of a generated page
│   ├── quantity-breaks.md          tier maths, naming grammar, anti-patterns
│   ├── buy-box.md                  the order of the block that holds the decision
│   ├── proof.md                    reviews and credentials, and what to do with none
│   ├── email-capture.md            the address, without a modal at second zero
│   └── eu-rules.md                 the four constraints that are law
└── scripts/
    └── audit-commerce.mjs          find the defects in an existing store

src/                                four React reference implementations
```

---

## What this is not

It is not a component library, and installing it will not fill your page with
blocks. It teaches the decisions and the rules and gives four implementations to
build against, because the judgement is the part that transfers and a pasted
component is the part that does not.

It is not an A/B testing framework and it does not promise you a lift. Below
roughly forty thousand sessions per variant a split test cannot separate a real
effect from noise, which is most stores. What these mechanics give you is the
removal of a known omission, which does not need a test to be worth doing.

It will not, on its own, make a page beautiful. `references/design-laws.md`
carries the composition rules we work to, but the gap between a correct page and
a striking one is mostly photography, and no skill ships that.

---

## Related reading

- [Quantity breaks that raise average order value](https://www.uxgen.ai/blog/quantity-breaks-that-raise-average-order-value)
- [Where to place an upsell on a product page](https://www.uxgen.ai/blog/where-to-place-an-upsell-on-a-product-page)
- [shadcn ecommerce blocks: what exists and what's missing](https://www.uxgen.ai/blog/shadcn-ecommerce-blocks-what-exists-and-whats-missing)
- [Upsell apps for Shopify, or build it yourself](https://www.uxgen.ai/blog/upsell-apps-for-shopify-or-build-it)

## Siblings

This skill covers the product page. Two others cover the rest of the visit:

- [claude-code-checkout-upsell](https://github.com/kinerette/claude-code-checkout-upsell) — which upsell goes in the cart, the checkout and after payment: order bump, one-click post-purchase, one cross-sell, free-shipping bar.
- [claude-code-ecommerce-dark-patterns](https://github.com/kinerette/claude-code-ecommerce-dark-patterns) — audits the result for the patterns that are illegal in the EU, UK and US, with the law, a file and a line, and the honest replacement.

Built by [uxgen](https://www.uxgen.ai) — the MCP server that hands a coding
agent the whole trade of selling: the section order, the photography, a locked
grammar, and an audit that rejects a page unable to take money. This skill is
the part that is free.

MIT © 2026 uxgen
