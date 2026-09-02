# The decision table

**This is the centre of the skill.** Everything else is detail.

You are not copying a template. You are reading *this merchant's* product and
deducing which mechanics belong on the page and in what order. A mechanic that
is right for a €9 consumable is wrong for a €900 durable, and a page that
carries all of them carries most of them wrongly.

So: answer seven questions about the product first, then lay the sections.

Each rule below carries **the reason**. Apply a rule whose reason does not hold
for this merchant and you have copied a shape instead of making a decision.

---

## Step 1 — Read the product

Ask the user only what you cannot infer from the code or the brief.

| # | Question | Values |
|---|---|---|
| 1 | How many products are for sale? | one · a few (2–20) · many (20+) |
| 2 | Where does the price sit for this category? | impulse · ordinary · considered |
| 3 | Is the purchase decided in seconds or researched? | impulse · considered |
| 4 | Physical or digital? | physical · digital |
| 5 | One version, or variants the buyer must choose? | single · variants |
| 6 | Consumed and rebought, or bought once? | consumable · durable |
| 7 | Does it expire? | no · yes, in *n* weeks |

Seven answers. Everything below reads from them.

---

## Step 2 — Which mechanics, and why

### Quantity breaks

| If | Then | Because |
|---|---|---|
| consumable **and** single version | **Build them.** The strongest single mechanic. | Reordering is certain, so buying ahead costs the buyer nothing they were not going to spend. |
| durable | **Do not.** Offer a complement instead. | Nobody needs two of a lamp. Tiers on a durable read as a shop that has not understood its own product. |
| variants are body sizes (clothing, shoes) | **Do not.** | One person wears one size. The tier list would be asking them to buy three of the same shoe. |
| variants are flavours, colours, scents | **Build them, as a mixed pack.** "Three — pick your three" | The variety *is* the reason to take three. A single-flavour six-pack is a bigger commitment than a first-time buyer will make. |
| expires in *n* weeks | **Cap the top tier at what fits inside *n*.** | Selling six of something that spoils in two months produces a refund and a review, and the review is permanent. |
| considered price band | **Do not.** Offer instalments, a guarantee, a comparison. | At a considered price the question is *should I at all*, not *how many*. A tier list answers a question nobody asked. |
| impulse price band | **Build them, with a wide top tier.** | The absolute spend stays small, so the third tier is an easy yes. |
| digital | **Usually not** — use editions or seats instead. | "Three copies" of a file is meaningless. Seats, or a tier with more in it, is the same mechanic honestly translated. |

### Free-shipping bar

| If | Then | Because |
|---|---|---|
| physical **and** shipping is charged | **Build it.** | It acts on every order already near the threshold, and it is the cheapest of the four to build. |
| digital | **Never.** | Nothing ships. A shipping bar on a download is a lie with a progress animation. |
| shipping is always free | **Never a bar.** Say it once, as a fact, in the reassurance strip. | A bar implies a threshold. No threshold, no bar. |
| single product, one price point | **Only if a tier can cross the threshold.** | If no achievable basket reaches the threshold, the bar is a permanent reminder that the buyer is falling short. |

### Order bump

| If | Then | Because |
|---|---|---|
| a few or many products | **Build it.** One complement, above the totals, unticked. | The catalogue already contains the complement; the confirmation moment is when it is easiest to accept. |
| mono-product | **Only if a genuine complement exists.** | A shop with one product and no accessory has nothing honest to bump. Inventing one is how a scoop, a pouch or a "protection plan" nobody wants ends up in the cart. |
| digital | **Build it — this is where it is strongest.** | Marginal cost is zero, so the complement can be priced low enough to be an easy yes. |
| considered price band | **Do not.** | The buyer is completing a decision that took days. A new question at that moment reopens it. |

Whatever the case: **never pre-ticked**, and never a gate. See `eu-rules.md`.

### Sticky mobile add-to-cart

| If | Then | Because |
|---|---|---|
| any physical or digital product page | **Build it.** | On a 390px viewport the inline button leaves the screen the moment the buyer reads the description, which is most of the session. |
| the page is one screen with no description | **Do not.** | The button never left. A second one competing with the first is noise. |

### Email capture

| If | Then | Because |
|---|---|---|
| considered purchase | **Build it, mid-page.** | The buyer will leave to think and needs a way back. This is the mechanic that recovers the considered sale. |
| impulse purchase | **After the order only.** | Anything that delays a decision made in seconds costs more than the address is worth. |
| ever out of stock | **Build the restock capture.** | The highest-intent address a shop can collect, and almost nobody builds it. See `email-capture.md`. |

### The chained complement

When the goal is stated as *raise the basket* rather than *raise conversion*, and
the catalogue has real complements:

Offer the complement with a **real** discount — the house figure is −15% — and
let it chain: each complement added keeps the rate. A basket that starts at one
item and ends at three has doubled without a single price being invented.

Two conditions, and both are load-bearing:

- **The discount must actually apply at checkout.** A displayed −15% that the
  cart does not honour is the fastest chargeback in commerce, and it is the
  one defect a buyer always notices.
- **The complement must complete the first item**, not compete with it. Priced
  well below the cart. A complement at a similar price reads as a second
  purchase and reopens the whole decision.

### Doubling a mono-product

The house rule, stated as it was decided: **double it only if doubling is
logical. Otherwise, nothing.**

Logical: a consumable, a thing that runs out, a thing given away, a thing kept
in two places. Not logical: a single durable object, a made-to-measure item, a
thing whose second copy has no use. When it is not logical, the page carries no
tier list at all — and that is the correct page, not a page missing a section.

---

## Step 3 — The order of the sections

The order is not a matter of taste. It follows from question 3.

### Impulse — price before proof

```
1  Hero: the product, photographed, one line of claim
2  Price + quantity breaks + add to cart      ← the decision, above the fold
3  Reassurance strip (delivery · returns · payment)
4  Three reasons, short
5  Proof
6  FAQ — only the objections that actually block
7  Second add to cart
```

**Because** the decision takes seconds and the buyer has already decided they
want the *kind* of thing. Proof placed before the price delays a decision that
was not in doubt. What they need is the price, the choice, and the button.

### Considered — proof before price

```
1  Hero: the problem, then the product
2  Proof, compressed: one credential or one rating
3  How it works — the mechanism, in three steps
4  The comparison: this versus what they do today
5  The guarantee, stated concretely
6  Price + the choice + add to cart
7  Email capture — they will leave to think
8  FAQ — the real objections, answered at length
9  Second add to cart
```

**Because** at a considered price the buyer is not asking *how many*, they are
asking *is this real and will I regret it*. Putting the price before the answer
makes the price the whole conversation, and the price always loses that
conversation.

### The rule underneath both

**Nothing between the choice and the button.** Every element inserted there is a
new thought at the moment the buyer had stopped thinking — including a trust
badge row, which costs more than it reassures.

---

## Step 4 — Check the deduction

Before laying anything, state the seven answers back and name the mechanics you
are and are not building, **with the reason for each omission**.

> Consumable, single version, impulse band, physical, no expiry, mono-product.
> Building: quantity breaks 1/3/6, free-shipping bar, sticky mobile bar.
> Not building: order bump — there is no honest complement in a one-product
> shop, and inventing one puts something in the cart the buyer did not want.

A named omission is a decision. An unnamed one is a gap.

---

## Worked examples

**A single coffee, €14, bought again every month.**
Consumable · single · impulse · physical · no variants · expires ~6 months.
→ Quantity breaks 1/3/6, capped at 6 by the roast date. Free-shipping bar.
Sticky bar. No order bump — nothing else is sold. Impulse order: price first.

**A €680 chair, one model, three fabrics.**
Durable · variants · considered · physical.
→ No quantity breaks: nobody buys three chairs of the same fabric. Fabric
swatches own the choice slot. Proof, guarantee and the comparison before the
price. Email capture mid-page — this sale completes on the third visit.
Instalments beside the price. Sticky bar carries the selected fabric.

**A €29 download, sold with a €9 template pack.**
Digital · single · impulse.
→ No shipping bar: nothing ships. Order bump on the template pack — marginal
cost zero, so it can be cheap enough to be an easy yes, and it must start
unticked. No quantity breaks: three copies of a file mean nothing. Sticky bar
yes; the page is long.

**A skincare range, 14 products, €20–€45.**
Consumable · many · ordinary · physical.
→ Quantity breaks on the repeat-buy items only, not the whole catalogue. Order
bump in the cart on the complement to whatever is already in it. Free-shipping
bar — with 14 products a second item is reachable. Chained complement at a real
−15%. The collection page matters as much as the product page here.
