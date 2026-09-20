# Tenshi Lab

Tenshi Lab is a route-level, lazy-loaded experimental area of the portfolio. It shares the global language, theme, typography, and motion preferences, while keeping its own visual system.

## Routes

- `/lab/` — experiment index
- `/lab/dum/` — existing DUM experience, reused without duplication
- `/lab/debug/` — challenge selector
- `/lab/debug/python/basic/` — Python Basic / Test Chamber 01
- `/lab/debug/python/intermediate/` — Python Intermediate / Test Chamber 03
- `/lab/debug/python/hard/` — Python Advanced / Test Chamber 05
- `/lab/debug/javascript/basic/` — JavaScript Basic / Test Chamber 02
- `/lab/debug/javascript/intermediate/` — JavaScript Intermediate / Test Chamber 04
- `/lab/debug/javascript/hard/` — JavaScript Advanced / Test Chamber 06

The production build emits a real `index.html` for every route so direct navigation and refresh work on GitHub Pages.

## Challenge architecture

Challenge content and scoring live in the language modules under `src/lab/challenges/`. The interface is split across selector, narrative, editor, console, examiner, results, medal, and certificate modules. Both chambers reuse the presentation while providing distinct code, dialogue, hints, scoring, artwork labels, and execution adapters.

The Python and JavaScript adapters are deliberately isolated interpreters for the subsets needed by their chambers. Basic challenges cover mutation and arithmetic, intermediate challenges introduce return values and boolean reasoning, and advanced challenges require tracing two dependent transformations. The adapters do not use `eval`, do not access the network or filesystem, and validate each program's produced output rather than searching for a fixed answer string.

## Completion and privacy

Completion and best score may be saved in local storage. The participant name remains in memory only and is rendered directly into a client-side PNG. Certificates are explicitly labeled as portfolio challenge achievements rather than official accreditation.

## Chimuelo artwork

The final Chimuelo pixel-art portrait was generated from the owner's real reference photo and lives at:

`src/assets/lab/chimuelo-debug-examiner.png`

The former SVG/CSS placeholder is no longer used.
