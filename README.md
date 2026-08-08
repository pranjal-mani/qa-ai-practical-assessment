# QA AI Practical Assessment

Playwright (Prism-style) UI and API automation for the [Practice Software Testing Toolshop](https://practicesoftwaretesting.com).

## Project purpose

QA AI practical assessment covering manual test design, UI automation, and API automation for Toolshop flows: registration, login, profile, product search, cart, checkout (Cash on Delivery), double-confirm invoice generation, and My Invoices.

## Application URLs

| Target | URL |
|--------|-----|
| UI | `https://practicesoftwaretesting.com` |
| API | `https://api.practicesoftwaretesting.com` |

Configured in `prism-toolshop-playwright/test-data/test-config.json`.

## Tools and framework

| Item | Detail |
|------|--------|
| Test runner | Playwright Test `@playwright/test` ^1.51.0 |
| Language | JavaScript |
| UI browser | Chromium (Desktop Chrome device profile) |
| AI tooling | Cursor (see `ai-prompts/`, `project-info.md`) |
| Layout | Prism-style folders under `prism-toolshop-playwright/` |

## Prerequisites

- Node.js 18+
- npm
- Network access to the live UI and API hosts above

## Installation

```bash
npm install
```

## Browser setup

Install Chromium for UI tests:

```bash
npx playwright install chromium
```

UI tests run headless via the `ui-chromium` project in `playwright.config.js`.

## Environment variables

No custom environment variables are required. URLs are read from `test-config.json`.

Playwright uses `process.env.CI` only to enable `forbidOnly` and retries (`retries: 1` when `CI` is set). Tests do not use a `.env` file.

## Test data

Templates live in `prism-toolshop-playwright/test-data/`:

| File | Purpose |
|------|---------|
| `test-config.json` | UI/API base URLs and paths |
| `user.template.json` | Registration field shapes; `{unique}` email placeholder |
| `billing-ui.template.json` | Checkout billing scenarios + COD payment method |
| `search.template.json` | Search term |
| `billing-api-invalid.template.json` | API invoice body for 422 billing validation |
| `invoice-payload.template.json` | Valid COD invoice body; `{cartId}` filled at runtime |

**Runtime rules:** Specs generate unique emails, passwords, tokens, product IDs, cart IDs, and invoice IDs at run time. Do not commit real credentials or run-specific IDs.

Manual test data patterns are documented in `FunctionalTestCase.csv`.

## Run commands

| Goal | Command |
|------|---------|
| UI tests only | `npm run test:ui` |
| API tests only | `npm run test:api` |
| Smoke (`@Smoke`) | `npm run test:smoke` |
| Regression (`@regression`) | `npm run test:regression` |
| Full suite (UI + API) | `npm test` |
| Open HTML report | `npm run test:report` |

Equivalent direct commands:

```bash
npx playwright test --project=ui-chromium
npx playwright test --project=api
npx playwright test --grep @Smoke
npx playwright test --grep @regression
npx playwright test
npx playwright show-report prism-toolshop-playwright/reports/html-report
```

## Reports and evidence

| Artifact | Location |
|----------|----------|
| HTML report | `prism-toolshop-playwright/reports/html-report/` (open via `npm run test:report`) |
| JSON results | `prism-toolshop-playwright/reports/results.json` |
| Failure screenshots / videos | `test-results/` (created on failure; `screenshot: only-on-failure`, `video: retain-on-failure`) |
| Execution summary | `EXECUTION-SUMMARY.md` |
| Manual cases | `FunctionalTestCase.csv` (not automated) |

## Folder structure

```
qa-ai-practical-assessment/
├── readme.md
├── EXECUTION-SUMMARY.md
├── project-info.md
├── FunctionalTestCase.csv
├── package.json
├── playwright.config.js
├── ai-prompts/
├── .cursor/rules/
└── prism-toolshop-playwright/
    ├── api/                 # API helpers
    ├── pages/               # UI page objects
    ├── test-data/           # Config and JSON templates
    ├── tests/
    │   ├── ui/              # 8 UI specs (TC-UI-001–008)
    │   └── api/             # 8 API specs (TC-API-001–008)
    └── reports/             # HTML + JSON output
```

## Test inventory

16 automated tests in 10 spec files (`npx playwright test --list`):

- **UI (8):** `registration`, `auth-profile`, `products`, `cart`, `checkout-billing`, `checkout-invoice`
- **API (8):** `auth`, `products`, `cart`, `invoice`
- **Tags:** `@Smoke` on TC-UI-003, TC-UI-008, TC-API-003, TC-API-008; `@regression` on all automated cases

## Known limitations

- **Live demo SUT:** Tests depend on `practicesoftwaretesting.com` and `api.practicesoftwaretesting.com`; availability, stock, and response times can vary.
- **In-stock selection:** Cart and checkout UI tests use `openInStockProductByIndex()` to skip out-of-stock products; invoice generation is async and may need polling after double Confirm.
- **Single worker:** `workers: 1` in `playwright.config.js` to reduce load on the shared demo environment.
- **Manual suite:** Eight cases in `FunctionalTestCase.csv` are not executed by Playwright; status is tracked separately in the CSV.
- **No local app:** There is no local server; outbound HTTPS is required.

## Troubleshooting

| Issue | What to check |
|-------|----------------|
| `browserType.launch` / missing browser | Run `npx playwright install chromium` |
| Timeouts on UI tests | Confirm UI URL is reachable; retry when the demo site is slow |
| `add-to-cart` disabled / timeout | Demo product may be out of stock; page objects skip disabled buttons — retry if the site is slow |
| Invoice `INV-` not on page | Async invoice after double Confirm; retry checkout test or check `test-results/` video |
| API 401 / 409 / 422 | Expected for negative API cases; check spec assertions |
| Empty HTML report | Run `npm test` (or a subset) first; reports are written after execution |
| Report command does nothing | Ensure `prism-toolshop-playwright/reports/html-report/index.html` exists from a prior run |

## Related documentation

- `project-info.md` — confirmed behavior, risks, traceability, automation plan
- `ai-prompts/` — prompt history by phase
- `EXECUTION-SUMMARY.md` — latest recorded automation run results
