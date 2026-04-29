---
name: load-memory
description: >
  Loads context from the project's Obsidian vault at `obsidian/`. Reads relevant
  notes and surfaces the information into the conversation so Claude has full
  background before starting work. Use this skill whenever the user says
  "load memory", "load context", "what do you know about X", "remind me of",
  "/load-memory", or starts a new session and mentions a feature/area that likely
  has prior documentation. Also use it proactively at the start of any session
  where the user jumps straight into a topic without background — if you suspect
  there's a relevant note, go check rather than working blind.
---

# Load Memory

Load relevant context from the Obsidian vault into the current conversation.

## Vault location

```
/[project_root]/obsidian/
```

The index is `Home.md`. Notes are organized by module folders plus shared buckets:

- `obsidian/drivers/`
- `obsidian/fleet/`
- `obsidian/operations/`
- `obsidian/locations/`
- `obsidian/tenders/`
- `obsidian/financial/`
- `obsidian/safety/`
- `obsidian/analytics/`
- `obsidian/_core/` (global/shared notes)
- `obsidian/other/` (fallback when module is unclear)

---

## Step 1 — Identify the topic

**If the user provided a topic** (e.g. `/load-memory driver charts` or "what do you know about the map?"):
Extract the key terms and go straight to Step 2.

**If no topic was given** (bare `/load-memory` or vague opener):
Ask one focused question:

> "What area would you like me to load context for? (e.g. 'driver analytics', 'Jordan map', 'chart system', or just say 'everything')"

Don't ask multiple questions. One is enough.

---

## Step 2 — Find relevant notes

1. Read `Home.md` to see all available notes and their one-line descriptions
2. Search both:
   - `Home.md` index entries
   - module folders under `obsidian/` (including `_core` and `other`)
3. Match the topic against note titles and descriptions — use fuzzy matching, not exact strings
   - "map" → Jordan-Map-Heatmap
   - "charts" or "graph" → Driver-Analytics-Charts, Chart-System
   - "driver" → Driver-Show-Page, Driver-Analytics-Charts, Driver-Dashboard-Cleanup
   - "everything" → read Home.md fully and offer a summary of all areas
4. If multiple notes match, read all of them across folders

---

## Step 3 — Read the notes

Read each matched note in full. Then read any notes they link to via `[[wiki-links]]` if those links seem directly relevant to the user's question.

Don't read the entire vault blindly — be selective. Stop expanding when the linked notes are only loosely related.

---

## Step 4 — Present the context

Don't just dump the raw notes back. Synthesize:

```
## Context loaded: <Topic>

### What exists
<Summary of what was built/fixed in this area>

### Key technical details
<The non-obvious things — relationships, gotchas, decisions>

### Relevant files
<List of key file paths>

### Related areas
<Links to connected topics, if any>
```

End with: "I'm ready to continue from here — what would you like to do?"

---

## Step 5 — Offer to expand

After presenting, offer:
> "I also found notes on [[Related Note]] — want me to load that too?"

Only mention notes that genuinely add context, not everything in the vault.

---

## Tips

- If the topic matches nothing in the vault, say so clearly and offer to search the codebase instead
- If notes seem outdated relative to the code (e.g. a file path no longer exists), flag it
- For "load everything", give a high-level summary grouped by domain — don't read every note word for word, that's too much noise
- If two notes share a title across folders, disambiguate with folder path in your internal selection, but present clean note names to the user
