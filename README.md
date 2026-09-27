# Luan T. Gaion — Portfolio

**Live at [luantgaion.github.io](https://luantgaion.github.io)**

A single-page portfolio in English. Minimalist monochrome: two tones, one grotesque
(Archivo) and one mono (JetBrains Mono), a strict left-aligned grid, and motion used
sparingly. No framework, no build step.

Portal One was the reference for the *energy* — oversized display type, confident use of
scale, a section that scrolls as a set — not for the layout. The structure, grid, motion
language and interactions here are their own thing.

## Run it

```bash
npx --yes serve -l 4321 .
```

Then open <http://localhost:4321>. Opening `index.html` from disk also works.

## Name and mark

The site brands as **LOEN**, and so does the browser tab. But the visitor arrives
from a CV that says **Luan T. Gaion**, so the real name is never more than a
glance away: it sits in the hero eyebrow directly above the mark, in the footer,
in the `aria-label` of both, and in the `author` and `description` metadata. The
chain from CV to portfolio to LinkedIn never breaks — the tab just leads with the
brand.

To go back to the full name as the headline, edit the `<h1 class="title one">` in
`index.html` and drop the `one` class (it is what sizes a single short word, currently
`clamp(42px, 14vw, 200px)`).

## Theme

**Dark is the default.** Light is the alternate, reachable from the toggle in the
header, and a visitor's choice is remembered in `localStorage`.

Both themes keep the same two-tone alternating rhythm. Dark does not invert the
page — that would leave half the sections glaring white at night. Instead it moves
both tones down, so sections step between two darks:

| | Light | Dark |
| --- | --- | --- |
| `.sec` | `#FFFFFF` | `#161616` |
| `.sec.inv` | `#0A0A0A` | `#0A0A0A` |
| text | `#0A0A0A` / `#FFFFFF` | `#ECECEC` |

The trick that makes this cheap: **`--ink` and `--paper` are redefined per section**,
not globally. Inside a `.sec` they mean "this section's foreground / background";
inside a `.sec.inv` they swap. Every hover-inversion rule already reads those two
tokens, so the whole theme works without a single one being rewritten. The overlay
panel scopes its own pair the same way.

A tiny inline script in `<head>` sets the theme before first paint, so the page
never flashes the wrong one.

## The idea

Five numbered sections that alternate between paper and ink:

| | Section | Tone | What it owns |
| --- | --- | --- | --- |
| 00 | Hero | paper | The LOEN mark, positioning line, counted stats |
| 01 | Work | ink | The projects |
| 02 | Capabilities | paper | Skills and spoken languages |
| 03 | Journey | ink | Education and experience |
| 04 | Contact | paper | A spec of what you are looking for, and the LinkedIn link |

**Each fact has exactly one home.** Availability is stated in Contact and nowhere
else; skills live only in Capabilities; degrees only in Journey. The hero shows
counted numbers rather than prose, and each is *derived* from the data at the top
of `site.js`, so adding a project or a tool updates them by itself.

## The motion

Two kinds, layered.

**Backdrops** — one large geometric structure per section, drawn in
`currentColor` so it picks up its section's tone. These are meant to be *seen*:
hairlines at real opacity, at architectural scale, always moving.

| Section | Backdrop |
| --- | --- |
| Hero | **Portal** — rounded rings streaming out of the centre; the whole plate zooms as you scroll, so leaving the hero feels like moving through it |
| Work | **Grid** — a horizon plane running toward you in perspective, fading out at the vanishing point |
| Capabilities | **Vortex** — a wireframe funnel on a canvas. The spokes genuinely revolve around its axis and twist with depth; the rings stay put because they are rotationally symmetric |
| Journey | **None** — deliberately bare. It carries the most text on the page, and it is the rest between two active sections |
| Contact | **Signal** — rings expanding from the centre, like a signal going out |

Sections that are off screen have their animations **parked**, so only what you
can see is running.

**Scroll-linked** — one `requestAnimationFrame` loop; each section publishes two
signals:

- `--p` — how far through its own range (0 while it still owns the screen, 1 once
  scrolled past). Drives the hero fade and the timeline spine.
- `--v` — how far across the viewport (0 entering, 1 leaving). Drives background
  parallax, the numeral drift and the title slide.

On top of that: the name assembles **character by character**; the stats **count
up**; giant outlined section numerals parallax behind everything; the Work title
**pins** while projects scroll past it; the timeline **spine draws
itself**; and the cursor flips tone against whatever it crosses.

Behind the dot trails a **ribbon**: 26 circles blurred together by an SVG goo
filter, which thresholds alpha so overlapping blurs resolve as one shape rather
than a string of beads.

Two things make it hold together. The circles are placed at even distances
**along the recent pointer path**, not chained one to the next — in a chain the
gap grows with pointer speed, so a fast flick pulls the ribbon apart. And they
all share one opacity: the filter thresholds alpha, so fading them individually
would make the faint ones vanish outright rather than fade. The taper is size
alone, and it tapers *away* from the pointer — widening away from it starves
the near end until the ribbon detaches from the cursor.

It joins the same rule that flips the cursor's tone per section, so it inverts
in both themes for free, and it hides while the cursor is merged into a header
control, where the pill is already the feedback.

Over a header control the cursor does something different: instead of enlarging,
it **merges into the control** — becoming a filled pill behind it. It drops below
the header's z-index so the label rides on top, and the label flips to the
section's background tone to stay readable on the fill. Everywhere else the plain
enlarge is kept.

## Playground

The experiments live on **their own page**, not a section, because the two are
used differently. The portfolio is built to be *scanned* — a recruiter skims it in
a minute, which is why it is made of rows, spec sheets and counted numbers. A
playground is built to be *explored*. One page cannot serve both without one of
them losing.

It shares `site.css` and `site.js` outright. Every builder in the JS is guarded
(`if (!host) return`), so the same script runs safely on a page that has none of
the portfolio's sections — the playground gets the theme, the magnetic cursor and
the header for free.

```
/index.html                → portfolio
/playground/index.html     → the index of experiments
/playground/<name>/        → each experiment, with room of its own
```

Each experiment in its own folder is the point: a browser game wants a full
screen and its own scripts. Links between the pages are **relative** (`../`), so
the site still works when served from a subpath, as GitHub Pages does.

The header's **Playground** link looks like its neighbours at rest, then reads as
a different kind of place on hover: the letters resolve out of noise, and the
cursor merges into a **squared** block rather than the stadium pill the other
controls get.

That only works cleanly because the nav is set in JetBrains Mono — every glyph is
the same width, so the label never changes size while the characters churn
(measured: 84px throughout). The churn is stepped every other frame, because at
60fps a fresh glyph per frame reads as a blur rather than as characters. Budget is
~26 updates, so ~52 frames, so ~0.9s.

> Do not time this by wall clock in a headless or backgrounded browser —
> `requestAnimationFrame` is throttled there and the measurement is meaningless.
> Count updates instead.

## Files

| Path | What it is |
| --- | --- |
| `index.html` | The portfolio: page structure and the inline SVG icon sheet |
| `playground/index.html` | The playground, a separate page sharing the same CSS and JS |
| `assets/css/site.css` | Every style, including responsive and reduced-motion rules |
| `assets/js/site.js` | Your details, project data, reveals, chrome tone, overlay |
| `assets/favicon.svg` | The L mark |
| `CHANGELOG.md` | How the site was built, session by session |
| `portal-one.html` | The design reference. Git-ignored — kept locally, never published |

## Contact: LinkedIn, and no personal data in the repo

The ending assumes the visitor arrived **from the CV** — which already carries the
email and phone. Publishing them again on a public page adds nothing for that
reader and exposes them to every scraper, so **there is no email or phone anywhere
in this repository**. LinkedIn is the contact instead: reachable, but revocable and
controlled.

> A "hidden" email is a myth worth naming. Building the address in JavaScript keeps
> it out of the HTML, but `assets/js/site.js` is a public file — one `curl | grep`
> harvests it without running any JavaScript at all.

```js
const ME = {
  linkedin:   '',   // 'https://www.linkedin.com/in/your-handle'
  lookingFor: 'Part-time roles',
  field:      'Artificial intelligence · Software engineering',
  based:      'Sydney, Australia',
  timeZone:   'Australia/Sydney',
  github:     '',   // 'https://github.com/your-handle'
  resume:     ''    // 'assets/Luan_Gaion_CV.pdf'
};
```

- The block shows the word **LinkedIn**, not the URL — the handle adds nothing a
  reader needs. Set `linkedin` and it becomes a working link opening in a new tab;
  left empty it renders a dimmed, dashed placeholder, never a dead link.
- The **local clock** is live, derived from `timeZone`. It tells a recruiter abroad
  whether it is a civil hour to reach out.
- `github` and `resume` are only rendered when set.

If you ever want an email on the page, do not use `mailto:` — use a form with spam
protection, so the address is never published.

## Adding a project

One object in the `PROJECTS` array in `assets/js/site.js`, newest first. The index numbers,
the counter next to the section title, the prev/next buttons and the detail panel all
update themselves.

```js
{
  name: 'Project Name',
  year: '2026',
  kind: 'What kind of thing it is',
  role: 'Your role',
  stack: ['React', 'TypeScript'],
  summary: 'One sentence, shown large under the title.',
  prose: [ 'First paragraph.', 'Second paragraph.' ],
  highlights: [ 'Three or so short points.' ],
  link: ''    // a URL adds a "Visit project" button under the summary;
              // empty shows "Case study coming soon" instead of a dead button
}
```

The copy for the five existing projects is expanded from the wording in your CV. It is
accurate but generic — worth replacing with your own detail before you send this anywhere.

Creme de la Web links to <https://www.cremedelaweb.com.br/>, taken from the hyperlink
embedded in the CV PDF. The other four have no `link` yet, so they show
"Case study coming soon".

## Adding an experiment

One object in the `EXPERIMENTS` array in `assets/js/site.js`, newest first. It renders
into the playground index, which shares the row language of the work index.

```js
{
  name: 'Naruto Fangame',
  year: '2026',
  kind: 'Turn-based JRPG · Battle demo',
  stage: 'Alpha',   // optional chip on the row; drop it when the thing is done
  link: 'https://luantgaion.github.io/nindo/'
                    // a URL turns the row into a link opening in a new tab;
                    // empty renders an inert row marked "In progress"
}
```

An experiment says how finished it is in three places, at three levels of detail:
the **stage chip** reads at a glance, the `kind` line names what actually exists,
and the destination speaks for itself. The chip is solid-bordered where the
"In progress" placeholder is dashed — one labels something you can open, the
other something you cannot.

The builder is guarded like every other, so it does nothing on the portfolio page,
where `#pgIndex` does not exist.

A row with no `link` is a `<div>`, not an anchor — inert by construction rather than
a link that goes nowhere. The row layout rules therefore cover `button`, `a` **and**
`.idle`; a new row type must be added there or it will render without its grid.

## Accessibility and support

- Keyboard navigable throughout, with a skip link and visible focus rings.
- The fixed header sets `pointer-events:none` so it never blocks the page behind
  it; **`.chrome a,.chrome button`** take those events back. Any new control added
  to the header must be covered by that rule or it will look fine and be unclickable.
- The project panel traps focus, closes on Escape, moves with the arrow keys, and returns
  focus to the project you were last viewing.
- `prefers-reduced-motion: reduce` disables every animation and shows all content immediately.
- The custom cursor and row-fill hover are disabled on touch devices.
- Reveals have a scroll-handler fallback, so a fast jump, a deep link or a restored scroll
  position can never leave a section stuck invisible.

### Verified

- No console errors; both fonts load and apply.
- **Responsive sweep** — no horizontal scroll, no clipped content, no stale
  canvas and no undersized tap target at 320×568, 360×740, 375×812, 414×896,
  568×320, 640×960, 768×1024, 844×390, 1024×1366, 1280×800, 1440×900,
  1920×1080 and 2560×1440. Landscape phone included.
- Every interactive control clears the 24px minimum hit area (the small ones
  get an invisible pseudo-element rather than padding, so nothing shifts).
- The vortex canvas was confirmed *actually revolving* by hashing its pixels
  across frames, not just by eye.
- Backdrop animations run only for on-screen sections; the canvas skips its
  draw entirely when off screen, and paints a single static frame under
  reduced motion.
- `--p` reads 0 at the top of the document and rises monotonically to 1 for
  every section; chrome tone resolves for all five with no gaps.
- Deep-linking to `#journey` reveals everything above it and strands nothing.

## Deploying

Static site, so any host works. For GitHub Pages: push this folder to a repository, then in
**Settings → Pages** pick the branch and the root folder. Netlify and Vercel need no build
command — the publish directory is this folder.
