# The rules that are law, not taste

Four of the patterns in this kit are constrained by EU consumer law. A shop that
breaks them is not making a design mistake, it is making a refundable one. This
file is the reasoning an agent needs in order to refuse the pattern rather than
build it and add a comment.

This is a builder's summary of public texts, not legal advice. When a shop is
close to a line, the shop's own counsel decides.

---

## 1. Never pre-tick an add-on

**Article 22, Directive 2011/83/EU** (Consumer Rights Directive) requires the
trader to obtain the consumer's *express consent* to any payment in addition to
the main contractual obligation, and states that consent may not be inferred
from a default option the consumer has to reject in order to avoid the payment.
Where consent was inferred, the consumer is entitled to reimbursement.

What that means in code:

- An order bump checkbox starts unchecked. There is no configuration in which it
  starts checked.
- A tier that adds an item (insurance, warranty, express shipping, a sample) is
  not preselected. Preselecting a *quantity* tier is fine — it changes how much
  of the main product is bought, not what else is bought.
- "Recommended", "Most chosen" or a highlight border on a bump is allowed. A tick
  is not.

In `src/order-bump.tsx` the component owns its `checked` state and exposes only
`onToggle`. There is no `defaultChecked` prop, because a prop that exists gets
used.

## 2. Never invent the struck-through price

**Directive 98/6/EC** on price indication, as amended by **Directive (EU)
2019/2161** (the "Omnibus" directive), governs announcements of a price
reduction. The reference price shown next to a reduced price has to be a price
that was actually applied.

For quantity breaks this resolves to one arithmetic rule:

```
compareAtCents = unitPriceCents × units
```

The anchor on a three-pack is three times the real single-unit price. It is not
a number chosen to make the saving look good. If the single unit sells for
1900 cents, the three-pack anchor is 5700 and nothing else.

A tier at `units: 1` has `compareAtCents === totalCents`. There is no discount on
one unit, so there is no anchor to draw. Striking through a price equal to itself
is the tell of a generated storefront.

## 3. A badge is a statement of fact

"Most chosen", "Best seller", "Most popular" are claims about the shop's own
sales. Under the **Unfair Commercial Practices Directive (2005/29/EC)** a false
or deceptive statement about the product or the trader is an unfair practice.

Rules an agent can apply without asking:

- One badge per tier group, on one tier.
- If the merchant has no sales data, the honest badges are descriptive rather
  than social: "Best value per unit" is arithmetic and always checkable. "Most
  chosen" is a sales fact and needs a sale behind it.
- Never generate a review count, a star average, a "X people are viewing this"
  counter, or a countdown that resets on refresh. A fabricated countdown is the
  clearest example of a misleading practice in the whole category.

## 4. Shipping cost has to be knowable before checkout

**Article 6(1)(e) of 2011/83/EU** requires the total price inclusive of delivery
charges, or where those cannot reasonably be calculated in advance, the fact that
they may be payable.

The free-shipping bar is a good pattern precisely because it states the rule in
money: "$6.00 away from free shipping" tells the buyer the threshold and their
distance from it. A bar filled to 88% with no number tells them nothing and
substitutes a feeling for a disclosure.

The threshold must also be real. A bar that promises free shipping at $50 and a
checkout that charges shipping at $52 is the single fastest way to a chargeback.

---

## The short version, as a checklist

- [ ] No add-on checkbox can start checked.
- [ ] Every struck-through figure equals unit price × unit count.
- [ ] No tier at one unit shows a discount.
- [ ] Every badge is either arithmetic or backed by real sales.
- [ ] No fabricated scarcity, viewer counts, or resetting countdowns.
- [ ] The free-shipping threshold in the bar equals the one in the checkout.
