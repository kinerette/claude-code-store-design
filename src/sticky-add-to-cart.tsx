/**
 * STICKY ADD-TO-CART (mobile) — the button stops leaving the screen.
 *
 * On a 390px viewport the inline button is out of view for most of the
 * session, because the buyer scrolled down to read the description. This bar
 * appears only once that has happened, so the two are never on screen at the
 * same time competing for the same tap.
 *
 * MIT. No dependency beyond React.
 */

import { useEffect, useRef, useState } from "react"
import type { RefObject } from "react"

export type StickyAddToCartProps = {
  /** ref to the INLINE add-to-cart button; the bar shows once it leaves view */
  ancre: RefObject<Element | null>
  /** "Add 3 tins" — carries the selected tier, so a glance replaces a scroll */
  label: string
  totalCents: number
  currency: string
  locale?: string
  onAdd: () => void
  disabled?: boolean
}

function money(cents: number, currency: string, locale?: string) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
  }).format(cents / 100)
}

export function StickyAddToCart({
  ancre,
  label,
  totalCents,
  currency,
  locale,
  onAdd,
  disabled,
}: StickyAddToCartProps) {
  const [visible, setVisible] = useState(false)
  const observateur = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    const cible = ancre.current
    if (!cible) return

    /* An IntersectionObserver rather than a scroll listener: the scroll
       handler runs on every frame of every scroll and is a known cause of
       jank on exactly the device this component exists for. */
    observateur.current = new IntersectionObserver(
      ([entree]) => setVisible(!entree.isIntersecting),
      { rootMargin: "0px 0px -8px 0px" },
    )
    observateur.current.observe(cible)
    return () => observateur.current?.disconnect()
  }, [ancre])

  return (
    <div className={`sac${visible ? " is-visible" : ""}`} aria-hidden={!visible}>
      <button
        type="button"
        className="sac__btn"
        onClick={onAdd}
        disabled={disabled}
        /* Removed from the tab order while hidden: a focusable control behind
           a translated bar is a keyboard trap that nobody sees in testing. */
        tabIndex={visible ? 0 : -1}
      >
        <span className="sac__label">{label}</span>
        <span className="sac__prix">{money(totalCents, currency, locale)}</span>
      </button>
    </div>
  )
}

export const STICKY_ADD_TO_CART_CSS = `
.sac{position:fixed;left:0;right:0;bottom:0;z-index:40;
  padding:10px 14px calc(10px + env(safe-area-inset-bottom,0px));
  background:var(--sac-bg,rgba(255,255,255,.92));
  border-top:1px solid var(--sac-line,#e4e4e7);
  backdrop-filter:blur(10px);
  transform:translateY(110%);pointer-events:none}
.sac.is-visible{transform:translateY(0);pointer-events:auto}
/* Above 768px the inline button is still reachable, so this bar is dead
   weight and one more thing covering the page. */
@media (min-width:768px){.sac{display:none}}
.sac__btn{display:flex;align-items:center;justify-content:space-between;gap:12px;
  width:100%;min-height:52px;padding:0 18px;border:0;border-radius:11px;
  font:inherit;font-weight:650;cursor:pointer;
  background:var(--sac-accent,#111);color:var(--sac-accent-ink,#fff)}
.sac__btn[disabled]{opacity:.5;cursor:not-allowed}
.sac__prix{font-variant-numeric:tabular-nums}
@media (prefers-reduced-motion:no-preference){
  .sac{transition:transform .22s cubic-bezier(.22,.61,.36,1)}
}
`
