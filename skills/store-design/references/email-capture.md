# Email capture

Most visitors leave without buying, and for most shops the address is the only
thing that makes a second visit possible. Email capture is therefore worth
building — and it is also the element most likely to be built as the thing
everybody hates, which is a modal over the product at second zero.

---

## The rule

**Ask at a moment when the visitor has a reason of their own to give it.**

There are three such moments, and none of them is arrival.

| Moment | The ask | Why it works |
|---|---|---|
| Out of stock | "Tell me when it is back" | The visitor wants the notification |
| After the order | "Track this order by email" | Already given; confirm the use |
| Bottom of a long page | "One email when the next batch ships" | They read to the end |

A modal at second zero interrupts a decision that had not been made yet. It
collects addresses from people who were leaving anyway, and it costs the ones
who were not.

## The out-of-stock capture

This is the highest-value one and it is almost never built. When the product
cannot be bought, the button is replaced — not greyed — by:

1. A dated statement: "Out of stock. Next batch ships 14 March."
2. One field, for the address, with the button beside it.
3. One sentence saying exactly what will be sent: "One email when it ships.
   Nothing else."

The visitor gets a use for the address that serves them. Conversion on this
placement is high because the intent was already there.

If there is no date, say there is no date. "Out of stock, no date yet — leave
your address and you will hear first" is honest and still works. An invented
restock date produces a second disappointment.

## The form itself

- **One field.** A name field halves completion and the shop does not need it
  yet.
- `type="email"`, `autocomplete="email"`, `inputMode="email"`. On a phone this
  is the difference between the right keyboard and the wrong one.
- A real `<label>`, not a placeholder standing in for one. Placeholder-as-label
  disappears the moment the visitor types and fails every accessibility check.
- The button says what happens: "Notify me", not "Submit".
- Errors appear next to the field, in words: "That address is missing an @".
- Success replaces the form with a confirmation in the same space. Do not clear
  the field and leave the visitor guessing.

## Consent, in the EU

Under the GDPR and the ePrivacy Directive, a marketing email needs a lawful
basis. The two that apply to a shop:

- **Consent** — freely given, specific, informed, unambiguous, by a clear
  affirmative act. An unticked box the visitor ticks. Never a pre-ticked one:
  the reasoning is the same as for the order bump in `references/eu-rules.md`.
- **Soft opt-in** — for a customer who bought, for the shop's own similar
  products, with an opt-out offered at collection and in every message. Member
  State implementations of this vary; the shop's counsel decides whether it
  applies.

In code, that means:

- A restock notification is the purpose the visitor asked for. Sending marketing
  to that address afterwards is a second purpose and needs its own consent.
- If the same form does both, there are two lines: the notification, and a
  separate unticked box for the newsletter.
- Record what was consented to and when. A consent you cannot evidence is a
  consent you do not have.
- Every message carries a working unsubscribe, and the shop's identity and
  address.

This is a builder's summary, not legal advice.

## An exit-intent popup, if there must be one

Some shops will want one regardless. The version that does the least damage:

- Desktop only. Exit intent does not exist on a touch screen, and the mobile
  imitations fire on a scroll gesture.
- Once per visitor, remembered. A popup that returns on every page is the
  reason people install blockers.
- Never over the product page while a product is selected. The visitor is mid-
  decision.
- Closable with one obvious control, `Escape`, and a click outside. No "No
  thanks, I hate saving money" — a shop that insults the visitor to close a box
  has said something about itself.
- Focus moves into the dialog and is returned on close. `role="dialog"`,
  `aria-modal="true"`, a label.

A footer field and an out-of-stock capture, both built properly, will usually
out-collect a popup over a year, without the cost to the visitors who stayed.

## What not to do

- No pre-ticked newsletter box, anywhere, ever.
- No address required to see a price.
- No spin-the-wheel discount gate. It is a gate, and a gate before the product
  is a bounce.
- No capture placed between the quantity breaks and the add-to-cart button.
- No second modal after the first one was dismissed.
