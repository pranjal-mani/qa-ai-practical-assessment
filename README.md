# QA AI Practical Assessment

Playwright (Prism-style) automation for the Practice Software Testing Toolshop UI and API.

## Project Information

| Item | Location |
|------|----------|
| Framework | Playwright Test (JavaScript) |
| UI automation | `prism-toolshop-playwright/tests/ui/` |
| API automation | `prism-toolshop-playwright/tests/api/` |
| Page objects | `prism-toolshop-playwright/pages/` |
| API helpers | `prism-toolshop-playwright/api/` |
| Test data | `prism-toolshop-playwright/test-data/` |
| Manual test cases | `FunctionalTestCase.csv` |
| Project documentation | `project-info.md` |
| AI prompt history | `ai-prompts/` |
| Execution reports | `prism-toolshop-playwright/reports/` |

## Prerequisites

- Node.js 18+
- npm

## Setup

Install dependencies:

```bash
npm install
```

Install Playwright browser (Chromium):

```bash
npx playwright install chromium
```

## Run Tests

Full test suite (all UI and API tests):

```bash
npm test
```

Smoke tests (`@Smoke`):

```bash
npm run test:smoke
```

Regression tests (`@regression`):

```bash
npm run test:regression
```

UI tests only:

```bash
npm run test:ui
```

API tests only:

```bash
npm run test:api
```

Open the HTML report:

```bash
npm run test:report
```

## Reports

After execution, reports are generated at:

- HTML: `prism-toolshop-playwright/reports/html-report/`
- JSON: `prism-toolshop-playwright/reports/results.json`
