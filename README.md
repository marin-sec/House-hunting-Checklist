# House Hunting Checklist

An interactive checklist for UK house buyers. Work through 10 phases, from online research to making an offer, so you don't miss anything important.

## Live Demo

**[Launch the Checklist](https://marin-sec.github.io/House-hunting-Checklist)**

## Screenshot

![checklist](https://img.shields.io/badge/checks-91_items-00ff9d?style=flat-square&labelColor=0d1117)
![phases](https://img.shields.io/badge/phases-10-00cfff?style=flat-square&labelColor=0d1117)
![export](https://img.shields.io/badge/export-txt-ffa94d?style=flat-square&labelColor=0d1117)

## Features

- **91 checklist items** across 10 phases covering the entire buying process
- **Severity tagging**: Dealbreaker / High / Check Later / Note
- **Per-item notes** for recording findings, measurements, agent quotes
- **Property name field** to track which house you're assessing
- **Export to .txt** file with all progress, tags, and notes
- **Filter views**: All / Remaining / Completed / Findings
- **Reset** to start fresh for the next property
- Fully client-side. No data leaves your browser.

## Phases

| # | Phase | Items |
|---|-------|-------|
| 0 | Pre-Search Preparation | 7 |
| 1 | Online Reconnaissance | 13 |
| 2 | The Agent Phone Call | 10 |
| 3 | The Physical Viewing | 12 |
| 4 | Maintenance & Systems Inspection | 8 |
| 5 | Structural Red Flags | 8 |
| 6 | Legal, Boundaries & Planning | 7 |
| 7 | Financial Assessment & Comparables | 8 |
| 8 | Neighbourhood Reality Check | 9 |
| 9 | Making the Offer & Post-Offer | 10 |

## Quick Start (Auto Setup)

```bash
chmod +x setup-house-checklist.sh && ./setup-house-checklist.sh
```

This will check for Node.js, scaffold a React app, inject the checklist, and launch it at `http://localhost:3000`.

## Manual Setup

```bash
git clone https://github.com/marin-sec/House-hunting-Checklist.git
cd House-hunting-Checklist
npm install
npm start
```

Opens at `http://localhost:3000`.

## Deploy to GitHub Pages

```bash
npm install --save-dev gh-pages
```

Add to `package.json`:

```json
"homepage": "https://marin-sec.github.io/House-hunting-Checklist",
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d build"
}
```

Then:

```bash
npm run deploy
```

## Contributing

Pull requests welcome. If you think of a check that saved you money or caught a problem, open an issue or PR.

## License

MIT
