# Changelog

This site was built over six sessions before it was put under version control,
so the git history starts at the finished thing. This file is the record of how
it got there, written afterwards from the working notes.

It is kept because the decisions were more interesting than the diffs — and
because several of them were wrong first.

---

## 2026-08-23 — A tribute, then a direction

Started from a CV and one reference site. The CV text came out of the PDF
cleanly; the hyperlinks did not, which mattered later.

The first build followed the reference closely — same structure, same devices,
CV content poured in. It worked, and it was the wrong thing: a recreation with
the text swapped, not a portfolio with a point of view.

Rebuilt from nothing as its own system. Monochrome, two tones, numbered
sections alternating between them, one grotesque and one mono. Motion driven by
scroll rather than decoration.

The rebuild also fixed a content problem measured rather than guessed:

| | before | after |
| --- | --- | --- |
| "Sydney" | 13× | 3× |
| "Artificial Intelligence" | 5× | 2× |
| "graduate" | 8× | 2× |

What survives is not repetition: the two "Artificial Intelligence" hits are the
degree name and the field of work, and "graduate" only matches inside
*Postgraduate* and *Undergraduate*.

The rule that came out of it — **every fact gets exactly one home** — held for
the rest of the build.

## 2026-08-24 — Backdrops that can actually be seen

The first backdrops were textures at 7–10% opacity. Technically animating,
effectively invisible. Replaced with real geometry at architectural scale:
portal rings, a perspective grid running toward the viewer, a wireframe vortex,
expanding signal rings.

**Bug worth recording.** The hero name faded almost instantly and no curve
adjustment fixed it. The cause was not the curve: the hero is 803px tall in an
800px viewport, and the scroll progress was computed as `height − viewport`.
That gave a **3px** scroll range, so every hero effect ran 0 → 1 across three
pixels. Two symptoms — the fade *and* a 38px overlap with the eyebrow — came
from that one number.

## 2026-08-25 — Motion that means something

The vortex was static SVG with dashes sliding along fixed paths, which read as
fake because it was. Rebuilt on canvas so the spokes genuinely revolve around
the funnel axis and twist with depth. A 2-D rotation cannot do this: the rings
are perspective ellipses, so spinning the plate just tumbles it.

The Journey backdrop was removed entirely after both the animated and the static
version were rejected. It carries the most text on the page; a section that
dense is better with nothing behind it.

Contact was rebuilt around a different premise — the visitor arrives holding the
CV — so it stopped repeating contact details and became a spec of what the work
search actually is, plus a live clock in the right timezone.

## 2026-08-26 — Identity, and a privacy hole

The hero name became **LOEN**, with the legal name kept in the eyebrow and in
`<title>` so the chain from CV to portfolio to LinkedIn never breaks.

A single short word needs different sizing from a wrapped full name, so it got
its own rule: `14vw` capped at 200px, against the `15.5vw` capped at 250px the
full name used.

**The important find.** The email had been moved out of the HTML and into
JavaScript, which feels like protection. It is not:

```bash
curl -s .../assets/js/site.js | grep -oE "[[:alnum:]._%+-]+@[[:alnum:].-]+\.[[:alpha:]]{2,}"
```

One command, no JavaScript executed. Removed, and LinkedIn became the contact
instead — reachable, but revocable in a way a published address is not.

## 2026-08-27 — Theme, cursor, playground

Dark mode, dark by default. It is not an inversion — inverting would leave half
the sections glaring white at night. Both tones move down instead, so sections
step between two darks. The trick that made it cheap: `--ink` and `--paper` are
redefined **per section**, so every hover-inversion rule kept working untouched.

The cursor stopped merely enlarging over header controls and started merging
into them, dropping below the header's z-index so the label rides on top.

**Bug worth recording.** The theme toggle looked right and did nothing. The
header sets `pointer-events:none` so it does not block the page, and only `a`
elements took those events back — the toggle is a `button`. It passed testing
because the test used `element.click()`, which bypasses hit-testing entirely.
Verifying logic is not verifying clickability.

Added the playground as a separate page rather than a section: the portfolio is
built to be *scanned*, a playground to be *explored*, and one page cannot serve
both.

## 2026-08-28 — Subtraction, and version control

Removed the moving word band from Capabilities. It had been through three sets
of copy without landing, which is usually a sign the element is the problem
rather than the words.

That removal surfaced a regression from the day before: the Playground link had
pushed the header 27px past a 320px viewport, shoving the theme toggle off
screen entirely.

The browser tab now leads with the brand: `Loen — Software Engineer`, and
`Playground — Loen`. The legal name stays everywhere it does work — the hero
eyebrow, the footer, both `aria-label`s, and the `author` and `description`
metadata — but the tab is a six-character space, and the brand earns it.

Put under git. The commit email is a GitHub `noreply` address on purpose —
commit history is public and permanent, and is one of the more common places a
developer's real address gets harvested from.

## 2026-08-31 — The playground stops being empty

First entry in the playground index: **Naruto JRPG**, with no link yet.

The row language is the work index reused rather than reinvented, which meant
widening those rules from `button` to `button`, `a` and `.idle`. Two of those
selectors were briefly wrong in a way CSS does not complain about:
`.iw button,.iw a::before` reads as *`.iw button` or `.iw a::before`*, so the
hover fill silently stopped applying to every existing project row.

An entry with no link renders as an inert `<div>` with a dashed "In progress"
chip, not an anchor pointing nowhere — the same choice the contact block makes
for an unset LinkedIn.
