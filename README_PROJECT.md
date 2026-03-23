# Playwright Training Project

This repository contains a Playwright-based training project with a backend service, a frontend app, and end-to-end/API test scenarios.

## Project Structure

- `tests/`: Playwright test specs (`example.spec.ts`, `login.spec.ts`)
- `demoplaywright/back/`: Backend service and data reset utilities
- `demoplaywright/vite-app/`: Frontend app (Vite + React + TypeScript)
- `playwright.config.ts`: Playwright configuration
- `azure-pipelines.yml`: Azure DevOps CI pipeline for Playwright tests

## Prerequisites

- Node.js LTS
- npm

## Setup

Install all required website dependencies:

```bash
npm run installWebsite
```

## Run Application

Run backend and frontend together:

```bash
npm run runWebsite
```

Run separately:

```bash
npm run runBackend
npm run runFrontend
```

Reset training data:

```bash
npm run clearDatabase
```

## Run Tests

```bash
npx playwright test
npx playwright test --ui
npx playwright test --headed
npx playwright test --debug
```

## CI (Azure DevOps)

The `azure-pipelines.yml` pipeline:

- Triggers on `push` and `pull request` for `main` and `master`
- Installs Node.js LTS and dependencies
- Installs Playwright browsers
- Runs Playwright tests
- Publishes `playwright-report` as a pipeline artifact

## Notes

- `README.md` is intentionally ignored for future updates.
- Use this file (`README_PROJECT.md`) as the primary project documentation.
