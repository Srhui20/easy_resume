---
name: easy-resume
description: Use when working inside the easy_resume repository: planning structure, refactoring, adding resume editor features, touching PDF export, AI review, Zustand state, templates, or project conventions.
---

# easy_resume Repository Skill

This skill gives Codex repository-specific instructions for `easy_resume`, a Next.js resume editor.

## First Step

Read `PROJECT_STRUCTURE.md` and `AGENTS.md` from the repository root before making architectural or feature changes.

## Project Shape

- Next.js App Router, React, TypeScript strict.
- Main product: online resume editor with canvas editing, templates/themes, PDF export, AI review, local persistence.
- Zustand stores currently live in `src/lib/store`.
- Resume editor UI currently lives across `src/app/dashboard`, `src/components`, and `src/lib`.
- Target architecture is feature-first under `src/features/resume-editor`.

## Default Implementation Rules

- Keep `src/app/**/page.tsx` thin. Move editor logic into feature components/hooks/services.
- Put resume-editor-only code under `src/features/resume-editor`.
- Put cross-feature UI under `src/components/ui`.
- Put server helpers under `src/lib/server`.
- Put IO code such as API clients, localStorage, and downloads in `services`.
- Put DOM/event/state orchestration in hooks.
- Keep Zustand stores synchronous and free of DOM, `fetch`, and `localStorage`.
- Prefer pure utility functions for layout, history, and formatting logic.

## Naming Rules

- Directories: kebab-case.
- Components: PascalCase.
- Hooks: `useXxx.ts`.
- Stores: `xxxStore.ts`.
- Types: PascalCase.
- Do not create new code using existing misspellings like `resume_sytle`, `SystemDilaog`, or `useMouseOpeartion`.

## High-Risk Areas

- Undo/redo: avoid mutating arrays in place and use deep-copy snapshots.
- Resume templates: avoid import-time random UUIDs for stable templates.
- PDF export: ensure Puppeteer browser closes in `finally`; avoid debug console logs.
- AI review: use structured request data and appropriate status codes such as `429` for rate limits.
- Rich text HTML: treat external/imported HTML as untrusted.
- Persisted resume data: never store DOM refs.

## Validation

- Run `pnpm check` for most code changes.
- Run `pnpm build` for route, server, dependency, or broad TypeScript changes.
- If checks are not run, clearly say so in the final response.

