---
kind: "code"
title: "ResolveStock"
year: "JUL 2026"
blurb: "A desktop app that searches free stock cutouts and vectors, keeps each file's license, and drags them straight into DaVinci Resolve."
tags: ["Python", "DaVinci Resolve"]
role: "Solo Developer"
outcome: "Searches Openverse, Wikimedia Commons and Pixabay in one window"
links:
    github: "https://github.com/rychan404/davinci-resolve-plugin"
---

# Overview

As a video editor, I always come across something that bugs me the most. When I need material, I am forced to leave the editor, search through random sites, and lose the file as soon as it lands in a downloads folder. ResolveStock searches free stock sources in one window, downloads the asset you pick with its license attached, and lets you drag it straight into Resolve's media pool. It works with the free version of Resolve.

# How it works

- **Search**: One search across Openverse, Wikimedia Commons and Pixabay, with filters for transparent images and vectors.
- **Download**: Double-click a result to download it,
- **Drag**: Drag the file from the library tray into Resolve's media pool.
- **Credit**: Export a credits list when a project uses assets that require attribution.
- Commercial-safe filtering is on by default, so non-commercial, share-alike and unknown licenses are left out.

# Challenges

- **No plugin surface**: I set out to build a Resolve plugin, but the free version of Resolve has no plugin surface for this workflow. I built a standalone desktop app instead, and dragging files into the media pool covers the same need.
- **Rate limits**: Loading thumbnails too fast got me 429 errors from the image servers. I added rate limiting and retries, then made the app recover its request pace faster after a 429.
- **Loading every preview**: Fetching previews for the whole results grid was slow, so the app now fetches previews only for the tiles on screen.
- **Broken previews and downloads**: SVG thumbnails didn't render, and downloads could stop halfway because their workers were cleaned up too early. I fixed both, and failed previews now show as failed instead of loading forever.

# What I learned so far

- How to build a desktop app with PySide6 (Qt), with the network work kept off the main thread.
- How to be a good API client: caching Pixabay responses for 24 hours and backing off when a server says slow down.
- How to test code that talks to the internet without calling it: every source adapter is tested against saved JSON responses.

# Future plans

- **Vecteezy**: Add it as the fourth source once my API key application is approved.
- **Sound effects**: Bring in Freesound, which needs an OAuth sign-in flow first.
- **VFX elements**: Add pre-keyed VFX elements, but only after testing whether Pixabay and Vecteezy have enough of them. The sites that specialize in them have no public APIs.
- **Documentary B-roll**: Add Internet Archive as a source for documentary editors.