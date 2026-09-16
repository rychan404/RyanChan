---
kind: "code"
title: "Loopline"
year: "JUN 2026"
status: "In Progress"
blurb: "A CLI task runner that watches your project and reruns only what actually changed."
tags: ["Docker", "GitHub"]
role: "Maintainer"
stack: "Rust, tokio, notify"
slotHint: "Drop a terminal screenshot"
cta: "View Source"
ctaUrl: "https://github.com/example/loopline"
image: "./cover.png"
---

Started as a personal itch.

- Dependency graph diffing cut my own build loop from 40s to under 3s.
- Config is a twelve-line TOML file — no plugin system, on purpose.
