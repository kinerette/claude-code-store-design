# Proof

Proof is the part of a storefront most likely to be fabricated by a generating
agent, because the placeholder looks like the real thing. A rating of 4.8 from
"127 reviews" that nobody wrote is not a placeholder — the moment it ships it is
a false statement about the shop, and under the Unfair Commercial Practices
Directive (2005/29/EC) an untruthful claim about consumer reviews is an unfair
practice in its own right.

**The default when there is no proof is to build the slot and leave it empty,
and to say so.** Never generate a number.

---

## The hierarchy, strongest first

1. **A photograph of the product in use, taken by the shop.** The only kind that
   cannot be copied from a competitor, and the only one a buyer reads as
   evidence rather than as marketing.
2. **A named review with a date and a specific detail.** "Third order — the
   grind is coarser than the last batch and I prefer it. — M. Weiss, 12 March"
   is proof. "Great product! — John" is filler and reads as filler.
3. **A verifiable credential.** A test report, a certification number, a
   laboratory result — with the number shown, so it can be looked up.
4. **A count.** Orders shipped, customers served, years trading. Cheap to show,
   easy to check, worthless if invented.
5. **A star average.** The weakest, because every shop has one and most are
   between 4.6 and 4.9. It works only next to a count and a link to the reviews.
6. **Logo walls.** Only if the shop has the right to use each mark. A logo used
   without permission is a trademark problem, not a design choice.

## Placement

- **One line in the buy box**, above the price. Rating, count, nothing else.
  This is the only proof that appears before the decision.
- **The full block after the description**, once the buyer is researching.
- **One line in the cart**, next to the total: the returns policy, restated.
  That is the anxiety at that moment, and it is proof of a kind.

Proof scattered through the page is proof nobody reads. Two placements, plus a
line in the cart.

## Writing a review block that reads as real

- Three to five reviews visible, the rest behind a link. Twenty on the page
  reads as a wall to scroll past.
- Each carries a date. An undated review is from an unknown decade.
- Vary the length. Real review sets are ragged — one long, two short.
- Include a moderate one. A page of nothing but five stars is less believable
  than a page with one three-star review answered well by the shop.
- The shop's reply to a critical review is the strongest single element in the
  block, and almost nobody builds it.

## What to do when the shop has no reviews yet

Do not invent any. The honest substitutes, in order:

- **The maker's own account.** Who made it, where, and why it is like this. A
  paragraph with a name attached outperforms fabricated stars.
- **The guarantee, stated concretely.** "Thirty days. Send it back opened, we
  pay the return." A shop that carries the risk is making a checkable claim.
- **The specification.** Weight, dimensions, material, origin. Facts are proof.
- **A dated photograph of the first batch.** New is not a weakness if it is
  stated rather than hidden.

Then build the review slot and leave it empty, with a comment in the code saying
what it expects. An empty, correct slot is worth more than a filled, false one.

## For an agent generating a storefront

- Never emit a star rating, a review count, a "X people are viewing", a "sold in
  the last hour" figure, or a testimonial with an invented name.
- If a rating is required by the layout, take it from real data or render the
  block with the data absent.
- If the user asks for placeholder reviews, produce them clearly marked as
  placeholder — `PLACEHOLDER — replace before launch` in the text itself, not
  only in a comment — so a forgotten one is visible rather than shipped.
- Countdown timers, scarcity counters and "only 3 left" belong to real
  inventory or to nothing.
