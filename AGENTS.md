# AGENTS.md

## GITHUB ACCOUNT LIMITS

- EJN uses a free GitHub account and does not have GitHub Actions available.
- Do not depend on GitHub Actions, required CI checks, or hosted Actions runners to complete or verify work.
- Use direct verification, local/sandbox testing, or other available tools instead.
- Do not recommend upgrading GitHub solely to enable Actions unless EJN explicitly asks about paid options.

---

## NON-TECHNICAL OWNER WORKFLOW — MANDATORY

EJN does not review code or GitHub internals. Agents own the technical judgment and must show proof in chat.

- Never put unfinished or unverified work into `main`.
- One branch per active job. No backup, experiment, duplicate, or unrelated branches.
- Maximum two active coding lanes at once. Before changing shared areas, check the other active lane and avoid overlap.
- Make normal technical choices yourself. Do not ask EJN to choose libraries, Git methods, file structure, or test methods unless it changes what he will actually see or use.
- Before asking for approval, fix obvious issues, run relevant tests, confirm the project builds, check the actual feature/screen, and address known important review findings.
- Preserve unrelated working parts of the project. Do not reorganize or modernize outside the task.
- Do not claim success without verification.

### Proof shown to EJN
For visual work, show screenshots/images or before-and-after proof in chat. For functional work, explain in plain English what works and what was tested. EJN should not need to open GitHub.

When work is ready, report exactly:

```
RESULT:
What changed in plain English.

PROOF:
What was checked and the result. Include visible proof when appropriate.

KNOWN LIMITATIONS:
Anything unfinished, blocked, or uncertain. Write "None" if there are none.

READY TO PUSH:
Yes or No.
```

Then stop and wait.

### Meaning of "Push it"
When EJN says **"Push it"**, put the completed, tested work into `main`, confirm it is there, let the finished branch be removed when safe, and report back. EJN should never have to merge, rebase, cherry-pick, resolve conflicts, or supervise GitHub.

"Push it" does **not** mean deploy publicly. Do not deploy, publish, spend money, change production data, delete data, or take another hard-to-reverse external action without explicit authorization. If updating `main` would automatically deploy production, warn EJN first and wait.

Never merge work with known serious bugs, unresolved important review findings, a broken build, missing relevant testing, or a real conflict with another active lane. Fix those issues first.

Do not enable automatic merging. Do not depend on GitHub Actions or paid GitHub features; use direct verification instead.

If something goes wrong after "Push it", diagnose the cause, repair it if clearly within the approved task, verify the repair, and show the result without making EJN perform Git operations.

Normal workflow: EJN asks → agent builds safely → agent tests → agent shows proof → EJN says "Push it" → agent puts finished work in `main` → agent confirms it.

<!-- OWNER_IN_CHAT_VISUAL_EXPLORER_BEGIN: 2026-11-04 -->
## Owner-approved in-chat visual repository explorer (mandatory reporting)

**This is an instruction for the agent's reply inside the current ChatGPT conversation.** It is NOT a request to build, open, or update NBO Operations Hub, an external website, a separate dashboard, a graph file, or a new service. Never substitute a link to another dashboard for the in-chat visual.

- For **every project-related owner update, decision, review, or handoff**, begin with a mobile-readable GitDiagram-inspired visual map **inside the chat reply**. Show the whole repository/project structure at a useful overview level, and automatically highlight the feature, dependency, issue, or change under discussion. Use interactive native chat components if supported: click-to-expand nodes, zoom/pan, search, and a right-side or below-map detail inspector. Offer four navigable layers: **Experience map**, **Under the hood** (real repository paths and contents), **Changes & release** (branches, PRs, checks, deployments), and **Browse everything** (full indexed feature/asset inventory). On a short update the first view may be compact, but the full map must remain accessible. Do not crowd hundreds of items into unreadable nodes.
- Discover feature areas and their connected components from **current verified source**, including entry points, screens, games, activities, data, assets, media, tests, dependencies, unmounted features, branches and PRs. Include every discovered lesson/page/sheet or other indexed item via drilldown when relevant; label the inventory **partial** if exhaustive discovery was not done. Do not invent missing contents.
- Each feature's detail should explain in plain English: what exists, what it does, its dependent parts, source paths, proposed/current changes, what remains, exact version checked, and proof. Keep code and raw logs behind optional links/details; the owner must not need to read GitHub.
- Distinguish **agent claim → independently tested → merged into main → deployed → actually observed working live** as separate evidence milestones. Use project-specific owner status labels (for Cartilla: **DONE and live / DONE but not live / WAITING / NOT TESTED**); give dates and source links. Do not invent percentages, worker activity, screenshots, tests or live states. Mark stale, missing or inaccessible evidence as **unknown/not tested**.
- Include genuine screenshots, playable videos, before/after comparisons or working previews directly in chat **when available**; identify which version and device each proves. For consequential owner choices, show the actual proposed result and evidence, then a clear **YES / NO** decision where the UI supports it. A click alone does not authorize a merge/release outside its explicitly stated scope. Record an approved decision in the project's **existing** canonical issue or PR only with permitted authenticated write access and a confirmed successful write; do not claim persistence otherwise.
- Finish with **STATUS / RESULT / PROOF / WHAT REMAINS** and one clear next step. Preserve all existing product, security, privacy, independent-review, merging, spending, source-fidelity and deployment restrictions. No new dashboards, agents, duplicate queues, databases, monitoring, or unrelated changes solely to satisfy this reporting format.
- If the chat interface cannot render interactive visuals, show an actual readable diagram (Mermaid or a simple connected text map), structured expandable-equivalent detail and source links in the **same answer**. Be explicit that it is a static fallback; do not claim that unsupported controls work.
<!-- OWNER_IN_CHAT_VISUAL_EXPLORER_END -->
