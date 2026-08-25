/**
 * ORDER BUMP — one named item, one price, one reason, one UNCHECKED box.
 *
 * The rule this file enforces in its type signature: the box cannot start
 * checked. There is deliberately no `defaultChecked` prop and no way to pass
 * one. Article 22 of Directive 2011/83/EU requires the trader to obtain the
 * consumer's express consent to any payment beyond the main obligation, and
 * states that where consent was inferred from a default option the consumer
 * had to reject, the consumer is entitled to reimbursement of that payment.
 *
 * Several commercial upsell widgets ship pre-ticked as their factory default.
 * An agent installing one on a European merchant's store without opening the
 * settings has created a refund liability while trying to raise the basket.
 *
 * MIT. No dependency beyond React.
 */

import { useId, useState } from "react"

export type BumpItem = {
  name: string
  priceCents: number
  /** one line, concrete: "Measures one serving exactly." */
  reason: string
  imageSrc?: string
  imageAlt?: string
}

export type OrderBumpProps = {
  item: BumpItem
  currency: string
  locale?: string
  /**
   * The cart total, used only for the development guardrail below. A
   * complement priced near the cart reads as a second purchase and reopens
   * the whole decision instead of confirming it.
   */
  cartTotalCents?: number
  onToggle?: (added: boolean) => void
}

function money(cents: number, currency: string, locale?: string) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
  }).format(cents / 100)
}

export function OrderBump({
  item,
  currency,
  locale,
  cartTotalCents,
  onToggle,
}: OrderBumpProps) {
  if (process.env.NODE_ENV !== "production") {
    if (!item.reason?.trim()) {
      throw new Error(
        "OrderBump: `reason` is required. An add-on with a price and no reason is a "
        + "question the buyer has to answer with no information.",
      )
    }
    if (cartTotalCents && item.priceCents > cartTotalCents * 0.5) {
      throw new Error(
        "OrderBump: the complement costs more than half the cart. At that price it "
        + "reads as a second purchase and reopens the decision. Use a cheaper complement, "
        + "or offer this as a post-purchase item instead.",
      )
    }
  }

  /* ⛔ Initialised to false, always, and there is no prop that can change it.
     This is the one line of this component that carries legal weight. */
  const [ajoute, setAjoute] = useState(false)
  const id = useId()

  const basculer = (v: boolean) => {
    setAjoute(v)
    onToggle?.(v)
  }

  return (
    <div className={`ob${ajoute ? " is-added" : ""}`}>
      <label className="ob__label" htmlFor={id}>
        <input
          id={id}
          type="checkbox"
          className="ob__box"
          checked={ajoute}
          onChange={(e) => basculer(e.target.checked)}
        />

        {item.imageSrc && (
          <img
            className="ob__img"
            src={item.imageSrc}
            alt={item.imageAlt ?? ""}
            width={44}
            height={44}
            loading="lazy"
            decoding="async"
          />
        )}

        <span className="ob__body">
          <span className="ob__name">
            {"Add "}
            {item.name}
            {" — "}
            <span className="ob__prix">{money(item.priceCents, currency, locale)}</span>
          </span>
          <span className="ob__reason">{item.reason}</span>
        </span>
      </label>
    </div>
  )
}

export const ORDER_BUMP_CSS = `
/* It sits above the totals and below the cart contents: the buyer is already
   reading a list, so one more line is not a new context. It is never a screen
   that must be cleared to continue — that form is the most expensive version
   of this pattern. */
.ob{border:1.5px dashed var(--ob-line,#d4d4d8);border-radius:10px;
  background:var(--ob-bg,#fafafa)}
.ob.is-added{border-style:solid;border-color:var(--ob-accent,#111)}
.ob__label{display:flex;align-items:center;gap:12px;padding:13px 15px;cursor:pointer}
.ob__box{appearance:none;width:19px;height:19px;flex:0 0 19px;margin:0;border-radius:5px;
  border:1.5px solid var(--ob-line,#c4c4c8);background:var(--ob-bg2,#fff);
  display:grid;place-content:center}
.ob__box:checked{background:var(--ob-accent,#111);border-color:var(--ob-accent,#111)}
.ob__box:checked::after{content:"";width:10px;height:6px;margin-top:-2px;
  border:2px solid var(--ob-accent-ink,#fff);border-top:0;border-right:0;
  transform:rotate(-45deg)}
.ob__box:focus-visible{outline:2px solid var(--ob-accent,#111);outline-offset:3px}
.ob__img{border-radius:7px;object-fit:cover;flex:0 0 44px}
.ob__body{display:flex;flex-direction:column;gap:2px;min-width:0}
.ob__name{font-size:14.5px;font-weight:600}
.ob__prix{font-variant-numeric:tabular-nums}
.ob__reason{font-size:13px;opacity:.72}
`
