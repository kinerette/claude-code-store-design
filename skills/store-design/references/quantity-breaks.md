# Quantity breaks, in full

The component that acts earliest and on the largest share of orders. Everything
below is what `src/quantity-breaks.tsx` encodes, written out so an agent can
build the same thing in a framework the file does not cover.

---

## The one rule

**It is a radio group of named packages. It is never a number input.**

A stepper asks *how many?* — arithmetic the buyer has to perform, with no signal
that two is a better idea than one. A radio group asks *which package?* — a
choice between prepared options, one of which is visibly sensible. The buyer's
work drops from "compute" to "pick", and the default is already the middle one.

Everything else in this file is detail. This is the component.

## Choosing the tiers

**Three tiers. Four at most.** A fourth is worth it only when the product has a
genuine "stock up" buyer. Five is a pricing table, and a pricing table is a
different, slower decision.

**Non-linear gaps.** 1 / 3 / 6, not 1 / 2 / 3. Consecutive integers read as a
stepper wearing a costume, and the middle option stops being a package. The jump
has to be big enough that the tier is a different decision, not one more unit.

Common shapes that work:

| Product life | Tiers | Why |
|---|---|---|
| Consumed weekly | 1 / 3 / 6 | one, a season, a year |
| Consumed daily | 1 / 2 / 4 | one month, two, the half-year |
| Given away | 1 / 3 / 5 | self, plus two gifts |
| Bought once | do not use quantity breaks | offer a complement instead |

**Discount ladder.** Roughly 10–18% at the middle tier, 18–28% at the top. Below
10% the saving is not worth the extra spend. Above roughly 30% the buyer starts
asking what the single unit is really worth, and the anchor loses its force.

The last tier must be visibly cheaper per unit than the middle one. If the
per-unit price is flat between the top two, the top tier is decoration.

## Naming the tiers

A tier called "3 units" has been given a number the buyer already had. A tier
called "Three tins — the usual reorder" has been given a picture of themselves.

The grammar that works: **quantity in words, then the life it covers.**

- "One tin" / "Three tins — the usual reorder" / "Six tins — the year"
- "One bottle" / "Two bottles — the full course" / "Four bottles — share it"
- "Single" / "The pair — one for the bag" / "The set of four"

The grammar that does not: "Starter / Pro / Enterprise" on a physical good,
"Bundle A / B / C", "Save 15%" used as the name (the saving is a field, not a
name), or any name that repeats the number already shown in the price row.

## What each row must show

In this order, within the row:

1. The radio control, real and focusable.
2. The tier name.
3. The badge, on one tier only, if it is true.
4. The total for the package.
5. The struck-through anchor, when there is a real one.
6. The saving **in currency**, then optionally the percentage.
7. The unit price, small, underneath. "$16.00 each" is what makes the
   comparison possible without arithmetic.

The saving in money is the number that moves people. "Save 15%" requires a
multiplication; "Save $9.00" does not. Show money first, percentage second or
not at all.

## The middle tier

Mark exactly one tier and preselect it, and make it the middle one. This is not
a trick: a buyer who has decided to buy still has to decide how much, and a shop
that has an opinion is more useful than one that does not.

Preselecting the *most expensive* tier is where this turns manipulative. The
middle tier is a recommendation. The top tier preselected is a decision taken on
the buyer's behalf, and returns follow it.

The badge on that tier must obey `references/eu-rules.md` — "Best value per
unit" is arithmetic, "Most chosen" is a claim about sales.

## Binding the button

The add-to-cart label carries the selection: "Add 3 tins — $48.00". Two reasons.
The buyer confirms what they picked without scrolling back, and the button stops
being a generic verb.

When the selection changes, the sticky mobile bar's total changes with it. If
those two ever disagree, the buyer trusts neither.

## Accessibility, in the terms that matter here

- A real `<input type="radio">` per tier, in one `<fieldset>` with a `<legend>`.
  Arrow keys move between tiers because the browser does it, not because of a
  key handler you wrote.
- The whole row is the label. A buyer on a phone aims at a card, not at a 20px
  circle.
- The saving and the unit price sit inside the label, so a screen reader
  announces the tier's full economics in one utterance.
- Do not animate selection with anything that moves layout. The row may change
  border and background. It must not change height.

## Anti-patterns, and what each one costs

| Pattern | What goes wrong |
|---|---|
| Number input or stepper | Buyer computes; nothing suggests more than one |
| 1 / 2 / 3 tiers | Reads as a stepper; the middle tier is not a package |
| No preselection | The shop has no opinion; most buyers take one unit |
| Top tier preselected | Decision taken for the buyer; returns follow |
| Percentage only | The saving needs arithmetic before it feels like money |
| Invented anchor | Unlawful in the EU, and checkable in one click |
| Anchor on the 1-unit tier | A struck-through price equal to itself |
| Six tiers in a grid | A pricing table: a slower, different decision |
| Tier names that are numbers | The buyer learns nothing they did not have |

## Where it goes on the page

Directly above the add-to-cart button, below the price and the short
description. Not in a tab, not behind an accordion, not below the fold on
mobile. If the buyer has to discover it, it does not act on the order.

On a 390px viewport the three rows plus the button should fit in one screen with
the product image still partly visible above. If they do not, the rows are too
tall — cut each row back to name, price, saving and unit price, and nothing
else.
