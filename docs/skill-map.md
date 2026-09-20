# Interactive Skill Map

## Scope

The graph is the evidence layer for the six projects currently visible in the portfolio and the five professional roles. It deliberately excludes hidden, empty, superseded, and unrelated projects. The visual layer consumes IDs and never imports React components into the data model.

The browser receives public repository evidence and an opaque `verified private source` marker only. Private repository names, commits, paths, fragments, and endpoints are not part of the client model or the public serializer.

## Sources inspected

| Source | Pinned commit | Accepted evidence |
| --- | --- | --- |
| `WaTenshi/portfolio-angel-cardenas` | `5973788fe90bdd221412f53a24458e768c587aa0` | Five roles and their declared production context |
| `WaTenshi/Landing-Journal-Fit` | `57c4d08b63dca1b6a64cceba8fd43808be4c48f1` | React, TypeScript, Vite, HTML and CSS landing surface |
| `WaTenshi/consultora-psicologica` | `c98278b17974d2ab12d78f8d90933efbcef2f571` | React/Vite UI, Firebase, EmailJS and GitHub Actions |
| `WaTenshi/sistema-certificados` | `63cfd551d00d8c94e0c892da9b0911673dc0499f` | React/TypeScript workspace, spreadsheet import and local document pipelines |
| `WaTenshi/susanariquelme-peluqueria` | `353fb4b34518579af0c10a8e991fe8ae17fb937d` | React/TypeScript/Vite, Firebase, Cloudinary, Excel and deployment |
| `WaTenshi/invitacion-boda-mariajose-cristopher` | `2691ba4bdff3f0753e1c12616f3366a6a6d8523d` | React/Vite, Tailwind and deployment |
| Private connector sources | not serialized | Mobile, data, cloud and production relations shown only as verified private evidence |

## Accepted and rejected relations

Relations are accepted only when a pinned public file, a verified private connector source, or the published professional experience supports them. Every edge carries evidence. Ecosystem edges are also evidence-backed; they are not inferred merely because two tools commonly appear together.

Rejected from the visible graph:

- SRLAR and TenshiGPT.
- Psicóloga Kimberly and Invitación Susana.
- Video Player Tenshi and any other hidden portfolio entry.
- Empty repositories and repositories without a relation to one of the six visible projects or five roles.
- Unverified percentages, proficiency scores, and generic technology claims.

## Architecture

- `src/data/portfolio/` is the shared project/experience source for the portfolio and terminal.
- `src/data/skillGraph/model.js` owns entities, evidence, explicit edges, tours, derived counters, inverse relations, priorities, filters, search aliases, and public serialization.
- `src/components/skill-map/` owns the accessible DOM nodes, decorative SVG edges, deterministic layouts, CSS 3D presentation, detail panel, URL state, search, filters, views, mobile mode and motion orchestration.
- Technology icons are resolved by logical ID in the visual layer.
- `SkillMapLoader` uses an intersection observer so the feature chunk loads shortly before the section enters the viewport.

All positions and ambient parameters derive from stable IDs. Motion writes CSS variables directly during pointer RAF work and is paused by section visibility, document visibility, the global motion control, or reduced-motion preferences. React state is not updated per animation frame.

## Deep links and integrations

Supported query parameters are `skill`, `skillProject`, `role`, `skillView`, `skillArea`, and `skillContext`. Entity selectors are mutually exclusive. The map works with `#stack`, history navigation, and the terminal commands `skills`, `skill <name>`, and `open skillmap`.

Architecture node mappings are validated against the explorer models. Opening and closing the modal preserves the map URL beneath the modal history entry.

Internal interaction events are emitted through `portfolio:skillmap` with the names `skill_selected`, `project_selected`, `experience_selected`, `architecture_opened`, and `guided_tour_started`. No analytics dependency is installed.
