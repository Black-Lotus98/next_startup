---
name: save-memory
description: >
  Saves structured knowledge to the project's Obsidian vault at `obsidian/`.
  Has two modes: (1) save a specific note/concept the user wants to document,
  or (2) save a summary of the current session's work. Before writing, it
  grills the user with targeted questions (using the /grill-me technique) to
  extract the highest-quality memory possible. Creates well-formatted markdown
  with Obsidian wiki-links and bidirectional connections to related notes.
  Use when the user says "save memory", "save session", "save note",
  "document this", "remember this", "/save-memory", or at natural session end
  points when significant work was done. Offer proactively if the session
  involved meaningful changes.
---

# Save Memory

Save structured knowledge to the Obsidian vault — either a specific concept or a session summary.

## Vault location

```
/[project_root]/obsidian/
```

Index file: `Home.md`.

Vault architecture is module-based:

- `obsidian/<module>/` (e.g. `drivers`, `fleet`, `operations`, `locations`, `tenders`, `financial`, `safety`, `analytics`)
- `obsidian/_core/` for global/shared notes
- `obsidian/other/` for classification fallback when module placement is unclear or fails

---

## Step 0 — Ask what to save

Present the user with a choice:

> **What would you like to save?**
>
> 1. **Session summary** — document what we worked on this session
> 2. **Specific note** — save a concept, decision, pattern, or piece of knowledge
> 3. **Both** — session summary + a standalone note on a specific topic

Wait for an answer before proceeding. If the user already made it clear in their message (e.g. "save what we did today" → session, "save a note about our enum pattern" → specific note), skip this question.

---

## Step 1 — Grill for quality (the /grill-me pass)

Before writing anything, interrogate the user to extract a complete, high-quality memory.

**Hard rule (same as the grill-me skill):** ask **exactly one question per assistant message**, wait for the reply, then ask the next. Never send a numbered list of multiple questions in one turn.

Use the question *ideas* below as a **sequence** across turns (pick 2–4 total), not as a single message. Adapt based on the save mode:

### For session summaries:

1. "What was the **main problem** we solved or feature we built?"
2. "Were there any **key decisions** where we picked one approach over another? What was rejected and why?"
3. "Is there anything that **surprised you** or that you'd want future-you to know before touching this area again?"
4. "Any **loose ends** — things we didn't finish, or follow-up tasks?"

### For specific notes:

1. "Give me the **one-sentence version** of what this note should capture."
2. "**Why** does this matter? What breaks or gets confusing without this knowledge?"
3. "Is there a **code example** or **file** that best illustrates this?"
4. "Does this **replace or update** anything we already documented?"

### Rules for grilling:

- **2–4 questions max across the whole pass** — one per turn, not one message with four questions
- If a question can be answered by **exploring the codebase**, do that instead of asking
- Provide your **recommended answer** with each question so the user can just confirm or correct
- If the user says "just save it" or seems impatient, stop grilling and work with what you have
- Use the conversation history as your primary source — the grill pass fills gaps, not replaces context

---

## Step 2 — Read existing notes for context

Before writing:

1. Read `Home.md` to see the full index and all existing note titles
2. Scan module folders (`obsidian/*/`) to find overlapping notes
3. Read the content of overlapping notes to avoid duplication and to identify link targets

If the new memory **updates or extends** an existing note, prefer editing that note over creating a new one. Ask the user: "This seems related to [[Existing Note]] — should I update that one or create a new note?"

---

## Step 3 — Write the note

Create `<Topic-Title>.md` in the correct folder (not vault root). Use kebab-case with Title-Case words (e.g. `Enum-Pattern-Conventions.md`).

Placement rules (in order):

1. Place in the best matching module folder under `obsidian/<module>/`
2. If the note is truly cross-cutting/shared, place in `obsidian/_core/`
3. If module classification is unclear or placement fails, place in `obsidian/other/`

Do not block saving on perfect classification. Prefer saving to `other/` over asking many follow-up questions.

### Note template — Session Summary

```markdown
# <Session Title>

**Date:** YYYY-MM-DD
**Type:** Session Summary
**Files changed:**
- `path/to/file1.ext` — what changed
- `path/to/file2.ext` — what changed

---

## Problem / Goal

What we set out to do and why.

---

## What Changed

### <Subsection per logical area>

- The problem or requirement
- The approach taken
- Key decisions made (and alternatives rejected)

Use code blocks for important snippets — not full files, just the meaningful parts.

---

## Decisions & Trade-offs

| Decision | Chosen | Rejected | Why |
|----------|--------|----------|-----|
| ... | ... | ... | ... |

(Omit this section if no significant decisions were made)

---

## Gotchas & Things to Know

Anything future-Claude needs to know to work in this area without re-discovering it.
Non-obvious relationships, naming conventions, data flow, pitfalls.

---

## Loose Ends

- [ ] Unfinished task or follow-up
- [ ] Another thing to revisit

(Omit if nothing is pending)

---

## Related Notes

- [[Note Name]] — how it connects
```

### Note template — Specific Note

```markdown
# <Topic Title>

**Date:** YYYY-MM-DD
**Type:** Knowledge Note

---

## What This Is

1–3 sentences: the core concept or pattern being documented.

---

## Details

The full explanation. Include:
- Why this exists / why it matters
- How it works (with code examples where useful)
- Where it lives in the codebase (key file paths)

---

## Example

```lang
// A concrete code example that illustrates the concept
```

(Omit if not applicable)

---

## When to Use This

Guidance on when this pattern/concept applies. Conditions, edge cases, exceptions.

---

## Related Notes

- [[Note Name]] — how it connects
```

---

## Step 4 — Connect to the graph

### 4a. Update Home.md

Read `Home.md`, find the right domain section, and add:

```markdown
- [[New Note Title]] — one-line description
```

If no existing section fits, create a new one with an appropriate emoji header. Keep sections sorted by domain (Data & Schema, Driver Module, Dashboard & Maps, Infrastructure, Patterns & Conventions, etc.).

When relevant, include the folder hint in the one-line description (e.g. "stored in `fleet/`") to make navigation easier during migration.

### 4b. Add back-links to related notes

For every note linked in the "Related Notes" section of the new note:

1. Open that related note
2. Find its "Related Notes" section (create one if missing)
3. Add a back-link to the new note with a one-line description

This keeps the Obsidian graph **bidirectionally connected**.

### 4c. Check for updates to existing notes

If the new memory contradicts or supersedes information in an existing note:

- Update the existing note with a notice at the top:
  ```markdown
  > **Updated:** See [[New Note]] for the latest on <topic>.
  ```
- Don't delete old content — future-Claude might need the history

---

## Step 5 — Confirm with the user

After saving, present a short summary:

> **Memory saved:** [[Note Title]]
>
> - Connected to: [[Note A]], [[Note B]]
> - Home.md updated under: <section name>
>
> Anything to add or change?

---

## Quality bar

A good memory note answers these without needing to re-read the code:
- **What** was the problem or concept?
- **What** changed and where?
- **Why** was it done this way (not another)?
- **What** should the next developer know before touching this area?

A bad note is just a file list or a vague "updated the component". The grill pass exists to prevent that. Go deeper.
