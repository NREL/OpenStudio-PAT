# ADR 0001: AngularJS 1.8 end of life: direction and sequencing

- Status: **Proposed / preliminary.** Draft for maintainer review. No code changes. It does not satisfy all of #343's acceptance criteria (see "Evidence still required").
- Issue: #343
- Date: 2026-10-13
- Related: #340 (Electron), #338 (host Node), #339 (deprecated npm packages), #290 (broken Playwright tests)

## Context

The PAT renderer is an AngularJS 1.8.3 single-page app (`app/app/`). AngularJS reached end of life in January 2022
and receives no upstream fixes.

### Measured inventory (develop @ 0f15236)

Method: count of files and `cat | wc -l` lines for `*.js`, `*.html`, `*.scss` under `app/app/` (includes the static
`reports/projectReports/*.html`).

| Source type | Files | Lines |
|---|---:|---:|
| JavaScript | 50 | 15,028 |
| HTML | 50 | 4,923 |
| SCSS | 3 | 951 |
| Total | 103 | 20,902 |

The file count and total match the issue's 103 files / 20,902 LOC baseline; the issue's per-type split (14,952 JS / 3,022 HTML) does not sum to that total, so use this table.

JS+HTML lines by area: project 6,472 · analysis 3,847 · bcl 2,321 · run 1,620 · translations 1,028 · outputs 613 ·
main 532 · design_alts 499 · reports ~220 · status_bar 115 · server 81 · nav 71.

Hotspots: `project/projectService.js` 3,574 · `analysis/analysisController.js` 1,724 · `project/osServerService.js` 1,440.

Automated renderer test coverage in CI: none. Playwright specs exist in `playwright/` but are broken (#290) and the workflow is
disabled. The only CI check that launches the app is the startup smoke test proposed in PR #348.

### Dependency matrix (declared ranges in `app/package.json`; npm status checked 2026-10-13)

Resolved versions are in `app/package-lock.json`; per-package source usage and vendor-support coverage are **not yet** evidenced (see below).

| Package | Declared | npm latest | npm status | Replacement direction |
|---|---|---|---|---|
| angular | ~1.8.3 | 1.8.3 | deprecated (EOL) | framework choice |
| angular-animate | ~1.8.3 | 1.8.3 | deprecated | framework/CSS |
| angular-aria | ~1.8.3 | 1.8.3 | deprecated | framework |
| angular-messages | ~1.8.3 | 1.8.3 | not flagged | framework forms |
| angular-resource | ~1.8.3 | 1.8.3 | deprecated | `fetch`/HTTP client |
| angular-sanitize | ~1.8.3 | 1.8.3 | deprecated | DOMPurify / framework |
| angular-ui-router | ~1.0.30 | 1.1.2 | not flagged | new router |
| angular-ui-router.statehelper | ~1.3.1 | 1.3.1 | not flagged | new router |
| angular-ui-bootstrap | ~2.5.6 | 2.5.6 | not flagged | UI kit |
| angular-bootstrap-checkbox | ~0.5.0 | 0.5.0 | not flagged | native input |
| angular-ui-grid | ~4.11.1 | 4.12.7 | not flagged | data-grid library (largest gap) |
| ui-grid-draggable-rows | ~0.3.3 | 0.3.3 | not flagged | grid library feature |
| angular-translate | ~2.19.0 | 2.19.1 | deprecated ("no longer supported") | i18n library |
| angular-translate-handler-log | ~2.19.0 | 2.19.1 | deprecated | i18n library |
| angular-toastr | ~2.1.1 | 2.1.1 | not flagged | toast library |
| ngprogress | ~1.1.3 | 1.1.3 | not flagged | progress bar |
| bootstrap-sass (Bootstrap 3) | ~3.4.3 | 3.4.3 | not flagged | Bootstrap 5 / other |

"Not flagged" means npm shows no deprecation message; it says nothing about whether the package is maintained.

### Coupling and exposure

- `app/background.js`: `nodeIntegration: true`, `contextIsolation: false`, `webSecurity: false`, `webviewTag: true`, `@electron/remote`; no CSP.
  Renderer code uses Node APIs directly, so a renderer XSS would be local code execution.
- External script loads: `https://unpkg.com/default-passive-events` in `app/index.html` (loaded at startup), and a Bootlint script from `maxcdn.bootstrapcdn.com` injected on demand by `$window.lint()` in `app/app/index.run.js` (not a normal startup dependency).
- A framework migration and the Electron isolation work (#340) touch the same code (every direct Node/remote use in the renderer).
  Doing them in the wrong order means rewriting privileged code twice.

## Options

Effort entries are rough author planning judgments, not team estimates, and should be replaced with team input.

| Criterion | 1. Stay + extended support | 2. Hybrid ngUpgrade to Angular | 3. Incremental replacement by route | 4. Full rewrite / simplify |
|---|---|---|---|---|
| Security support | Vendor patches for covered packages only | Shrinks AngularJS surface over time | Same, per route | Best end state |
| Coverage gaps | Vendor coverage of ui-grid, ui-grid-draggable-rows, toastr, bootstrap-checkbox is unconfirmed (issue says not publicly listed) | Same until migrated | Same until migrated | None |
| Electron compatibility | No help; #340 still needed | Helps if done with an IPC boundary | Best fit with an IPC/preload boundary | Cleanest |
| Effort | Low engineering, recurring licence cost | High (months), two frameworks at once | Medium-high, spread out | Highest |
| Regression risk | Lowest | High with no test net | Medium, bounded per route | High |
| Reversibility | High | Low | High per route | Low |
| Needs working tests first | No | Yes | Yes | Yes |

## Proposed direction (conditional on the evidence gates below)

1. **Do not start a framework migration now.** There is no test net and the Electron boundary work (#340) is unresolved.
2. **Proposed sequence:** (a) restore a runnable E2E/smoke path (#290; PR #348 is the first step); (b) settle OS/Node floors (#338, #341) and do the Electron bump plus preload/IPC hardening (#340); (c) then, if the gates below pass,
   migrate **incrementally by route/feature (Option 3)**, starting with leaf features (status bar, nav, outputs) and ending with the `project/` and `analysis/` hotspots. Choose the target framework at the start of (c).
3. **Extended support (Option 1) is at most a bridge.** Whether to buy it depends on inputs not available here (see below); this ADR makes no go/no-go call on it.
4. Framework-independent risk reductions can proceed any time: remove the `unpkg.com` and Bootlint CDN loads, and add a Content-Security-Policy once the renderer no longer needs them.

## Evidence still required before this can be accepted

- Per-feature/route inventory with interfaces (renderer-to-main, renderer-to-server), complexity tier and coverage.
- Per-package source usage and locked versions from `app/package-lock.json`.
- Vendor extended-support coverage list for the exact packages, quote/contributor-based pricing, SLA terms.
- PAT product horizon and staffing/time budget; an owner and milestone.
- Bounded follow-up issues for the chosen direction.

## Consequences

- AngularJS and the deprecated Angular packages remain in the shipped app for the foreseeable future; exposure is mitigated only by the planned isolation work and CDN removal, not eliminated.
- Revisit this ADR when #340 lands or when the E2E suite works.
