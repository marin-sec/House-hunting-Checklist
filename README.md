# House Hunting Checklist

An interactive checklist for UK house buyers. Work through 10 phases, from online research to making an offer, so you don't miss anything important.

## Live Demo

**[Launch the Checklist](https://marin-sec.github.io/House-hunting-Checklist)**

Works on desktop and mobile. Your progress is saved locally in your browser.

## Features

- **91 checklist items** across 10 phases covering the entire buying process
- **Severity tagging**: Dealbreaker / High / Check Later / Note
- **Per-item notes** for recording findings, measurements, agent quotes
- **Property name field** to track which house you're assessing
- **Persistent storage**: checkmarks, notes, and tags survive closing the browser
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

## Run Locally

```bash
git clone https://github.com/marin-sec/House-hunting-Checklist.git
cd House-hunting-Checklist
npm install
npm start
```

Opens at `http://localhost:3000`.

## Quick Start (Auto Setup)

If you don't have a React environment set up:

```bash
chmod +x setup-house-checklist.sh && ./setup-house-checklist.sh
```

This checks for Node.js, scaffolds the app, injects the checklist, and launches it.

## Contributing

Pull requests welcome. If you think of a check that saved you money or caught a problem, open an issue or PR.

## License

MIT
