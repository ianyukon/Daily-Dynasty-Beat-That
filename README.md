# Beat That

An all-time sports roster-drafting game.

## Files (upload ALL of these, keeping the public folder as a folder)
- index.html
- main.jsx
- BeatThat.jsx   <- the game
- package.json
- vite.config.js
- public/og-image.png   <- link-preview image (keep it inside the public folder)

## Updating the game later
Replace BeatThat.jsx with the new version (GitHub: open file > pencil/Edit > select all > paste > Commit). Vercel rebuilds automatically.

## Notes
- Challenge LINKS: when texted, they show a preview card; tapping opens the exact
  challenged board (the code travels in the URL ?c=...). The preview image is generic
  for now. A custom per-challenge image would need a serverless function (future upgrade).
- Saved data (streaks, stats) is per-device in the browser.
- Player data is from memory; verify before any public launch.
