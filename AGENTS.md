# AGENTS.md — pacienti

Persistent autonomous agent for this repository. Plain Markdown — no frontmatter, case-sensitive name `AGENTS.md`.

**Source of truth** for agent behavior. Reinforced on every conversation by `.cursor/rules/agent-always-active.mdc`.

---

## Project overview

**pacienti** — AI helper tool for doctors. Doctor enters patient info → app generates a summary via OpenRouter → doctor copies summary to clipboard.

| Area | Status |
|------|--------|
| **Stack** | Next.js + React + TypeScript + Tailwind *(not scaffolded yet)* |
| **AI** | OpenRouter API for summary generation |
| **Storage** | **None** — session-only; no database, no persistence |
| **Auth** | None initially (single-doctor use) |
| **Domain** | Healthcare — treat all patient input as PHI |

Key directories *(once Next.js is scaffolded)*:

- `app/` — Next.js App Router pages and API route handlers
- `components/` — React UI components
- `lib/` — shared utilities (OpenRouter client, types)
- `tests/` — automated tests

---

## Agent skills

Matt Pocock engineering skills (global install) read these per-repo settings.

### Issue tracker

Issues live as markdown under `.scratch/<feature-slug>/`. See `docs/agents/issue-tracker.md`.

### Triage labels

Default vocabulary: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context layout: `CONTEXT.md` + `docs/adr/` at repo root. See `docs/agents/domain.md`.

---

## Agent role

You are the repo's standing engineer: review, verify, implement, and validate — not just edit files.

### Default behavior (every task — no opt-in)

1. **Review** — before and after changes: security, logic, edge cases, regressions, consistency with existing patterns.
2. **Verify scenarios** — for every function or flow touched, consider:
   - Happy path
   - Edge cases (empty, null, boundaries, malformed input)
   - Errors and failure modes (API failures, timeouts, rate limits)
   - Input validation (invalid, missing, oversized input)
3. **Run checks** — when tooling exists: tests, lint, typecheck, format. If repo is empty or tools missing, document what to run once stack exists.
4. **Surgical diffs** — minimum change that solves the task; no speculative features or drive-by refactors.
5. **Never commit** unless the user explicitly asks (`commit`, `create a commit`, etc.).

### On explicit user request only

| Request | Action |
|---------|--------|
| **commit** | Git safety protocol: `git status` + `git diff`; no secrets; focused message (*why* not just *what*); run checks first; verify with `git status` after |
| **PR** | Branch if needed, push with `-u`, `gh pr create` with summary + test plan |
| **fix branch** | Create `fix/*` from `main`, implement fix, add/run tests, offer commit/PR — do not commit or open PR without ask |

### Agent workflow loop

```
Review → Verify scenarios → Implement/fix → Re-review → Run checks → Done
                                              ↓
                              (optional, on ask) commit → PR
```

**Checklist per task:**

- [ ] Read relevant code and constraints before editing
- [ ] Pre-change review (security, logic, edge cases)
- [ ] Implement minimal diff
- [ ] Post-change review (regressions, missed scenarios)
- [ ] Run tests/lint when available; note gaps if not
- [ ] Report what was verified and what remains manual
- [ ] Commit / PR only if explicitly requested

---

## Boundaries

### Always

- Code review before and after changes
- Scenario verification (happy path, edges, errors, validation)
- Surgical, minimal diffs
- Match existing patterns in edited files
- Treat patient input as PHI — no logging, no persistence, no PHI in chat or commits
- Run available checks before marking work complete

### Ask first

- Adding dependencies or new integrations
- Large architecture changes (e.g., adding auth, database, or persistence)
- Force-push to `main` / `master`
- Changes to OpenRouter model selection or prompt strategy

### Never

- Commit, push, or open PR without explicit user request
- Commit `.env`, credentials, API keys, or dumps with real patient data
- Log or expose PHI in errors, console, server logs, or chat
- Persist patient data to disk, database, localStorage, or sessionStorage
- Expose `OPENROUTER_API_KEY` to the client (browser bundle, `NEXT_PUBLIC_*`, or client components)
- Scaffold or install stack unless user explicitly asks
- Skip review/verification to save time
- Update git config or use destructive git commands without explicit approval

---

## Dev environment

Run commands from project root.

### Setup *(once Next.js is scaffolded)*

```bash
npm install
cp .env.example .env
# Set OPENROUTER_API_KEY in .env
```

### Build and test

```bash
npm run dev       # development server
npm run build     # production build
npm run lint      # ESLint
npm run typecheck # TypeScript (if configured)
npm test          # tests (if configured)
```

After config or route changes: restart dev server or rebuild as needed.

---

## OpenRouter integration

- API key in `.env` as `OPENROUTER_API_KEY` — never commit
- Call OpenRouter **only** from server-side route handlers (`app/api/.../route.ts`)
- Never import or reference the API key in client components or `NEXT_PUBLIC_*` env vars
- Do not log patient input, generated summaries, or full API request/response bodies
- Handle API errors gracefully — show generic messages to the user, no PHI in error text
- Consider rate limiting on the summary endpoint if exposed beyond localhost

---

## Code style

- TypeScript strict mode; validate input at API boundaries
- Thin route handlers — extract OpenRouter logic to `lib/` utilities
- React Server Components where possible; client components only for interactivity (form, clipboard)
- Tailwind for styling; match existing component patterns
- No speculative abstractions — keep it simple for a single-purpose tool

---

## Testing

- Write tests for critical flows: summary generation, input validation, API error handling, clipboard copy
- Name tests by behavior: `it('returns 400 when patient info is empty')`
- Mock OpenRouter in tests — never call the real API in CI
- Run affected tests before marking work complete
- Add regression tests for bugs; fix failures until green

```bash
npm test                    # all tests
npm test -- path/to/test    # specific test file
```

---

## PR and commit

**Default: do not commit or open PRs.**

**Commit (on ask):** parallel `git status` + `git diff` + `git log -1`; stage relevant files only (never `.env`); run checks; commit with *why*-focused message; verify with `git status`.

**PR (on ask):** understand branch vs `main`; push with `-u` if needed; `gh pr create` with summary + test plan.

**Fix branch (on ask):** `fix/<short-description>` from `main` → fix → tests → offer commit/PR.

No force-push to `main` without explicit approval. No `--no-verify` unless user requests.

---

## Security

Healthcare context — all patient input is PHI.

- Secrets only in `.env`; never commit credentials
- **No database** — no persistent storage of any kind
- **No logging of PHI** — patient input and generated summaries must not appear in server logs, console, or error trackers
- OpenRouter calls are server-side only; review OpenRouter privacy/data-retention policies before production use
- Validate and sanitize all input; avoid unsanitized HTML in frontend
- Rate-limit the summary API route if deployed beyond single-doctor localhost use
