# The buy box

The buy box is the region a buyer's eye lands in once it has finished with the
photograph: the block holding the name, the price, the choice, the button and
the reassurance. It is not a component, it is an **order**. Getting that order
wrong is the most common reason a page that "looks fine" does not sell.

There is no `buy-box.tsx` in this kit, because a buy box is composed from the
four components plus the page's own markup. This file is the composition.

---

## The order, top to bottom

1. **Name.** One line. The product, not a slogan.
2. **One-line claim.** What it does, in the buyer's words. Skip it if the name
   already says it.
3. **Proof, compressed.** One line — a rating, a count, or a single credential.
   Not a testimonial. See `references/proof.md`.
4. **Price.** The price of the current selection, large. It changes when the
   selection changes.
5. **Quantity breaks.** The choice. See `references/quantity-breaks.md`.
6. **Add to cart.** One button, full width, carrying the selection in its label.
7. **Reassurance strip.** Three short facts under the button: delivery, returns,
   payment. Text, not a row of unlabelled badge images.
8. **Everything else.** Description, specification, shipping detail, FAQ —
   below, in that order.

The rule underneath the order: **nothing between the choice and the button.**
Anything inserted there is a new thought at the moment the buyer had stopped
thinking. A trust-badge row placed between the tiers and the button costs more
than it reassures.

## The single-column rule on mobile

At 390px the buy box is one column with the photograph above it. Decide that
order first and let the desktop layout be the variation. A two-column desktop
layout that collapses in an order nobody chose is how the choice ends up below
the fold.

## Price behaviour

The large price is the **total of the selected package**, not the unit price.
The unit price lives small, inside the selected tier row. A buy box showing
"$16.00" large while the button says "Add 3 — $48.00" makes the buyer check the
arithmetic at exactly the moment you wanted them to click.

When a tier is selected, three things update together: the large price, the
button label, and the sticky bar total. Drive all three from one piece of state.

## The button

- One primary button. A secondary "Buy now" beside it splits the decision.
- Full width within the buy box column.
- The label carries the selection: "Add 3 tins — $48.00".
- Never disabled without a visible reason beside it. A greyed button with no
  explanation is a dead end.
- Out of stock replaces the button with a dated statement and an email field —
  see `references/email-capture.md` — not with a greyed button.

## The reassurance strip

Three facts, as text, small, directly under the button:

```
Ships in 24 h  ·  30-day returns  ·  Secure payment
```

What makes this work is that each item is specific and checkable. "Fast
shipping" is not a fact; "Ships in 24 h" is. One line of type reassures more
than a row of unlabelled padlock and credit-card images, which is the second
most reliable tell of a generated storefront after the stepper.

## What does not belong in the buy box

- A countdown, unless it is tied to a real dated event.
- A viewer counter.
- A carousel of related products.
- More than one badge.
- A newsletter signup. It competes with the purchase; it belongs after it.
- Long-form copy. The buy box is the decision. The description is the research.

## Composing it from this kit

```tsx
<section className="buy-box">
  <h1>{product.name}</h1>
  <p className="claim">{product.claim}</p>
  <ProofLine rating={product.rating} count={product.reviewCount} />

  <p className="price">{format(selected.totalCents)}</p>

  <QuantityBreaks tiers={tiers} currency="USD" onChange={setSelected} />

  <button className="add" onClick={() => add(selected)}>
    Add {selected.units} — {format(selected.totalCents)}
  </button>

  <p className="reassurance">Ships in 24 h · 30-day returns · Secure payment</p>
</section>

<StickyAddToCart
  label={`Add ${selected.units}`}
  totalCents={selected.totalCents}
  currency="USD"
  onAdd={() => add(selected)}
/>
```

One `selected` state feeds the price, the button and the sticky bar. That is the
whole integration.
