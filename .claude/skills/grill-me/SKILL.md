---
name: grill-me
description: >
  Interview the user relentlessly about a plan or design until shared understanding,
  one question per turn only — never batch multiple questions in a single message.
  Use when the user wants to stress-test a plan, get grilled on their design, or says
  "grill me". Other skills (e.g. save-memory) may invoke this style; same one-question rule applies.
---

# Grill me

Stress-test a plan or design by walking the decision tree until every branch is resolved.

## Non-negotiable: one question per message

**You MUST ask exactly one question per assistant turn.** The user answers. Then you ask the next question in a *new* turn.

| Do | Do not |
|----|--------|
| End your message with a single clear question | Paste 2+ questions in one reply |
| Wait for the user's answer before continuing | Use numbered lists like "1) … 2) … 3) …" as separate questions |
| Optionally show a **recommended answer** right under that one question | Ask "A or B?" and "Also, C or D?" in the same message |
| Say "Question 3 of ~6" if helpful — still only one question follows | Bundle sub-questions ("What X, and what Y, and what Z?") |

If you catch yourself writing more than one `?` that expects distinct answers, **delete the extras** and keep only the first unresolved branch.

## Flow

1. **Pick the next unresolved branch** — the decision that blocks or depends on other choices.
2. **Ask one question** about that branch. Include your **recommended answer** (what you would pick and why) so the user can agree or override quickly.
3. **Stop.** Do not ask another question until the user replies.
4. **Record the answer** (mentally or briefly acknowledge), then go to step 1.
5. **Stop grilling** when the tree is resolved or the user says they're done.

## Codebase over guessing

If a question can be answered by exploring the codebase, **explore first**, then ask only if still ambiguous — still **one question** if you need the user.

## If the user answers multiple things at once

That's fine — acknowledge all of it, then ask **one** follow-up for the next open branch.

## Tone

Direct and thorough, not apologetic about the pace. You're going deep, just **serially**, not in a questionnaire dump.
