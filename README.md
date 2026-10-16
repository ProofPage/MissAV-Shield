# MissAV Shield — Clean & Seamless Player

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Userscript](https://img.shields.io/badge/Userscript-Tampermonkey%20%7C%20Violentmonkey-green.svg)](#installation)

**MissAV Shield** is a high-performance, lightweight userscript designed for MissAV. It removes all intrusive advertisements, third-party widgets, and clutter from the video watch page, while enabling uninterrupted background playback, auto-expanding video descriptions, and displaying full, untruncated titles everywhere.

---

## Key Features

- **Continuous Background Playback**:
  - Virtualizes document visibility attributes (`document.hidden`, `visibilityState`) so playback never stops when switching tabs or minimizing the browser.
  - Drops site-level blur and visibility event listeners that trigger automatic pausing.

- **Complete Ad & Tracker Blocking**:
  - Eliminates floating banners, bottom-right popup windows, outstream video ads, and sponsored text lists (casinos, VPNs, etc.).
  - Defuses third-party tracking scripts, in-page live cam widgets (`StripchatSpot`), and ad iframes.
  - Neutralizes popup triggers (`window.open`) preventing redirect loops and new tab spam.

- **Full Titles & Immediate Description Display**:
  - Un-clamps video titles in both the main grid and sidebar recommendation lists so you always see complete names without truncation.
  - Automatically expands the full synopsis/description on video pages, eliminating the need to click `> Show more`.

- **Refined, Clutter-Free UI**:
  - Removes the bloated action bar (Save, Playlist, Download, Share, etc.) directly below the player.
  - Optimizes layout spacing between the video title and detail tabs for a polished, comfortable browsing experience.

---

## Installation

1. Install a userscript manager extension in your browser:
   - [Violentmonkey](https://violentmonkey.github.io/) (Recommended)
   - [Tampermonkey](https://www.tampermonkey.net/)
2. Open the userscript installation URL:
   - Click to install [`MissAV_Shield.user.js`](https://raw.githubusercontent.com/ProofPage/MissAV-Shield/main/MissAV_Shield.user.js).
3. Confirm the installation prompt in your userscript manager.
4. Visit MissAV to enjoy a clean, fast, and distraction-free viewing experience.

---

## Supported Domains

- `missav123.com`
- `missav.ws`
- `missav.live`
- `missav.ai`
- `missav.com`
- `thisav.com`
- `*.missav.fans`
- `*.missav.media`

---

## License

This project is licensed under the [MIT License](LICENSE).
