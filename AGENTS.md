# Repository Guidelines

## Project Structure & Module Organization
- Core server logic lives in `server.js`, exposing `/api/generate-image` and `/api/health` while serving the static site from the project root.
- Static pages (`index.html`, `wizualizator-tortow.html`, legal pages) sit alongside shared assets: `styles.css`, `scripts.js`, and the `images/` directory.
- Content directories such as `blog/` and `brandbook/` hold long-form copy and design collateral; keep generated assets inside `images/` or nested folders to avoid cluttering the root.
- Store secrets in a root `.env` (ignored by Git); at minimum define `OPENAI_API_KEY`.

## Build, Test, and Development Commands
- `npm install` — install Node/Express dependencies; rerun after adding packages.
- `npm start` — launch the Express server on `http://localhost:3001` for production-like runs.
- `npm run dev` — same as `npm start`, useful when pairing with file watchers such as `nodemon`.
- `npm run build` — currently a no-op; extend it if you introduce bundling or asset pipelines.

## Coding Style & Naming Conventions
- JavaScript uses ES modules, `async/await`, and 2-space indentation; prefer early returns for validation (see `server.js:17`).
- Name new HTML files with lowercase kebab-case (`new-feature.html`) and match accompanying assets (`new-feature.css`, `new-feature.js`).
- Reuse CSS custom properties from `styles.css` and keep new variables scoped under a comment heading describing their purpose.
- Log only helpful, redacted diagnostics; strip noisy `console.log` statements before merging.

## Testing Guidelines
- No automated suite exists yet; add HTTP-level coverage with `supertest` or similar in a `tests/` directory (e.g., `tests/api.spec.mjs`) and wire it to an `npm test` script.
- For manual checks, verify the health endpoint with `curl http://localhost:3001/api/health` and confirm the visualizer flow end-to-end in `wizualizator-tortow.html`.
- When adding API changes, document expected payloads and consider snapshotting prompts or image metadata for regression detection.

## Commit & Pull Request Guidelines
- Follow the existing short imperative style (`git log` shows examples like “ui fixes”); keep messages under ~60 characters and elaborate in the body if needed.
- Each PR should outline the problem, the solution, and testing notes; attach screenshots or screen recordings for visual tweaks.
- Link related Jira/Trello tasks or GitHub issues in the description, and flag any environment variable changes so reviewers can update their `.env`.
