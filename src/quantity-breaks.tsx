/**
 * QUANTITY BREAKS — a radio group of named tiers. Never a number input.
 *
 * The mistake this file exists to prevent: asked for "buy 2, save 15%", both
 * ChatGPT and Perplexity return a quantity stepper with min/max/step. A
 * stepper asks HOW MANY, which is arithmetic the buyer performs, and nothing
 * in it suggests two is better than one. A radio group asks WHICH PACKAGE,
 * and one of them is visibly the sensible one.
 *
 * MIT. No dependency beyond React.
 */

import { useId, useState } from "react"

export type Tier = {
  /** how many units this tier contains */
  units: number
  /** what the buyer can picture: "Three tins — the usual reorder" */
  name: string
  /** the price of this tier, in the smallest currency unit */
  totalCents: number
  /**
   * The honest comparison: the real single-unit price multiplied by `units`.
   * ⛔ NEVER a figure invented to enlarge the saving. EU price-indication
   *    rules govern prior-price announcements, so a struck-through price that
   *    was never charged is a prohibited practice, not an aggressive one.
   *    A value below `totalCents` throws in development (see below).
   */
  compareAtCents: number
  /**
   * "Most chosen", "Best value". ⛔ It must be TRUE — a badge claiming
   * popularity for a tier nobody picks is a false statement about your shop.
   */
  badge?: string
  /** exactly one tier should carry this, and it should be the middle one */
  preselected?: boolean
}

export type QuantityBreaksProps = {
  tiers: Tier[]
  /** ISO 4217, e.g. "USD", "EUR" */
  currency: string
  /** BCP 47, for formatting only. Defaults to the visitor's locale. */
  locale?: string
  onChange?: (tier: Tier) => void
  /** accessible name for the group; the visible legend if `legend` is unset */
  label?: string
}

function money(cents: number, currency: string, locale?: string) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    /* Whole amounts read better without the trailing zeros on a price ladder,
       but partial ones must never be rounded away: 15.50 is not 16. */
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
  }).format(cents / 100)
}

export function QuantityBreaks({
  tiers,
  currency,
  locale,
  onChange,
  label = "Choose your pack",
}: QuantityBreaksProps) {
  /* ── The guardrails, in development only ────────────────────────────────
     They throw rather than warn. A false anchor price and an untrue badge are
     the two failures that carry legal and reputational cost, and a console
     warning is a message nobody reads before shipping. */
  if (process.env.NODE_ENV !== "production") {
    if (tiers.length < 2) throw new Error("QuantityBreaks: at least two tiers, otherwise there is no choice to make.")
    if (tiers.length > 4) throw new Error("QuantityBreaks: more than four tiers turns a recognition into a comparison. Three is the target.")
    for (const t of tiers) {
      if (t.compareAtCents < t.totalCents) {
        throw new Error(
          `QuantityBreaks: tier "${t.name}" has a compare-at price below its own price. `
          + "compareAtCents must be the real single-unit price times the unit count. "
          + "A struck-through price that was never charged is a prohibited prior-price announcement in the EU.",
        )
      }
    }
    if (tiers.filter((t) => t.preselected).length > 1) {
      throw new Error("QuantityBreaks: only one tier can be preselected.")
    }
  }

  const groupe = useId()
  const [choisi, setChoisi] = useState<number>(() => {
    const i = tiers.findIndex((t) => t.preselected)
    /* Falling back to the FIRST tier would recommend spending the least. When
       nothing is declared, the middle tier is the honest default. */
    return i >= 0 ? i : Math.floor((tiers.length - 1) / 2)
  })

  const choisir = (i: number) => {
    setChoisi(i)
    onChange?.(tiers[i])
  }

  return (
    <fieldset className="qb" style={{ border: 0, margin: 0, padding: 0 }}>
      <legend className="qb__legend">{label}</legend>

      <div className="qb__tiers" role="none">
        {tiers.map((t, i) => {
          const actif = i === choisi
          const economie = t.compareAtCents - t.totalCents
          const unite = Math.round(t.totalCents / t.units)
          const id = `${groupe}-${i}`

          return (
            <label
              key={id}
              htmlFor={id}
              className={`qb__tier${actif ? " is-selected" : ""}`}
              data-selected={actif || undefined}
            >
              {/* The real input, kept in the accessibility tree rather than
                  replaced by a div: keyboard arrows move between tiers, a
                  screen reader announces "radio, 2 of 3", and the browser
                  handles the group semantics for free. */}
              <input
                id={id}
                type="radio"
                name={groupe}
                className="qb__radio"
                checked={actif}
                onChange={() => choisir(i)}
              />

              <span className="qb__body">
                <span className="qb__name">{t.name}</span>
                <span className="qb__unit">
                  {money(unite, currency, locale)} each
                </span>
              </span>

              <span className="qb__prices">
                <span className="qb__total">{money(t.totalCents, currency, locale)}</span>
                {economie > 0 && (
                  <span className="qb__save">
                    {/* Currency first, because a percentage is a second
                        conversion the buyer has to run. */}
                    Save {money(economie, currency, locale)}
                    <s className="qb__was">{money(t.compareAtCents, currency, locale)}</s>
                  </span>
                )}
              </span>

              {t.badge && <span className="qb__badge">{t.badge}</span>}
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}

/**
 * The selected tier, for binding the add-to-cart button:
 *   const [tier, setTier] = useState(tiers[1])
 *   <QuantityBreaks tiers={tiers} currency="USD" onChange={setTier} />
 *   <button>Add {tier.units} — {money(tier.totalCents, "USD")}</button>
 *
 * One glance replaces scrolling back up to check what was selected.
 */

export const QUANTITY_BREAKS_CSS = `
.qb__legend{font-weight:650;margin:0 0 10px;padding:0}
.qb__tiers{display:flex;flex-direction:column;gap:8px}
/* Vertical, never a horizontal carousel: three tiers fit on a 390px screen,
   and a carousel hides the tier you want chosen. */
.qb__tier{position:relative;display:flex;align-items:center;gap:12px;
  padding:14px 16px;border:1.5px solid var(--qb-line,#e4e4e7);border-radius:10px;
  cursor:pointer;background:var(--qb-bg,#fff)}
.qb__tier.is-selected{border-color:var(--qb-accent,#111);
  box-shadow:0 0 0 1px var(--qb-accent,#111)}
/* The radio stays focusable and visible to assistive tech; only its default
   painting is replaced. "appearance:none" on a real input, never a div. */
.qb__radio{appearance:none;width:18px;height:18px;flex:0 0 18px;margin:0;
  border:1.5px solid var(--qb-line,#c4c4c8);border-radius:50%}
.qb__radio:checked{border:5px solid var(--qb-accent,#111)}
.qb__radio:focus-visible{outline:2px solid var(--qb-accent,#111);outline-offset:3px}
.qb__body{display:flex;flex-direction:column;gap:2px;flex:1;min-width:0}
.qb__name{font-weight:600}
.qb__unit{font-size:13px;opacity:.7;font-variant-numeric:tabular-nums}
.qb__prices{display:flex;flex-direction:column;align-items:flex-end;gap:2px}
/* Tabular figures: a price ladder whose digits do not line up reads as sloppy
   at exactly the moment the buyer is comparing three numbers. */
.qb__total{font-weight:650;font-variant-numeric:tabular-nums}
.qb__save{font-size:13px;font-variant-numeric:tabular-nums;
  display:flex;gap:6px;align-items:baseline}
.qb__was{opacity:.55}
.qb__badge{position:absolute;top:-9px;right:12px;font-size:11px;font-weight:650;
  letter-spacing:.02em;padding:2px 8px;border-radius:999px;
  background:var(--qb-accent,#111);color:var(--qb-accent-ink,#fff)}
@media (prefers-reduced-motion:no-preference){
  .qb__tier{transition:border-color .12s ease,box-shadow .12s ease}
}
`
