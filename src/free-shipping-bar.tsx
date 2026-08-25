/**
 * FREE-SHIPPING THRESHOLD BAR — the remaining amount, in money.
 *
 * The failure this prevents: a progress bar with no number, or a percentage.
 * "$6.00 to unlock free shipping" is an instruction. "78%" is a second
 * conversion the buyer has to run before they know what to do.
 *
 * MIT. No dependency beyond React.
 */

import type { CSSProperties } from "react"

export type FreeShippingBarProps = {
  subtotalCents: number
  /** A figure chosen against your margin, not a round number you liked. */
  thresholdCents: number
  currency: string
  locale?: string
  /**
   * Below this share of the threshold the bar reads as a distance rather than
   * a nudge, so it is not rendered at all. 0.4 is the default; set it to 0 to
   * always show.
   */
  seuilAffichage?: number
}

function money(cents: number, currency: string, locale?: string) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
  }).format(cents / 100)
}

export function FreeShippingBar({
  subtotalCents,
  thresholdCents,
  currency,
  locale,
  seuilAffichage = 0.4,
}: FreeShippingBarProps) {
  if (process.env.NODE_ENV !== "production" && thresholdCents <= 0) {
    throw new Error("FreeShippingBar: thresholdCents must be a real amount.")
  }

  const part = subtotalCents / thresholdCents
  const atteint = subtotalCents >= thresholdCents
  const restant = Math.max(0, thresholdCents - subtotalCents)

  /* An empty cart, or one far from the threshold, gets nothing. A bar sitting
     at 4% is not encouragement, it is a reminder of how far away you are. */
  if (!atteint && part < seuilAffichage) return null

  const style = { "--fsb-part": `${Math.min(100, part * 100)}%` } as CSSProperties

  return (
    <div className="fsb" style={style}>
      <p className="fsb__texte" aria-live="polite">
        {atteint ? (
          <strong>Free shipping unlocked.</strong>
        ) : (
          <>
            <strong>{money(restant, currency, locale)}</strong>
            {" to unlock free shipping"}
          </>
        )}
      </p>

      {/* The bar itself is decorative: the sentence above already carries the
          whole message, and it is the sentence a screen reader announces. */}
      <div
        className={`fsb__piste${atteint ? " is-done" : ""}`}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={thresholdCents}
        aria-valuenow={Math.min(subtotalCents, thresholdCents)}
        aria-valuetext={
          atteint
            ? "Free shipping unlocked"
            : `${money(restant, currency, locale)} to unlock free shipping`
        }
      >
        <div className="fsb__jauge" />
      </div>
    </div>
  )
}

export const FREE_SHIPPING_BAR_CSS = `
.fsb{display:flex;flex-direction:column;gap:7px;padding:12px 14px;
  border:1px solid var(--fsb-line,#e4e4e7);border-radius:10px;
  background:var(--fsb-bg,#fafafa)}
.fsb__texte{margin:0;font-size:14px;font-variant-numeric:tabular-nums}
.fsb__piste{height:6px;border-radius:999px;overflow:hidden;
  background:var(--fsb-track,#e4e4e7)}
.fsb__jauge{height:100%;width:var(--fsb-part,0%);border-radius:999px;
  background:var(--fsb-accent,#111)}
/* Once the goal is reached the bar stops moving. A component that keeps
   celebrating after the threshold is noise on every subsequent render. */
.fsb__piste.is-done .fsb__jauge{background:var(--fsb-done,#16a34a)}
@media (prefers-reduced-motion:no-preference){
  .fsb__jauge{transition:width .28s cubic-bezier(.22,.61,.36,1)}
}
`
