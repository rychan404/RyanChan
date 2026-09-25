---
kind: "code"
title: "Loopline"
year: "JUN 2026"
blurb: "A CLI task runner that watches your project and reruns only what actually changed."
tags: ["Docker"]
role: "Maintainer"
stack: "Rust, tokio, notify"
outcome: "Cut the build loop from 40s to under 3s; 190 stars on GitHub"
slotHint: "Drop a terminal screenshot"
cta: "View Source"
---

Started as a personal itch — I was tired of rerunning a full test suite after changing one file. Loopline watches the filesystem, builds a dependency graph of what actually depends on what, and only reruns the slice of work that changed.

- Dependency graph diffing cut my own build loop from 40s to under 3s.
- Config is a twelve-line TOML file — no plugin system, on purpose.
- Currently at 190 stars and four outside contributors.
