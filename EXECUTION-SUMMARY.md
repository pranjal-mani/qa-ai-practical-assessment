# Execution Summary

Recorded automation runs for this repository. Manual cases in `FunctionalTestCase.csv` are **not** included here unless explicitly executed and updated in the CSV.

## Latest automation run (post-fix verification)

| Field | Value |
|-------|--------|
| **Execution date** | 2026-08-08 |
| **Environment** | Windows 10 (`win32`); Node.js via local install; repo path on developer machine |
| **Browser** | Chromium — Playwright project `ui-chromium`, `devices['Desktop Chrome']` (headless) |
| **Playwright config** | `playwright.config.js` — `workers: 1`; UI timeout 60s; API default timeout 30s |
| **Commands** | `npm run test:regression` (primary verification); `npm test`, `npm run test:smoke` |

Stability fixes committed before this run: in-stock product selection (`openInStockProductByIndex`), checkout billing wait for `proceed-3`, cart quantity recalculation, and invoice polling after double Confirm.

### Full suite (`npm test`) / Regression (`npm run test:regression`)

Both commands target the same **16** automated tests (all cases carry `@regression`).

| Metric | Count |
|--------|-------|
| Total | 16 |
| Passed | 16 |
| Failed | 0 |
| Skipped | 0 |
| **Result** | **Passed** (exit code 0) |

Verified via `npm run test:regression` on 2026-08-08 after stability fixes. Previously failing UI cases (TC-UI-006, TC-UI-007, TC-UI-008) all passed in this run.

| ID | Area | Result |
|----|------|--------|
| TC-UI-001 | Registration — valid | Passed |
| TC-UI-002 | Registration — duplicate | Passed |
| TC-UI-003 | Login + profile | Passed |
| TC-UI-004 | Invalid login | Passed |
| TC-UI-005 | Search + product details | Passed |
| TC-UI-006 | Cart quantity recalculation | Passed |
| TC-UI-007 | Checkout billing validation | Passed |
| TC-UI-008 | COD checkout + My Invoices | Passed |
| TC-API-001 | Register user | Passed |
| TC-API-002 | Duplicate registration | Passed |
| TC-API-003 | Login + me | Passed |
| TC-API-004 | Invalid login | Passed |
| TC-API-005 | List + search products | Passed |
| TC-API-006 | Cart lifecycle | Passed |
| TC-API-007 | Invalid billing invoice | Passed |
| TC-API-008 | COD invoice + list | Passed |

### Smoke (`npm run test:smoke`)

| Metric | Count |
|--------|-------|
| Total | 4 |
| Passed | 4 |
| Failed | 0 |
| Skipped | 0 |
| **Result** | **Passed** |

All four `@Smoke` cases (TC-UI-003, TC-UI-008, TC-API-003, TC-API-008) passed in the regression run above.

### Report and evidence locations

| Artifact | Path | Status after latest runs |
|----------|------|---------------------------|
| HTML report | `prism-toolshop-playwright/reports/html-report/` | Generated |
| JSON results | `prism-toolshop-playwright/reports/results.json` | Generated |
| Failure evidence | `test-results/` | Created only when a test fails (screenshots, videos, `error-context.md`) |

Open HTML report:

```bash
npm run test:report
```

### Manual test suite

| Item | Status |
|------|--------|
| `FunctionalTestCase.csv` (8 cases) | **Not executed** — all rows remain `Status: ToDo` with empty `Actual Result` |
| Manual execution evidence | **Not recorded** in this document |

### Note on live SUT

The shared demo UI/API can intermittently flake under repeated back-to-back runs (slow responses, invoice async delay). Re-run when needed:

```bash
npm test
```
