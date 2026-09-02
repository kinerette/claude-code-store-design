#!/usr/bin/env node
// audit-commerce — finds the commerce defects this kit exists to prevent.
//
//   node audit-commerce.mjs [dir]        human-readable report
//   node audit-commerce.mjs [dir] --json machine-readable
//   node audit-commerce.mjs [dir] --strict  exit 1 when anything is found
//
// Zero dependencies. Node 18+. Reads files, writes nothing.
//
// These are text heuristics, not a type checker. They are tuned to be worth
// reading rather than to be exhaustive: every finding names a file and a line
// so you can judge it yourself. False positives are expected and are cheap.

import { readdirSync, readFileSync, statSync } from "node:fs"
import { join, relative, extname } from "node:path"

const SKIP_DIRS = new Set([
  "node_modules", ".git", "dist", "build", ".next", ".nuxt", "out",
  "coverage", ".cache", "vendor", ".svelte-kit", "public", ".turbo",
])
const EXTS = new Set([
  ".tsx", ".jsx", ".ts", ".js", ".mjs", ".vue", ".svelte",
  ".liquid", ".html", ".astro", ".php", ".erb",
])
const MAX_BYTES = 600_000

const args = process.argv.slice(2)
const root = args.find((a) => !a.startsWith("--")) ?? "."
const asJson = args.includes("--json")
const strict = args.includes("--strict")

/* ------------------------------------------------------------------ walk */

function walk(dir, out = []) {
  let entries
  try {
    entries = readdirSync(dir, { withFileTypes: true })
  } catch {
    return out
  }
  for (const e of entries) {
    if (e.name.startsWith(".") && e.name !== ".") {
      if (SKIP_DIRS.has(e.name)) continue
    }
    const full = join(dir, e.name)
    if (e.isDirectory()) {
      if (SKIP_DIRS.has(e.name)) continue
      walk(full, out)
    } else if (e.isFile() && EXTS.has(extname(e.name))) {
      if (e.name === "audit-commerce.mjs") continue // this file describes the defects
      try {
        if (statSync(full).size <= MAX_BYTES) out.push(full)
      } catch { /* unreadable, skip */ }
    }
  }
  return out
}

/* ----------------------------------------------------------------- rules */

const COMMERCE_HINT =
  /\b(cart|basket|checkout|product|shop|store|panier|boutique|produit|commande|order|price|pricing|variant|sku)\b/i

const rules = [
  {
    id: "stepper-instead-of-tiers",
    severity: "high",
    title: "Quantity chosen with a stepper instead of named tiers",
    why:
      "A number input asks the buyer how many. A radio group of named packages " +
      "asks which one, and one of them is visibly the sensible choice. This is " +
      "the single most common defect in a generated storefront.",
    fix: "Replace with a radio group of 3 named tiers. See references/quantity-breaks.md",
    test(line) {
      if (/type\s*=\s*["'{]?\s*number/i.test(line) &&
          /\b(qty|quantity|quantite|quantité|amount|units?|nombre)\b/i.test(line)) return true
      if (/<input[^>]*\bname\s*=\s*["'{]?\s*(qty|quantity|quantite)\b/i.test(line)) return true
      if (/\b(increment|decrement|onPlus|onMinus|stepUp|stepDown)\s*(Qty|Quantity|Quantite)?\b/i.test(line) &&
          /\b(qty|quantity|quantite|cart|panier)\b/i.test(line)) return true
      return false
    },
  },
  {
    id: "pre-ticked-addon",
    severity: "critical",
    title: "An add-on may start ticked",
    why:
      "Article 22 of Directive 2011/83/EU requires express consent to any " +
      "payment beyond the main obligation, and makes a payment inferred from a " +
      "default the consumer had to reject refundable.",
    fix: "Start unchecked, with no prop that can make it start checked. See references/eu-rules.md",
    test(line) {
      const ticked =
        /\bdefaultChecked\b(?!\s*=\s*\{?\s*false)/.test(line) ||
        /\bchecked\s*=\s*\{?\s*true\b/.test(line) ||
        /\bchecked\s*:\s*true\b/.test(line) ||
        /<input(?=[^>]*type\s*=\s*["']checkbox["'])[^>]*\schecked(\s|\/|>)/i.test(line) ||
        /\bv-model[^=]*=\s*["'][^"']*["'][^>]*\bchecked\b/i.test(line)
      if (!ticked) return false
      return /\b(bump|upsell|up-sell|cross-?sell|add-?on|addon|extra|insurance|warranty|protection|gift-?wrap|newsletter|subscribe|marketing|opt-?in|donation|priority|express)\b/i.test(line)
    },
  },
  {
    id: "shipping-bar-without-money",
    severity: "medium",
    title: "Free-shipping progress shown without the remaining amount in currency",
    why:
      "A bar filled to 88% with no figure substitutes a feeling for a " +
      "disclosure. The buyer needs to know how far, in money.",
    fix: 'Render the remaining amount: "$6.00 away from free shipping".',
    fileTest(text) {
      if (!/free[\s_-]?ship|livraison[\s_-]?(gratuite|offerte)|freeShipping|shippingThreshold/i.test(text)) return null
      const hasMoney =
        /remaining|restant|toGo|difference|amountLeft|thresholdCents\s*-|-\s*subtotalCents|Intl\.NumberFormat|toFixed\(2\)|formatPrice|formatMoney|money_format/i.test(text)
      const hasBar = /progress|width\s*:|--progress|scaleX|percent|pourcent/i.test(text)
      if (hasBar && !hasMoney) return "progress shown, remaining amount not computed"
      return null
    },
  },
  {
    id: "fabricated-proof",
    severity: "critical",
    title: "Hard-coded rating, review count, or scarcity figure",
    why:
      "An untruthful claim about consumer reviews is an unfair commercial " +
      "practice under Directive 2005/29/EC. A generated number ships as a " +
      "false statement about the shop.",
    fix: "Take it from real data, or render the block with the data absent. See references/proof.md",
    test(line) {
      if (/\b(rating|stars?|note|avis)\s*[:=]\s*\{?\s*['"]?[1-5](\.\d)?['"]?\s*[,}\s)<]/i.test(line) &&
          !/props|\.rating|rating\s*\}|interface|type\s|number\b/i.test(line)) return true
      if (/\b(reviewCount|reviews?|nbAvis|totalReviews|ratingCount)\s*[:=]\s*\{?\s*\d{2,}/i.test(line) &&
          !/props|interface|type\s/i.test(line)) return true
      if (/\b\d+\s*(people|persons?|visitors?|personnes?)\s*(are\s*)?(viewing|looking|watching|regardent)/i.test(line)) return true
      if (/(only|plus que|seulement)\s*\{?\s*\d{1,2}\s*\}?\s*(left|remaining|restant|en stock)/i.test(line) &&
          !/stock\b\s*[<>=]|props|\.stock|\{stock/i.test(line)) return true
      return false
    },
  },
  {
    id: "anchor-not-derived",
    severity: "medium",
    title: "A struck-through price that is not derived from the unit price",
    why:
      "EU price-indication rules govern prior-price announcements. The " +
      "compare-at figure must be the real single-unit price times the unit " +
      "count, not a number chosen to make the saving look good.",
    fix: "compareAtCents = unitPriceCents * units. See references/eu-rules.md",
    test(line) {
      if (!/line-?through|<s>|<del|text-decoration\s*:\s*line-through|compareAt|comparePrice|oldPrice|wasPrice|prixBarre/i.test(line)) return false
      return /\b\d{3,}\b/.test(line) && !/\*|props|\.compareAt|units|qty|quantity/i.test(line)
    },
  },
  {
    id: "resetting-countdown",
    severity: "high",
    title: "A countdown that is not tied to a real dated event",
    why:
      "A timer seeded from the current time resets on refresh. It states an " +
      "urgency that does not exist, which is a misleading practice.",
    fix: "Tie it to a fixed end date, or remove it.",
    test(line) {
      if (!/countdown|timer|compteur|endsIn|expiresIn|timeLeft|offerEnds/i.test(line)) return false
      return /Date\.now\(\)\s*\+|new Date\(\)\s*\.\s*getTime\(\)\s*\+|\+\s*\d+\s*\*\s*60\s*\*\s*60|setHours\(.*\+/.test(line)
    },
  },
  {
    id: "placeholder-shipped",
    severity: "high",
    title: "Placeholder commerce copy still in the source",
    why: "Lorem ipsum and TODO prices reach production more often than anyone expects.",
    fix: "Replace before launch.",
    test(line) {
      return /lorem ipsum/i.test(line) ||
        /(price|prix|total)\s*[:=]\s*['"]?(TODO|XXX|0\.00|9\.99)['"]?\s*[,;}]/i.test(line) ||
        /John Doe|Jane Doe|test@(test|example)\.com/i.test(line)
    },
  },
]

/* -------------------------------------------------------- absence checks */

const absence = [
  {
    id: "no-sticky-mobile-cta",
    severity: "medium",
    title: "No sticky mobile add-to-cart found",
    why:
      "On a 390px viewport the inline button leaves the screen the moment the " +
      "buyer reads the description, which is most of the session.",
    fix: "Add one. See src/sticky-add-to-cart.tsx",
    present(text) {
      return /sticky[-_]?add|StickyAddToCart|stickyCart|barre[-_]?collante/i.test(text) ||
        (/position\s*:\s*fixed|fixed\s+bottom-0|\.sticky/i.test(text) &&
         /add[-_\s]?to[-_\s]?cart|ajouter au panier|addToCart/i.test(text))
    },
  },
  {
    id: "no-quantity-tiers",
    severity: "high",
    title: "No quantity breaks found",
    why:
      "Quantity breaks act earliest and on the largest share of orders, before " +
      "a cart exists. A shop selling a consumable without them leaves the " +
      "basket at one unit by default.",
    fix: "Add them. See references/quantity-breaks.md",
    present(text) {
      return /QuantityBreaks|quantity[-_]?break|volume[-_]?discount|tiered[-_]?pric|bundle[-_]?tier|paliers?/i.test(text) ||
        (/type\s*=\s*["']radio["']/i.test(text) && /\b(tier|pack|bundle|palier)\b/i.test(text))
    },
  },
  {
    id: "no-free-shipping-bar",
    severity: "low",
    title: "No free-shipping threshold bar found",
    why: "The cheapest of the four to build, and it acts on every order already near the threshold.",
    fix: "Add one. See src/free-shipping-bar.tsx",
    present(text) {
      return /FreeShippingBar|free[-_\s]?ship|livraison\s*(gratuite|offerte)|shippingThreshold/i.test(text)
    },
  },
  {
    id: "no-order-bump",
    severity: "low",
    title: "No order bump found",
    why: "One named complement above the totals acts at the confirmation moment.",
    fix: "Add one, unticked. See src/order-bump.tsx",
    present(text) {
      return /OrderBump|order[-_]?bump|\bupsell\b|cross[-_]?sell/i.test(text)
    },
  },
]

/* ------------------------------------------------------------------- run */

const files = walk(root)
const findings = []
let corpus = ""
let commerceFiles = 0

for (const file of files) {
  let text
  try {
    text = readFileSync(file, "utf8")
  } catch {
    continue
  }
  const isCommerce = COMMERCE_HINT.test(text)
  if (isCommerce) {
    commerceFiles++
    corpus += text + "\n"
  }

  const lines = text.split(/\r?\n/)
  for (const rule of rules) {
    if (rule.fileTest) {
      const note = rule.fileTest(text)
      if (note) {
        findings.push({
          rule: rule.id, severity: rule.severity, title: rule.title,
          why: rule.why, fix: rule.fix,
          file: relative(root, file) || file, line: 0, excerpt: note,
        })
      }
      continue
    }
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      if (line.length > 400) continue
      const trimmed = line.trim()
      if (trimmed.startsWith("//") || trimmed.startsWith("*") || trimmed.startsWith("#")) continue
      if (rule.test(line)) {
        findings.push({
          rule: rule.id, severity: rule.severity, title: rule.title,
          why: rule.why, fix: rule.fix,
          file: relative(root, file) || file, line: i + 1,
          excerpt: trimmed.slice(0, 160),
        })
      }
    }
  }
}

const missing = commerceFiles === 0 ? [] : absence.filter((a) => !a.present(corpus))

/* ---------------------------------------------------------------- output */

const RANK = { critical: 0, high: 1, medium: 2, low: 3 }
findings.sort((a, b) =>
  RANK[a.severity] - RANK[b.severity] ||
  a.rule.localeCompare(b.rule) ||
  a.file.localeCompare(b.file) ||
  a.line - b.line)

if (asJson) {
  console.log(JSON.stringify({
    scanned: files.length, commerceFiles, findings,
    missing: missing.map(({ id, severity, title, why, fix }) => ({ id, severity, title, why, fix })),
  }, null, 2))
} else {
  const bar = "─".repeat(66)
  console.log(`\n  commerce audit — ${files.length} files scanned, ${commerceFiles} look commerce-related\n`)

  if (commerceFiles === 0) {
    console.log("  Nothing commerce-related found here. Point the script at the")
    console.log("  directory holding the storefront:  node audit-commerce.mjs ./src\n")
  }

  if (findings.length) {
    console.log(`  ${bar}\n  FOUND — ${findings.length} occurrence${findings.length > 1 ? "s" : ""}\n`)
    let last = null
    for (const f of findings) {
      if (f.rule !== last) {
        console.log(`  [${f.severity.toUpperCase()}] ${f.title}`)
        console.log(`     ${f.why.replace(/(.{1,64})(\s|$)/g, "$1\n     ").trim()}`)
        console.log(`     → ${f.fix}\n`)
        last = f.rule
      }
      console.log(`     ${f.file}${f.line ? ":" + f.line : ""}`)
      if (f.excerpt) console.log(`       ${f.excerpt}`)
    }
    console.log("")
  }

  if (missing.length) {
    console.log(`  ${bar}\n  ABSENT — ${missing.length} mechanic${missing.length > 1 ? "s" : ""} not found anywhere\n`)
    for (const m of missing) {
      console.log(`  [${m.severity.toUpperCase()}] ${m.title}`)
      console.log(`     ${m.why.replace(/(.{1,64})(\s|$)/g, "$1\n     ").trim()}`)
      console.log(`     → ${m.fix}\n`)
    }
  }

  if (!findings.length && !missing.length && commerceFiles > 0) {
    console.log("  Nothing found. The four mechanics are present and none of the\n")
    console.log("  known defects matched.\n")
  }

  console.log(`  ${bar}`)
  console.log("  Text heuristics — read each finding before acting on it.")
  console.log("  Rules and reasoning: skills/store-design/references/\n")
}

process.exit(strict && (findings.length || missing.length) ? 1 : 0)
