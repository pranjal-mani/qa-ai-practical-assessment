# Session Summary

Consolidated summary of the QA AI practical assessment work captured across this Cursor chat session (2026-08-08).

## Project

| Item | Detail |
|------|--------|
| Repository | `qa-ai-practical-assessment` |
| SUT | Practice Software Testing Toolshop |
| UI | `https://practicesoftwaretesting.com` |
| API | `https://api.practicesoftwaretesting.com` |
| Stack | Playwright Test (JavaScript), Prism-style layout under `prism-toolshop-playwright/` |

## Work completed (chronological)

### 1. UI and API automation

- **8 UI specs** (TC-UI-001–008): registration, auth/profile, products, cart, checkout billing, checkout invoice
- **8 API specs** (TC-API-001–008): auth, products, cart, invoice
- **Page objects:** Register, Login, Profile, Home, Product, Checkout, Invoices
- **API helpers:** auth, products, cart, invoice
- **Test data:** JSON templates in `prism-toolshop-playwright/test-data/`
- **Tags:** `@Smoke` on TC-UI-003, TC-UI-008, TC-API-003, TC-API-008; `@regression` on all automated cases

### 2. Initial failures and stability fixes

| Issue | Root cause | Fix |
|-------|------------|-----|
| TC-UI-006 / 007 / 008 | First home product often out of stock (`add-to-cart` disabled) | `openInStockProductByIndex()` in `HomePage.js` |
| TC-UI-006 | Cart footer total stale after quantity change | `Enter` + poll in `CheckoutPage.setProductQuantity()` |
| TC-UI-007 / 008 | Billing / `proceed-3` timing on NL checkout | `fillBilling()` waits for enabled `proceed-3`; confirmed NL address in template |
| TC-UI-008 | Invoice async after double Confirm | Poll for `INV-\d+` in `clickConfirmTwice()` |
| Full-suite flake | Shared demo SUT load | `workers: 1` in `playwright.config.js` |

**Commit:** `8a450eb` — `fix: stabilize UI checkout automation`

### 3. Documentation and execution evidence (first pass)

- Expanded `README.md` with setup, commands, folder structure, limitations
- Created `EXECUTION-SUMMARY.md` from **actual** runs (initial documentation-stage run: 13 passed, 3 failed UI)
- Updated `ai-prompts/documentation-and-summary.md` (Entry 1)

### 4. Post-fix documentation refresh

- Replaced failed run data with verified **16/16** results after stability fixes
- Updated `EXECUTION-SUMMARY.md`, `README.md` limitations/troubleshooting
- **Commits:** `56f5e57`, `8d3afb5`, `0d3ed66`

### 5. TC-UI-002 duplicate registration fix

| Item | Detail |
|------|--------|
| Failure | Expected `/auth/login` after valid registration setup; page stayed on `/auth/register` |
| Live behavior | Valid submit → login; duplicate submit → register + “already exists” error |
| Root cause | NL postcode lookup async; `fillForm()` submitted before `#street` / `#city` populated |
| Fix | `RegisterPage.js`: poll for NL lookup values; `registration.spec.js`: 30s timeout on setup login assertion |
| Validation | Registration specs 2/2; full suite 16/16 |

**Commit:** `0d3ed66` — `docs: finalize verified execution evidence` (includes TC-UI-002 fix + `automation-and-debugging.md` entry)

### 6. Report refresh and GitHub push

- Re-ran `npm test` — **16 passed**
- Updated `prism-toolshop-playwright/reports/html-report/index.html` and `results.json`
- Removed stale failure artifacts from prior flaky runs in `html-report/data/`

**Commit:** `82187ff` — `docs: refresh Playwright reports after 16/16 pass` (pushed to `origin/main`)

## Final automation status

| Command | Tests | Result |
|---------|-------|--------|
| `npm test` | 16 | 16 passed, 0 failed |
| `npm run test:smoke` | 4 | All passed (subset of regression) |
| `npm run test:regression` | 16 | 16 passed, 0 failed |
| `npm run test:ui` | 8 | All passed |
| `npm run test:api` | 8 | All passed |

## Report and evidence locations

| Artifact | Path |
|----------|------|
| HTML report | `prism-toolshop-playwright/reports/html-report/` |
| JSON results | `prism-toolshop-playwright/reports/results.json` |
| Failure evidence (on failure only) | `test-results/` |
| Execution summary | `EXECUTION-SUMMARY.md` |
| Manual cases | `FunctionalTestCase.csv` — **not executed** (`Status: ToDo`) |
| Chat history | `chat-history/SESSION-SUMMARY.md` |

## Key files modified (automation + docs)

```
prism-toolshop-playwright/
├── pages/          RegisterPage, HomePage, ProductPage, CheckoutPage (+ others)
├── tests/ui/       6 spec files (8 tests)
├── tests/api/      4 spec files (8 tests)
├── test-data/      templates + billing-ui.template.json (NL values)
└── reports/        HTML + JSON execution artifacts

README.md
EXECUTION-SUMMARY.md
chat-history/SESSION-SUMMARY.md
ai-prompts/
├── automation-and-debugging.md
├── documentation-and-summary.md
└── (requirements, test-design, test-data from earlier phases)
```

## Outstanding (not in scope of this chat)

- Manual execution of `FunctionalTestCase.csv` (8 cases)
- Submission date in `project-info.md`

## Git history (main branch)

| Commit | Summary |
|--------|---------|
| `e9fc059` | Implement planned UI and API automation |
| `8a450eb` | Stabilize UI checkout automation |
| `56f5e57` | Update final execution evidence |
| `8d3afb5` | Add execution artifacts |
| `0d3ed66` | Finalize verified execution evidence + TC-UI-002 fix |
| `82187ff` | Refresh Playwright reports after 16/16 pass |
