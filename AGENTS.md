# AGENTS.md

Guidance for AI agents working with or inside this repository.

## What this repository is

A **Claude Code skill for store, product page and landing page design**,
following the [Agent Skills specification](https://agentskills.io/specification.md).
It also serves as a Claude Code plugin marketplace via
`.claude-plugin/marketplace.json`.

- **Skill name**: `store-design`
- **Repository**: [kinerette/claude-code-store-design](https://github.com/kinerette/claude-code-store-design)
- **Maintainer**: [uxgen](https://www.uxgen.ai)
- **Licence**: MIT

## Structure

```
claude-code-store-design/
├── .claude-plugin/
│   ├── marketplace.json      Claude Code marketplace manifest
│   └── plugin.json           plugin manifest
├── skills/
│   └── store-design/
│       ├── SKILL.md          the trade, condensed
│       ├── references/       loaded on demand
│       └── scripts/
│           └── audit-commerce.mjs
├── src/                      four React reference implementations
├── AGENTS.md
├── LICENSE
├── README.md
└── package.json
```

## If you are using this skill

1. **Read `skills/store-design/references/decision-table.md` first.** It is the
   centre. Seven questions about the merchant's product decide which mechanics
   belong on the page and in what order. Do not lay sections before answering
   them.
2. **Run the audit on an existing store** before proposing changes:
   `node skills/store-design/scripts/audit-commerce.mjs ./src`
3. **Load reference files on demand**, not all at once. Each one names when it
   is worth reading, in the table in `SKILL.md`.
4. **State your omissions.** When you decide a mechanic does not belong, say so
   and give the reason. A named omission is a decision; an unnamed one is a gap.

## Non-negotiable rules when generating a storefront

These are constraints, not preferences. Two of them are EU law.

- Quantity choice is a **radio group of named tiers**, never a number input.
- An add-on checkbox **never starts ticked** — Article 22 of Directive
  2011/83/EU makes an inferred payment refundable.
- A struck-through anchor is **derived**: `compareAtCents = unitPriceCents × units`.
- **Never generate proof.** No rating, review count, "N people viewing", "only N
  left", or testimonial with an invented name. Build the slot, leave it empty,
  say it is empty.
- **Never a countdown seeded from `Date.now()`.** It resets on refresh and
  states an urgency that does not exist.
- Nothing goes between the choice and the add-to-cart button.

## If you are contributing to this repository

- `SKILL.md` stays under 500 lines. Detail belongs in `references/`, which is
  loaded on demand — that is the point of the split.
- The `name` in `SKILL.md` frontmatter must match its directory name.
- Every rule carries **its reason**. A rule without one cannot be applied to a
  product it was not written for, which is the whole job.
- `scripts/audit-commerce.mjs` has **zero dependencies** and writes nothing.
  Keep it that way; it is the part people run before they trust anything else.
- Validate the skill format with
  [`skills-ref`](https://github.com/agentskills/agentskills/tree/main/skills-ref):
  `skills-ref validate ./skills/store-design`
- No third-party brand names in examples. No invented statistics anywhere.
