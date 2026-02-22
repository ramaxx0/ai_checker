# Password Strength Checker (AI-style Scoring)

## Overview
This is a professional, educational web application that analyzes password strength in real time. It combines rule-based checks with an AI-style composite score to give clear explanations, actionable suggestions, entropy, and an estimated time to crack. All analysis runs locally in your browser.

## Features
- Real-time strength feedback with labeled levels and a color progress bar
- Explanations: why the password rates weak/strong
- Suggestions: concrete steps to improve strength
- Entropy estimate and time-to-crack approximation
- Checklist of best practices
- Dark mode with preference persistence
- No servers required; works as a static site
- Emoji removal and sanitized output across the site

## How It Works
- Rule-based analysis checks: length, character variety, common words, sequences, repeated characters, and single-class-only patterns.
- Composite scoring: base score from length and variety, minus penalties for risky patterns, plus small bonuses for very long, diverse passwords. Score maps to five levels.
- Entropy: estimated from the character set used and password length (bits = length × log2(pool)).
- Time-to-crack: derived from entropy with a high-speed offline guess rate assumption. Results are illustrative.
- Privacy: input stays in-memory and is never stored or sent anywhere. The analysis runs in a Web Worker for isolation.

## Security Considerations
- No password storage or transmission. The app performs all checks locally.
- No third-party analytics or network calls are required for the checker.
- Results are educational estimates and cannot guarantee security for every context.
- For production use, combine with rate limiting, strong hashing, and organizational policies.

## Technologies Used
- HTML, CSS, JavaScript (ES modules)
- Web Worker for the analysis engine

## Project Structure
```
.
├── index.html                # Home (Password Checker)
├── about.html                # Explainer page
├── privacy.html              # Security & Privacy page
├── assets/
│   └── styles.css            # Styles and theme
└── src/
    ├── app.js                # Home UI logic + worker wiring
    ├── app-basic.js          # Theme toggle and footer setup (all pages)
    ├── analysisWorker.js     # Worker entry; invokes the engine
    └── analysis/
        ├── score.js          # Composite scoring, levels, reasons, suggestions, checklist
        ├── entropy.js        # Entropy estimation
        ├── timeToCrack.js    # Friendly time-to-crack formatting
        └── patterns.js       # Common pattern detection and class utilities
```

## Run Locally
Option A: Open `index.html` directly in a modern browser.

Option B: Serve locally to avoid cross-origin module restrictions:

```bash
cd /Users/rama/ai_checker_password
python3 -m http.server 8080
```

Then open http://localhost:8080/ in your browser.

## Notes
- The app does not collect any data. Dark mode preference is stored in your browser’s local storage only.
- Strength guidance is approximate. Use unique, long, and varied passwords; consider using a password manager.

## Recent Changes
### Emoji Removal
- Implemented a Unicode-aware emoji filter in `src/utils/sanitize.js`.
- The app removes emojis from:
  - User inputs (e.g., password field) as you type
  - All displayed text nodes across pages at load and after dynamic updates
- Replaced all UI emoji icons with SVG or text labels to ensure no emojis appear anywhere.

### Light/Dark Mode Text Color
- In Light Mode, the global text color variable `--fg` is set to pure black (`#000000`) for maximum contrast.
- In Dark Mode, existing readable colors remain. All components inherit `color: var(--fg)` to stay legible.
- Theme toggle button labels now show “Dark” or “Light” and update on switch.
