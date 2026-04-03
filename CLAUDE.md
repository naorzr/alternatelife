@AGENTS.md

# Anti-Bloat Rules

AI-assisted development structurally trends toward bloat. Every session must actively resist this.

## Why This Exists

- AI feels no pain from complexity — each session starts fresh, accumulated mess is invisible
- Addition feels productive; removal does not — new code looks like progress, deletion looks like regression
- "What if we need this later?" leads to over-engineered solutions nobody asked for
- Systems get built but never wired in — pure overhead with zero functionality
- Each session adds a little; after 20 sessions the codebase is incomprehensible

## Per-Session Rules

1. **Hard line limits**: Components max 200 lines, pages max 300 lines, utility files max 150 lines. If a file exceeds this, split or trim before adding more.
2. **Removal mandate**: Every change that adds code must also remove code where possible. Net-negative line count is a win.
3. **Wire-in requirement**: If something has an export, it must be imported somewhere. If it has a function, it must be called. Otherwise delete it.
4. **No orphaned code**: Dead code is deleted immediately — not commented out, not kept "for reference."
5. **No speculative features**: Only build what was asked for. A simple component doesn't need 5 props "for flexibility." A util doesn't need 3 overloads "just in case."
6. **No parallel duplication**: If two components or utils do overlapping things, consolidate into one. Don't keep both.

## When You Notice Bloat Mid-Task

Do not defer. If the file you're editing is over the limit:
1. Trim first — delete dead code, consolidate duplicates, remove unused imports/props/state
2. Then make your actual change
3. The change should show a net negative or small positive line count

## What "Minimal" Means

- **Wrong**: Add a 40-line wrapper component with loading states, error boundaries, and animation hooks for something that needs 3 lines of JSX
- **Right**: Add the 3 lines of JSX

If the fix is more than 10 lines, ask: "What am I adding that I don't need?"
